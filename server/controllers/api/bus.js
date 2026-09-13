import mongoose from "mongoose";
import Bus from "../../models/bus.js";
import BusAvailability from "../../models/busAvailability.js";
import BusType from "../../models/BusType.js";

import { getDateTimeFromTime } from "./../../utils/datetime.js";

export const getBuses = async (req, res, next) => {
  try {
    const buses = await Bus.find({ user: req.user.id });

    return res.status(200).json({
      success: true,
      message: "Buses fetched successfully.",
      data: {
        buses,
      },
    });
  } catch (err) {
    next(err);
  }
};

export const addBus = async (req, res, next) => {
  try {
    const {
      busName,
      contactNumber,
      from,
      to,
      busRoute,
      busRouteTimes,
      busRouteFares,
      numOfSeats,
      runsOnDays,
      departure,
      arrival,
      facilities,
      fare,
      bookingPolicies,
    } = req.body;

    const newBus = new Bus({
      busName,
      contactNumber,
      from,
      to,
      busRoute,
      busRouteTimes: busRouteTimes.map((time) => getDateTimeFromTime(time)),
      busRouteFares,
      numOfSeats,
      runsOnDays,
      departure: getDateTimeFromTime(departure),
      arrival: getDateTimeFromTime(arrival),
      facilities,
      fare,
      user: req.user.id,
      bookingPolicies,
    });

    await newBus.save();

    return res.status(200).json({
      success: true,
      message: "Bus added successfully.",
      data: {
        bus: newBus,
      },
    });
  } catch (err) {
    next(err);
  }
};

export const addReview = async (req, res, next) => {
  try {
    const { busId } = req.params;
    const { rating, content } = req.body;

    const review = {
      rating,
      content,
    };

    const bus = await Bus.findByIdAndUpdate(
      busId,
      {
        $push: { reviews: review },
      },
      { new: true }
    );

    return res.status(200).json({
      success: true,
      message: "Review added successfully.",
      data: {
        bus,
      },
    });
  } catch (err) {
    next(err);
  }
};

export const getReview = async (req, res, next) => {
  try {
    const { busId } = req.params;

    const bus = await Bus.findById(busId).select("reviews");

    return res.status(200).json({
      success: true,
      message: "Reviews fetched successfully.",
      data: {
        bus,
      },
    });
  } catch (err) {
    next(err);
  }
};

export const addBusType = async (req, res, next) => {
  const { name, seats } = req.body;
  if (!name || !seats) {
    return res.status(400).json({
      success: false,
      message: "Please provide all the required fields.",
    });
  }

  try {
    const busType = new BusType({
      name,
      seats: parseInt(seats),
    });

    const savedBusType = await busType.save();

    return res.status(200).json({
      success: true,
      message: "Bus type added successfully.",
      busType: savedBusType,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

export const fetchBusTypes = async (req, res, next) => {
  try {
    const busTypes = await BusType.find();

    return res.status(200).json({
      success: true,
      message: "Bus types fetched successfully.",
      busTypes,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

export const removeBusType = async (req, res, next) => {
  const { busTypeId } = req.body;

  try {
    const busType = await BusType.findByIdAndDelete(busTypeId);

    return res.status(200).json({
      success: true,
      message: "Bus type removed successfully.",
      busType,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

export const updateBusTypeStatus = async (req, res, next) => {
  const { busTypeId, status } = req.body;
  try {
    const busType = await BusType.findByIdAndUpdate(
      busTypeId,
      { status },
      { new: true }
    );

    return res.status(200).json({
      success: true,
      message: "Bus type status updated successfully.",
      busType,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

export const updateBusType = async (req, res, next) => {
  const { _id, name, seats } = req.body;

  try {
    // Update the bus type with the new name and seat count
    const busType = await BusType.findByIdAndUpdate(
      _id,
      { name, seats },
      { new: true }
    );

    // Find all buses that use this busType
    const buses = await Bus.find({ busType: busType._id });

    console.log("busType", busType._id);
    console.log("buses", buses);

    // Loop through all buses that use this busType
    await Promise.all(
      buses.map(async (bus) => {
        // Find all availability records associated with the bus
        const availabilities = await BusAvailability.find({ bus: bus._id });

        console.log(`Bus ${bus._id} availabilities:`, availabilities);

        // Update totalSeats and availableSeats for each availability record
        await Promise.all(
          availabilities.map(async (availability) => {
            const bookedSeats =
              availability.totalSeats - availability.availableSeats;
            const newAvailableSeats = seats - bookedSeats;

            // Update availability with new totalSeats and availableSeats
            await BusAvailability.findByIdAndUpdate(availability._id, {
              totalSeats: seats,
              availableSeats: newAvailableSeats,
            });
          })
        );
      })
    );

    return res.status(200).json({
      success: true,
      message: "Bus type and availabilities updated successfully.",
      busType,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

export const AddNewBus = async (req, res, next) => {
  const busObject = req.body;
  try {
    let locations = busObject.locations.map((loc) => {
      return {
        city: loc._id,
        departureTime: loc.departureTime ? loc.departureTime : null,
        arrivalTime: loc.arrivalTime ? loc.arrivalTime : null,
      };
    });
    const newBus = new Bus({
      route: busObject.routeId,
      busType: busObject.busTypeId,
      periodStartDate: busObject.periodOperatingFrom,
      periodEndDate: busObject.periodOperatingTo,
      locations: locations,
      recurring: busObject.recurring,
    });
    await newBus.save();
    if (newBus) {
      let bus = await Bus.findById(newBus._id).populate(
        "route busType locations locations.city ticketTypes"
      );
      return res.status(200).json({
        success: true,
        message: "Bus Added Successfully",
        busObject: bus,
      });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Interval Server Error",
    });
  }
};

export const fetchBuses = async (req, res, next) => {
  try {
    const buses = await Bus.find({}).populate(
      "route busType locations locations.city ticketTypes"
    );
    return res.status(200).json({
      success: true,
      message: "Buses Fetched Successfully",
      buses,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Interval Server Error",
    });
  }
};

export const fetchBus = async (req, res, next) => {
  try {
    const { busId } = req.params;
    const bus = await Bus.findById(busId).populate(
      "route busType locations locations.city ticketTypes"
    );
    if (bus) {
      return res.status(200).json({
        success: true,
        message: "Bus Fetch Successfully",
        bus,
      });
    } else {
      return res.status(500).json({
        success: false,
        message: "Bus not found",
      });
    }
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Interval Server Error",
    });
  }
};

export const updateBus = async (req, res, next) => {
  const busObject = req.body;
  try {
    if (!busObject || !busObject.busId) {
      return res.status(400).json({
        success: false,
        message: "Bus ID is required",
      });
    }

    if (busObject.tab === "general-settings") {
      let locations = (busObject.locations || []).map((loc) => {
        return {
          ...(loc._id ? { _id: loc._id } : {}),
          city: loc.city?._id || loc.city,
          departureTime: loc.departureTime ? loc.departureTime : null,
          arrivalTime: loc.arrivalTime ? loc.arrivalTime : null,
        };
      });
      const updatedBus = await Bus.findByIdAndUpdate(
        busObject.busId,
        {
          route: busObject.routeId,
          busType: busObject.busTypeId,
          periodStartDate: busObject.periodOperatingFrom,
          periodEndDate: busObject.periodOperatingTo,
          locations: locations,
          recurring: busObject.recurring,
        },
        {
          new: true,
        }
      ).populate("route busType locations locations.city ticketTypes");

      if (updatedBus) {
        return res.status(200).json({
          success: true,
          message: "Bus Updated Successfully",
          busObject: updatedBus,
        });
      }
    } else if (busObject.tab === "out-of-service") {
      let outOfServiceDates = (busObject.dates || []).map((d) => {
        return d.date || d;
      });
      const updatedBus = await Bus.findByIdAndUpdate(
        busObject.busId,
        {
          outOfServiceDates: outOfServiceDates,
        },
        {
          new: true,
        }
      ).populate("route busType locations locations.city ticketTypes");
      if (updatedBus) {
        return res.status(200).json({
          success: true,
          message: "Bus Updated Successfully",
          busObject: updatedBus,
        });
      }
    } else if (busObject.tab === "ticket-types") {
      const ticketTypes = (busObject.ticketTypes || []).map((ticket) => {
        return {
          ...(ticket._id ? { _id: ticket._id } : {}),
          name: ticket.type || ticket.name,
        };
      });

      const updatedBus = await Bus.findByIdAndUpdate(
        busObject.busId,
        {
          ticketTypes: ticketTypes,
        },
        { new: true }
      ).populate("route busType locations locations.city ticketTypes");

      if (updatedBus) {
        return res.status(200).json({
          success: true,
          message: "Bus Updated Successfully",
          busObject: updatedBus,
        });
      }
    } else if (busObject.tab === "ticket-prices") {
      const rawTicketPrices = busObject.ticketPrices || [];
      const sanitizedTicketPrices = rawTicketPrices.map((tp) => ({
        ticketType: tp.ticketType?._id || tp.ticketType,
        prices: (tp.prices || [])
          .filter((p) => p.fromLocationId && p.toLocationId)
          .map((p) => ({
            fromLocationId: p.fromLocationId?._id || p.fromLocationId,
            toLocationId: p.toLocationId?._id || p.toLocationId,
            price: String(p.price !== undefined && p.price !== null ? p.price : 0),
          })),
      }));

      const updatedBus = await Bus.findByIdAndUpdate(
        busObject.busId,
        {
          ticketPrices: sanitizedTicketPrices,
        },
        {
          new: true,
        }
      ).populate("route busType locations locations.city ticketTypes");
      if (updatedBus) {
        return res.status(200).json({
          success: true,
          message: "Bus Updated Successfully",
          busObject: updatedBus,
        });
      }
    }

    return res.status(400).json({
      success: false,
      message: "Invalid tab or bus update operation",
    });
  } catch (error) {
    console.error("Error updating bus:", error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

export const removeBus = async (req, res, next) => {
  const { busId } = req.body;
  try {
    const bus = await Bus.findByIdAndDelete(busId);

    return res.status(200).json({
      success: true,
      message: "Bus removed successfully.",
      bus,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Internal Server Error!",
    });
  }
};
