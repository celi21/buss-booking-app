import mongoose, { Mongoose } from "mongoose";
import Booking from "../../models/booking.js";
import Bus from "../../models/bus.js";
import City from "../../models/City.js";

import { getDateTimeFromDate, getDayFromDate } from "./../../utils/datetime.js";
import BusAvailability from "../../models/busAvailability.js";

export const getUserBookings = async (req, res, next) => {
  try {
    const bookings = await Booking.find({ user: req.user.id })
      .populate("bus")
      .sort({
        createdAt: -1,
      });

    return res.status(200).json({
      success: true,
      message: "Bookings fetched successfully.",
      data: {
        bookings,
      },
    });
  } catch (err) {
    next(err);
  }
};

export const getBusBookings = async (req, res, next) => {
  try {
    const { busId } = req.params;

    const bookings = await Booking.find({ bus: busId }).sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      message: "Bookings fetched successfully.",
      data: {
        bookings,
      },
    });
  } catch (err) {
    next(err);
  }
};

export const search = async (req, res, next) => {
  try {
    const { from, to, date } = req.body;
    const day = getDayFromDate(date);

    let buses = await Bus.find({
      runsOnDays: { $in: [day] },
      $and: [{ busRoute: from }, { busRoute: to }],
    })
      .sort("fare")
      .lean();

    // Filter buses that have the from before to in route
    buses = buses.filter((bus) => {
      return bus.busRoute.indexOf(from) < bus.busRoute.indexOf(to);
    });

    for (let bus of buses) {
      const fromIndex = bus.busRoute.indexOf(from);
      const toIndex = bus.busRoute.indexOf(to);

      bus.from = bus.busRoute[fromIndex];
      bus.to = bus.busRoute[toIndex];

      bus.departure = bus.busRouteTimes[fromIndex];
      bus.arrival = bus.busRouteTimes[toIndex];

      bus.fare = bus.busRouteFares[toIndex] - bus.busRouteFares[fromIndex];

      const bookings = await Booking.find({
        bus: bus._id,
        date: getDateTimeFromDate(date),
      });

      bus.bookings = bookings;
    }

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

export const create = async (req, res, next) => {
  try {
    const { busId, from, to, date, seatNumbers, fare } = req.body;

    const newBooking = new Booking({
      user: req.user.id,
      bus: busId,
      from,
      to,
      date: getDateTimeFromDate(date),
      seatNumbers,
      fare,
    });

    await newBooking.save();

    await Bus.findByIdAndUpdate(busId, {
      $push: { bookings: newBooking },
    });

    return res.status(200).json({
      success: true,
      message: "Booking created successfully.",
      data: {
        booking: newBooking,
      },
    });
  } catch (err) {
    next(err);
  }
};

export const cancel = async (req, res, next) => {
  try {
    const { bookingId } = req.params;

    const booking = await Booking.findByIdAndUpdate(
      bookingId,
      {
        $set: { cancelled: true },
      },
      { new: true }
    );

    return res.status(200).json({
      success: true,
      message: "Booking cancelled successfully.",
      data: {
        booking,
      },
    });
  } catch (err) {
    next(err);
  }
};

export const fetchCities = async (req, res, next) => {
  try {
    const cities = await City.find();
    return res.status(200).json({
      success: true,
      cities,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

const getFullDayName = (number) => {
  const days = {
    1: "Monday",
    2: "Tuesday",
    3: "Wednesday",
    4: "Thursday",
    5: "Friday",
    6: "Saturday",
    0: "Sunday",
  };
  return days[number];
};

const filterBus = (
  periodStartDate,
  periodEndDate,
  date,
  recurring,
  locations,
  selectedFromCity,
  selectedToCity
) => {
  let StartDate = new Date(periodStartDate);
  let EndDate = new Date(periodEndDate);
  let checkDate = new Date(date);
  const day = checkDate.getDay();

  // Check if checkDate is within the start and end dates
  const isDateInRange = checkDate >= StartDate && checkDate <= EndDate;

  // Check if the recurring day matches checkDay and has checked: true
  let isOperatingOnDay = recurring.find(
    (rec) => rec.name === getFullDayName(day) && rec.checked == true
  );

  let areCitiesInRightOrder = false;
  // find from city index
  selectedFromCity = new mongoose.Types.ObjectId(selectedFromCity).toString();
  selectedToCity = new mongoose.Types.ObjectId(selectedToCity).toString();
  const fromCityIndex = locations.findIndex(
    (loc) => loc.city._id.toString() == selectedFromCity
  );
  // find to city index
  const toCityIndex = locations.findIndex(
    (loc) => loc.city._id.toString() == selectedToCity
  );

  if (fromCityIndex != -1 && toCityIndex != -1) {
    if (fromCityIndex < toCityIndex) {
      areCitiesInRightOrder = true;
    }
  }

  // Return true if conditions are met
  return isDateInRange && isOperatingOnDay && areCitiesInRightOrder;
};

export const checkBusAvailability = async (req, res, next) => {
  const queryObject = req.body;
  /* 
  {
  selectedDate: '2024-09-10',
  selectedFromCity: '66da9249114dd9be8eaf8a4a',
  selectedToCity: '66da9269114dd9be8eaf8a50'
}
  */
  try {
    if (
      !queryObject.selectedDate ||
      !queryObject.selectedFromCity ||
      !queryObject.selectedToCity
    ) {
      return res.status(404).json({
        success: false,
        message: "Please provide complete data.",
      });
    }

    // get all buses.
    const buses = await Bus.find().populate(
      "route busType locations locations.city ticketTypes ticketPrices"
    );
    if (!buses) {
      return res.status(404).json({
        success: false,
        message: "There is no available bus.",
      });
    }

    // 1. check if the selected date comes in between operating from - to date of any bus
    // 2. check if the day is in the bus recurring array as checked.
    // 3. check if the bus is going from to to city. make sure from comes first in array and then to city should come.
    let filteredBus = buses.find((bus) => {
      // console.log(bus.locations);
      if (
        filterBus(
          bus.periodStartDate,
          bus.periodEndDate,
          queryObject.selectedDate,
          bus.recurring,
          bus.locations,
          queryObject.selectedFromCity,
          queryObject.selectedToCity
        )
      ) {
        return bus;
      }
    });

    if (!filteredBus) {
      return res.status(404).json({
        success: false,
        message: "There is no available bus.",
      });
    }

    let busAvailability = await BusAvailability.findOne({
      bus: filteredBus._id,
      date: queryObject.selectedDate,
    });

    // If no availability record exists, create one
    if (!busAvailability) {
      busAvailability = new BusAvailability({
        bus: filteredBus._id,
        date: queryObject.selectedDate,
        totalSeats: filteredBus.busType.seats, // Assuming totalSeats is stored in the Bus schema
        availableSeats: filteredBus.busType.seats,
        bookedSeats: [],
      });
      await busAvailability.save();
    }

    // check if seats are available. check if bus total seats === availableSeats
    // if (busAvailability.availableSeats < 0) {
    //   return res.status(500).json({
    //     success: false,
    //     message: "There is no available bus.",
    //   });
    // }

    return res.status(200).json({
      success: true,
      message: "Bus found successfully.",
      bus: filteredBus,
      busAvailability: busAvailability,
    });

    // in above cases send error.
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
  console.log(queryObject);
};
