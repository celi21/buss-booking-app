import Bus from "../../models/bus.js";
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

export const removeBus = async (req, res, next) => {
  try {
    const { busId } = req.params;

    const bus = await Bus.findByIdAndDelete(busId);

    return res.status(200).json({
      success: true,
      message: "Bus removed successfully.",
      data: {
        bus,
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
    const busType = await BusType.findByIdAndUpdate(
      _id,
      { name, seats },
      { new: true }
    );

    return res.status(200).json({
      success: true,
      message: "Bus type updated successfully.",
      busType,
    });
  } catch (error) {
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
    return res.status(200).json({
      success: true,
      message: "Bus Added Successfully",
      busObject: newBus,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Interval Server Error",
    });
  }
};

export const fetchBuses = async (req, res, next) => {
  try {
    const buses = await Bus.find({}).populate("route busType locations");
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
