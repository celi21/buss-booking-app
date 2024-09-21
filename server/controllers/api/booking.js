import mongoose, { Mongoose } from "mongoose";
import Booking from "../../models/booking.js";
import Bus from "../../models/bus.js";
import City from "../../models/City.js";
import querystring from "querystring";
import axios from "axios";

import { getDateTimeFromDate, getDayFromDate } from "./../../utils/datetime.js";
import BusAvailability from "../../models/busAvailability.js";
import PersonalDetails from "../../models/personalDetails.js";
import Payment from "../../models/payment.js";
import { v4 as uuidv4 } from "uuid";

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
  selectedToCity,
  outOfServiceDates
) => {
  let StartDate = new Date(periodStartDate);
  let EndDate = new Date(periodEndDate);
  let checkDate = new Date(date);
  const day = checkDate.getDay();
  console.log(day, getFullDayName(day), checkDate);

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

  const isOutOfService = outOfServiceDates.includes(
    checkDate.toISOString().split("T")[0]
  );

  // Return true if conditions are met
  return (
    isDateInRange &&
    isOperatingOnDay &&
    areCitiesInRightOrder &&
    !isOutOfService
  );
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
          queryObject.selectedToCity,
          bus.outOfServiceDates
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
        busType: filteredBus.busType._id,
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
};

export const confirmBusSeatsAvailability = async (req, res, next) => {
  const queryObject = req.body;
  try {
    if (
      !queryObject.selectedDate ||
      !queryObject.busId ||
      !queryObject.requestedSeats
    ) {
      return res.status(200).json({
        success: false,
        message: "Please provide complete booking data.",
      });
    }

    let busAvailability = await BusAvailability.findOne({
      bus: queryObject.busId,
      date: queryObject.selectedDate,
    });

    // If no availability record exists, create one
    if (!busAvailability) {
      return res.status(200).json({
        success: false,
        message: "No Bus Found!",
      });
    } else {
      // check if seats are available. check if available < 0
      if (busAvailability.availableSeats < 0) {
        return res.status(200).json({
          success: false,
          message:
            "It looks like the seats for this trip have been fully booked while you were filling out the form. We're sorry for the inconvenience. You can try selecting another date for booking.",
        });
      }

      if (
        parseInt(queryObject.requestedSeats) > busAvailability.availableSeats
      ) {
        return res.status(200).json({
          success: false,
          message: `It looks like the number of seats you selected is no longer available. Another booking was made while you were filling out the form, and only ${busAvailability.availableSeats} seat(s) remain for this trip. Please adjust your seat selection and try again. We apologize for the inconvenience.`,
        });
      }

      return res.status(200).json({
        success: true,
        message: "Bus Seats are available",
        busAvailability: busAvailability,
      });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

const merchantOneResultCodeTable = {
  100: "Transaction was approved. Your payment was successful.",
  200: "Transaction was declined by the processor. Please contact your card issuer.",
  201: "Do not honor. The bank has refused the transaction. Try another payment method.",
  202: "Insufficient funds. You don’t have enough funds in your account.",
  203: "Over limit. The transaction amount exceeds your credit limit.",
  204: "Transaction not allowed. This type of transaction is not allowed for your account.",
  220: "Incorrect payment information. Please check the card details and try again.",
  221: "No such card issuer. The card issuer could not be identified.",
  222: "No card number on file with issuer. The card number is not recognized by the bank.",
  223: "Expired card. Your card has expired, please use a valid card.",
  224: "Invalid expiration date. The expiration date entered is incorrect.",
  225: "Invalid card security code. The security code (CVV) entered is incorrect.",
  226: "Invalid PIN. The PIN entered is incorrect.",
  240: "Call issuer for further information. Contact your card issuer for more details.",
  250: "Pick up card. The card has been flagged by the issuer, typically for fraud prevention.",
  251: "Lost card. The card has been reported as lost.",
  252: "Stolen card. The card has been reported as stolen.",
  253: "Fraudulent card. The card has been flagged for fraudulent use.",
  260: "Declined with further instructions available. Please refer to the response text for more details.",
  261: "Declined - Stop all recurring payments. The cardholder has requested to stop recurring payments.",
  262: "Declined - Stop this recurring program. The recurring program has been stopped as per cardholder request.",
  263: "Declined - Update cardholder data available. Updated card information is available, please update the card details.",
  264: "Declined - Retry in a few days. The bank has requested to try again later.",
  300: "Transaction was rejected by the gateway. The payment gateway rejected the transaction, try again.",
  400: "Transaction error returned by processor. An error occurred during transaction processing, try again.",
  410: "Invalid merchant configuration. The merchant's account is not properly set up.",
  411: "Merchant account is inactive. The merchant account is currently inactive.",
  420: "Communication error. There was an error in communication during the transaction, try again.",
  421: "Communication error with issuer. There was an issue communicating with the card issuer.",
  430: "Duplicate transaction at processor. This transaction has already been processed.",
  440: "Processor format error. There was an error in the transaction format.",
  441: "Invalid transaction information. Some details of the transaction are incorrect.",
  460: "Processor feature not available. The feature you are trying to use is not supported.",
  461: "Unsupported card type. This type of card is not supported by the merchant.",
};

const makePayment = async (
  amount,
  ccnumber,
  expiryMonth,
  expiryYear,
  cvv,
  first_name,
  last_name,
  transaction_session_id,
  currency = "USD"
) => {
  var data = querystring.stringify({
    type: "sale",
    amount: amount,
    ccnumber: ccnumber,
    security_key: process.env.MERCHANT_ONE_SECRET_KEY,
    ccexp: `${expiryMonth}/${expiryYear}`,
    cvv: cvv,
    first_name: first_name,
    last_name: last_name,
    currency: currency,
    transaction_session_id: transaction_session_id,
  });

  const response = await axios.post(
    "https://secure.merchantonegateway.com/api/transact.php",
    data,
    {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
    }
  );

  return response.data;
};

export const confirmBooking = async (req, res, next) => {
  const bookingData = req.body;
  try {
    if (
      !bookingData.bus ||
      !bookingData.busType ||
      !bookingData.route ||
      !bookingData.from ||
      !bookingData.to ||
      !bookingData.selectedDate ||
      !bookingData.personalDetails ||
      !bookingData.paymentDetails ||
      !bookingData.selectedSeats ||
      !bookingData.requestedSeats
    ) {
      return res.status(200).json({
        success: false,
        message: "Please provide complete booking data.",
      });
    }

    // first confirm the ticket pricing
    const busId = bookingData.bus;
    const foundBus = await Bus.findById(busId).populate(
      "route busType locations locations.city ticketTypes ticketPrices"
    );

    if (!foundBus) {
      return res.status(200).json({
        success: false,
        message: "This Bus is not available. Please try again later.",
      });
    }

    let ticketsPrice = 0;
    let requestedSeats = 0;
    console.log(bookingData.selectedSeats);
    const seatsDetails = [];

    bookingData.selectedSeats.forEach((seat) => {
      let ticketPrice = foundBus.ticketPrices.find(
        (ticket) =>
          new mongoose.Types.ObjectId(seat._id).toString() ===
          ticket.ticketType.toString()
      );

      let fromLocationCity = foundBus.locations.find(
        (loc) =>
          loc.city._id.toString() ===
          new mongoose.Types.ObjectId(bookingData.from).toString()
      );
      let toLocationCity = foundBus.locations.find(
        (loc) =>
          loc.city._id.toString() ===
          new mongoose.Types.ObjectId(bookingData.to).toString()
      );

      let ticketPriceInfo = ticketPrice.prices.find(
        (p) =>
          fromLocationCity?.city._id.toString() ===
            new mongoose.Types.ObjectId(bookingData.from).toString() &&
          toLocationCity?.city._id.toString() ===
            new mongoose.Types.ObjectId(bookingData.to).toString() &&
          fromLocationCity?._id.toString() === p.fromLocationId.toString() &&
          toLocationCity?._id.toString() === p.toLocationId.toString()
      );

      if (seat.seats > 0) {
        ticketsPrice += Number(ticketPriceInfo?.price) * seat.seats;
      }
      seatsDetails.push(seat);
      requestedSeats += parseInt(seat.seats);
    });

    console.log(ticketsPrice, requestedSeats);

    // make the payment to merchant one
    let cardNumber = bookingData.paymentDetails.cardNumber;
    let expiryMonth = bookingData.paymentDetails.expiryMonth;
    let expiryYear = bookingData.paymentDetails.expiryYear;
    let cvv = bookingData.paymentDetails.cvv;
    let fullName = bookingData.paymentDetails.fullName;

    let first_name = fullName.split(" ")[0];
    let last_name =
      fullName.split(" ").length > 1 ? fullName.split(" ")[1] : "";
    let transaction_session_id = uuidv4();

    let paymentResponse = await makePayment(
      ticketsPrice,
      cardNumber,
      expiryMonth,
      expiryYear,
      cvv,
      first_name,
      last_name,
      transaction_session_id
    );
    // console.log(paymentResponse);
    if (paymentResponse) {
      console.log(paymentResponse);
      const decodedObject = paymentResponse.split("&").reduce((acc, curr) => {
        const [key, value] = curr.split("=");
        acc[key] = value || null;
        return acc;
      }, {});

      console.log(decodedObject);

      if (
        decodedObject.response_code &&
        decodedObject.response_code !== "100" &&
        decodedObject.response &&
        decodedObject.response !== "1"
      ) {
        return res.status(200).json({
          success: false,
          message:
            decodedObject.responsetext +
            ". " +
            merchantOneResultCodeTable[decodedObject.response_code],
        });
      }

      // check if pay success
      if (
        decodedObject.response_code &&
        decodedObject.response_code === "100" &&
        decodedObject.response &&
        decodedObject.response === "1" &&
        decodedObject.transactionid &&
        decodedObject.transactionid !== null
      ) {
        // create/save payment schema
        const paymentDetails = new Payment({
          firstName: first_name,
          lastName: last_name,
          transactionId: decodedObject.transactionid,
          amount: ticketsPrice,
          user: bookingData.user ? bookingData.user?.id : null,
        });

        // if pay success then save the personal details
        const personalDetails = new PersonalDetails({
          firstName: bookingData.personalDetails.firstName,
          lastName: bookingData.personalDetails.lastName,
          phone: bookingData.personalDetails.phone,
          email: bookingData.personalDetails.email,
          pickupAddress: bookingData.personalDetails.pickupAddress,
          dropoffAddress: bookingData.personalDetails.dropoffAddress,
          notes: bookingData.personalDetails.notes,
          suitcases: bookingData.personalDetails.suitcases,
          user: bookingData.user ? bookingData.user?.id : null,
        });

        await personalDetails.save();
        await paymentDetails.save();

        // finally save the booking data and send the booking id as well as confirm message
        const bookingId = Date.now();
        const newBooking = new Booking({
          bus: foundBus._id,
          busType: foundBus.busType._id,
          from: bookingData.from,
          to: bookingData.to,
          payment: paymentDetails._id,
          personalDetails: personalDetails._id,
          route: foundBus.route._id,
          bookingDate: bookingData.selectedDate,
          transaction_session_id: transaction_session_id,
          bookingId: bookingId,
          user: bookingData.user ? bookingData.user?.id : null,
          seatDetails: seatsDetails,
        });

        let busAvailability = await BusAvailability.findOne({
          bus: foundBus._id,
          date: bookingData.selectedDate,
        });

        busAvailability.availableSeats -= requestedSeats;

        await newBooking.save();
        await busAvailability.save();

        if (newBooking) {
          return res.status(200).json({
            success: true,
            message: "Booking Successfully added",
            booking: newBooking,
          });
        }
      }
    } else {
      return res.status(200).json({
        success: false,
        message: "Payment Failed. Please try again later.",
      });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

export const searchBooking = async (req, res, next) => {
  const { bookingId } = req.params;
  try {
    if (!bookingId) {
      return res.status(404).json({
        success: false,
        message: "Please provide booking Id.",
      });
    }
    const booking = await Booking.findOne({
      bookingId: bookingId,
    })
      .populate("user", "name email")
      .populate("busType", "name seats")
      .populate("from", "name")
      .populate("to", "name")
      .populate("personalDetails", "-user")
      .populate("bus", "locations")
      .populate("route", "name")
      .populate(
        "payment",
        "firstName lastName transactionId amount tax currency"
      );

    if (booking) {
      return res.status(200).json({
        success: true,
        message: "Booking found successfully.",
        booking,
      });
    } else {
      return res.status(200).json({
        success: false,
        message: "Booking with this ID was not found!",
      });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

export const fetchUserBookings = async (req, res, nex) => {
  const user = req.user;
  try {
    const bookings = await Booking.find({
      user: user.id,
    })
      .sort({
        updatedAt: -1,
      })
      .populate("busType", "name")
      .populate("from", "name")
      .populate("to", "name")
      .populate("bus", "locations")
      .populate("route", "name")
      .populate("payment", "amount tax currency");

    return res.status(200).json({
      success: true,
      bookings,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

export const addBooking = async (req, res, next) => {
  const bookingData = req.body;
  try {
    if (
      !bookingData.bus ||
      !bookingData.busType ||
      !bookingData.route ||
      !bookingData.from ||
      !bookingData.to ||
      !bookingData.selectedDate ||
      !bookingData.personalDetails ||
      !bookingData.selectedSeats ||
      !bookingData.requestedSeats
    ) {
      return res.status(200).json({
        success: false,
        message: "Please provide complete booking data.",
      });
    }

    // first confirm the ticket pricing
    const busId = bookingData.bus;
    const foundBus = await Bus.findById(busId).populate(
      "route busType locations locations.city ticketTypes ticketPrices"
    );

    if (!foundBus) {
      return res.status(200).json({
        success: false,
        message: "This Bus is not available. Please try again later.",
      });
    }

    let ticketsPrice = 0;
    let requestedSeats = 0;
    const seatsDetails = [];

    bookingData.selectedSeats.forEach((seat) => {
      let ticketPrice = foundBus.ticketPrices.find(
        (ticket) =>
          new mongoose.Types.ObjectId(seat._id).toString() ===
          ticket.ticketType.toString()
      );

      let fromLocationCity = foundBus.locations.find(
        (loc) =>
          loc.city._id.toString() ===
          new mongoose.Types.ObjectId(bookingData.from).toString()
      );
      let toLocationCity = foundBus.locations.find(
        (loc) =>
          loc.city._id.toString() ===
          new mongoose.Types.ObjectId(bookingData.to).toString()
      );

      let ticketPriceInfo = ticketPrice.prices.find(
        (p) =>
          fromLocationCity?.city._id.toString() ===
            new mongoose.Types.ObjectId(bookingData.from).toString() &&
          toLocationCity?.city._id.toString() ===
            new mongoose.Types.ObjectId(bookingData.to).toString() &&
          fromLocationCity?._id.toString() === p.fromLocationId.toString() &&
          toLocationCity?._id.toString() === p.toLocationId.toString()
      );

      if (seat.seats > 0) {
        ticketsPrice += Number(ticketPriceInfo?.price) * seat.seats;
      }
      seatsDetails.push(seat);
      requestedSeats += parseInt(seat.seats);
    });

    // create/save payment schema
    const paymentDetails = new Payment({
      firstName: bookingData.personalDetails.firstName,
      lastName: bookingData.personalDetails?.lastName,
      amount: ticketsPrice,
    });

    // if pay success then save the personal details
    const personalDetails = new PersonalDetails({
      firstName: bookingData.personalDetails.firstName,
      lastName: bookingData.personalDetails.lastName,
      phone: bookingData.personalDetails.phone,
      email: bookingData.personalDetails.email,
      pickupAddress: bookingData.personalDetails.pickupAddress,
      dropoffAddress: bookingData.personalDetails.dropoffAddress,
      notes: bookingData.personalDetails.notes,
      suitcases: bookingData.personalDetails.suitcases,
    });

    await personalDetails.save();
    await paymentDetails.save();

    // finally save the booking data and send the booking id as well as confirm message
    const bookingId = Date.now();
    const newBooking = new Booking({
      bus: foundBus._id,
      busType: foundBus.busType._id,
      from: bookingData.from,
      to: bookingData.to,
      payment: paymentDetails._id,
      personalDetails: personalDetails._id,
      route: foundBus.route._id,
      bookingDate: bookingData.selectedDate,
      bookingId: bookingId,
      seatDetails: seatsDetails,
    });

    let busAvailability = await BusAvailability.findOne({
      bus: foundBus._id,
      date: bookingData.selectedDate,
    });

    busAvailability.availableSeats -= requestedSeats;

    await newBooking.save();
    await busAvailability.save();

    if (newBooking) {
      return res.status(200).json({
        success: true,
        message: "Booking Successfully added",
        booking: newBooking,
      });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

export const fetchAdminBookings = async (req, res, nex) => {
  try {
    const bookings = await Booking.find()
      .sort({
        updatedAt: -1,
      })
      .populate("busType", "name")
      .populate("from", "name")
      .populate("to", "name")
      .populate("route", "name _id")
      .populate("bus", "locations _id")
      .populate("personalDetails", "firstName lastName email");

    return res.status(200).json({
      success: true,
      bookings,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

export const fetchPassengersList = async (req, res, nex) => {
  const { busId } = req.body;
  try {
    var now = new Date();
    var day = ("0" + now.getDate()).slice(-2);
    var month = ("0" + (now.getMonth() + 1)).slice(-2);
    var today = now.getFullYear() + "-" + month + "-" + day;

    const bookings = await Booking.find({
      bus: busId,
      bookingDate: today,
    })
      .populate("personalDetails", "firstName lastName email phone")
      .populate("from", "name")
      .populate("to", "name");

    return res.status(200).json({
      success: true,
      bookings,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

const isBookingCancelPossible = (booking) => {
  if (booking.status === "refunded" || booking.status === "cancelled") {
    return false;
  }
  // Find the departure time for the 'from' city
  const fromLocation = booking.bus.locations.find(
    (loc) =>
      new mongoose.Types.ObjectId(loc.city).toString() ===
      new mongoose.Types.ObjectId(booking.from).toString()
  );

  if (!fromLocation || !fromLocation.departureTime) {
    console.log("fromlocation");
    return false;
  }

  let bookingDate = booking.bookingDate;
  let departureTime = fromLocation.departureTime;
  let bookingDateTime = new Date(`${bookingDate} ${departureTime}`);
  let currentDateTime = Date.now();

  let timeDifference = bookingDateTime - currentDateTime;
  let hoursDifference = timeDifference / (1000 * 60 * 60);

  if (hoursDifference < 0) {
    console.log("hour 0");
    return false;
  } else if (hoursDifference <= 24) {
    console.log("hour 24");
    return false;
  } else {
    return true;
  }
};

const makeRefund = async (amount, transactionId, currency = "USD") => {
  var data = querystring.stringify({
    type: "refund",
    amount: amount,
    security_key: process.env.MERCHANT_ONE_SECRET_KEY,
    transaction_id: transactionId,
    currency: currency,
  });

  const response = await axios.post(
    "https://secure.merchantonegateway.com/api/transact.php",
    data,
    {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
    }
  );

  return response.data;
};

export const cancelBooking = async (req, res, nex) => {
  const { bookingId } = req.body;
  const user = req.user;
  try {
    const booking = await Booking.findOne({
      bookingId: bookingId,
      user: user.id,
    }).populate("bus", "locations");

    if (!booking) {
      return res.status(200).json({
        success: false,
        message: "Booking with this ID does not exist!",
      });
    }

    console.log(booking);
    console.log(booking.bus.locations);

    if (!isBookingCancelPossible(booking)) {
      return res.status(200).json({
        success: false,
        message: "This booking cannot be cancelled",
      });
    }

    const payment = await Payment.findById(booking.payment);
    if (!payment) {
      return res.status(200).json({
        success: false,
        message: "Payment for this booking cannot be found!",
      });
    }

    if (!payment.transactionId) {
      return res.status(200).json({
        success: false,
        message: "Transaction ID for this Payment cannot be found!",
      });
    }

    // first make the refund from merchant api
    let paymentResponse = await makeRefund(
      payment.amount,
      payment.transactionId
    );

    if (paymentResponse) {
      console.log(paymentResponse);
      const decodedObject = paymentResponse.split("&").reduce((acc, curr) => {
        const [key, value] = curr.split("=");
        acc[key] = value || null;
        return acc;
      }, {});

      if (
        decodedObject.response_code &&
        decodedObject.response_code !== "100" &&
        decodedObject.response &&
        decodedObject.response !== "1"
      ) {
        return res.status(200).json({
          success: false,
          message: decodedObject.responsetext,
        });
      }

      // check if refund success
      if (
        decodedObject.response_code &&
        decodedObject.response_code === "100" &&
        decodedObject.response &&
        decodedObject.response === "1" &&
        decodedObject.transactionid &&
        decodedObject.transactionid !== null
      ) {
        // update the booking schema
        booking.status = "cancelled";
        // update the availability schema
        const busAvailability = await BusAvailability.findOne({
          bus: booking.bus._id,
          date: booking.bookingDate,
        });

        console.log(busAvailability);
        console.log(booking.seatDetails);

        let seatsDetails = booking.seatDetails;
        let seatsToCancel = 0;

        // --------------------fix the seat add thing. its not adding up to availale seats
        // --------------------fix the seat add thing. its not adding up to availale seats
        // --------------------fix the seat add thing. its not adding up to availale seats
        // --------------------fix the seat add thing. its not adding up to availale seats
        // --------------------fix the seat add thing. its not adding up to availale seats
        seatsDetails.map((seat) => {
          seatsToCancel += seat.seats;
        });

        console.log(seatsToCancel);

        if (busAvailability.availableSeats >= busAvailability.totalSeats) {
          busAvailability.availableSeats = busAvailability.totalSeats;
        } else {
          busAvailability.availableSeats += seatsToCancel;
        }

        await booking.save();
        await busAvailability.save();

        console.log(busAvailability);

        return res.status(200).json({
          success: true,
          message: "Your Booking has been cancelled successfully!",
        });
      }
    } else {
      return res.status(200).json({
        success: false,
        message: "Payment Refund Failed. Please try again later.",
      });
    }

    /* 
        let busAvailability = await BusAvailability.findOne({
          bus: foundBus._id,
          date: bookingData.selectedDate,
        });

        busAvailability.availableSeats -= requestedSeats;

        await newBooking.save();
        await busAvailability.save();
    */

    return res.status(200).json({
      success: true,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Internal server error. Please try again later.",
    });
  }
};
