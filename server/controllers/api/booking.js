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
import transporter from "../../utils/emailConfig.js";
import Settings from "../../models/settings.js";
import Stripe from "stripe";
import DeletionLog from "../../models/deletionLog.js";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  maxNetworkRetries: 2,
});

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

const retrievePayment = async (paymentIntentId) => {
  const payment = await stripe.paymentIntents.retrieve(paymentIntentId);
  if (!payment) {
    return null;
  }
  return {
    id: payment.id,
    amount: payment.amount,
    method: payment.payment_method,
  };
};

const sendConfirmationEmail = async (booking, to) => {
  console.log(booking.bus.locations);
  let departureCity = booking.bus.locations.find(
    (loc) =>
      loc.city.toString() ===
      new mongoose.Types.ObjectId(booking.from).toString()
  );
  let arrivalCity = booking.bus.locations.find(
    (loc) =>
      loc.city.toString() === new mongoose.Types.ObjectId(booking.to).toString()
  );
  const routeName = booking.route.name;
  let departureTime = departureCity.departureTime;
  let arrivalTime = arrivalCity.arrivalTime;

  let fullRouteAndTime = routeName + ", " + departureTime + " - " + arrivalTime;

  const html = `
  <div style="background-color:#d2c7ba">
    <table border="0" cellpadding="0" cellspacing="0" width="100%">
      <tbody>
        <tr>
          <td align="center" bgcolor="#1e90ff">
            <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width:600px">
              <tbody>
                <tr>
                  <td align="center" valign="top" style="padding:36px 24px">
                    <a href="https://buenoexpresstransport.com" style="display:inline-block" target="_blank">
                      <img src="https://buenoexpresstransport.com/logo.png" alt="Logo" border="0" style="display:block;width:100px;max-width:100px;min-width:100px">
                    </a>
                  </td>
                </tr>
              </tbody>
            </table>
          </td>
        </tr>
        <tr>
          <td align="center" bgcolor="#1e90ff">
            <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width:600px">
              <tbody>
              <tr>
                <td align="left" bgcolor="#ffffff" style="padding:36px 24px 0;font-family:Source Sans Pro,Helvetica,Arial,sans-serif;border-top:3px solid #d4dadf">
                  <h1 style="margin:0;font-size:32px;font-weight:700;letter-spacing:-1px;line-height:48px">Thank you for your booking!</h1>
                </td>
            </tr>
          </tbody></table>
        </td>
      </tr>
      <tr>
        <td align="center" bgcolor="#1e90ff">
          <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width:600px">
  
            <tbody><tr>
              <td align="left" bgcolor="#ffffff" style="padding:24px;font-family:Source Sans Pro,Helvetica,Arial,sans-serif;font-size:16px;line-height:24px">
                <p style="margin:0">Here is a summary of your recent booking. If you have any questions or concerns about your booking, please <a href="https://www.buenoexpresstransport.com" target="_blank">Contact Us</a>.</p>
              </td>
            </tr>
            <tr>
              <td align="left" bgcolor="#ffffff" style="padding:24px;font-family:Source Sans Pro,Helvetica,Arial,sans-serif;font-size:16px;line-height:24px">
                <table border="0" cellpadding="0" cellspacing="0" width="100%">
                  <tbody><tr>
                    <td colspan="2" bgcolor="#1e90ff" width="75%" style="padding:12px;font-family:Source Sans Pro,Helvetica,Arial,sans-serif;font-size:16px;line-height:24px;color:#fff;text-align:center"><strong>Booking Details</strong></td>
                  </tr>

                  <tr>
                    <td align="left" width="45%" style="padding:6px 12px;font-family:Source Sans Pro,Helvetica,Arial,sans-serif;font-size:16px;line-height:24px">Booking ID</td>
                    <td align="left" width="25%" style="padding:6px 12px;font-family:Source Sans Pro,Helvetica,Arial,sans-serif;font-size:16px;line-height:24px">${booking.bookingId
    }</td>
                  </tr>
                  
                  <tr>
                    <td align="left" width="45%" style="padding:6px 12px;font-family:Source Sans Pro,Helvetica,Arial,sans-serif;font-size:16px;line-height:24px">First name</td>
                    <td align="left" width="25%" style="padding:6px 12px;font-family:Source Sans Pro,Helvetica,Arial,sans-serif;font-size:16px;line-height:24px">${booking.personalDetails.firstName
    }</td>
                  </tr>

                  <tr>
                    <td align="left" width="75%" style="padding:6px 12px;font-family:Source Sans Pro,Helvetica,Arial,sans-serif;font-size:16px;line-height:24px">Last name</td>
                    <td align="left" width="25%" style="padding:6px 12px;font-family:Source Sans Pro,Helvetica,Arial,sans-serif;font-size:16px;line-height:24px">${booking.personalDetails.lastName
      ? booking.personalDetails.lastName
      : ""
    }</td>
                  </tr>

                  <tr>
                    <td align="left" width="75%" style="padding:6px 12px;font-family:Source Sans Pro,Helvetica,Arial,sans-serif;font-size:16px;line-height:24px">Phone</td>
                    <td align="left" width="25%" style="padding:6px 12px;font-family:Source Sans Pro,Helvetica,Arial,sans-serif;font-size:16px;line-height:24px">${booking.personalDetails.phone
    }</td>
                  </tr>
                  
                  <tr>
                    <td align="left" width="75%" style="padding:6px 12px;font-family:Source Sans Pro,Helvetica,Arial,sans-serif;font-size:16px;line-height:24px">Email</td>
                    <td align="left" width="25%" style="padding:6px 12px;font-family:Source Sans Pro,Helvetica,Arial,sans-serif;font-size:16px;line-height:24px"><a href="mailto:${booking.personalDetails.email
    }" target="_blank">${booking.personalDetails.email}</a></td>
                  </tr>
                    <tr>
                    </tr><tr>
                    <td align="left" width="75%" style="padding:6px 12px;font-family:Source Sans Pro,Helvetica,Arial,sans-serif;font-size:16px;line-height:24px">Booking Route</td>
                    <td align="left" width="25%" style="padding:6px 12px;font-family:Source Sans Pro,Helvetica,Arial,sans-serif;font-size:16px;line-height:24px">${fullRouteAndTime}</td>
                  </tr>
                  
                  
                  <tr>
                    <td align="left" width="75%" style="padding:6px 12px;font-family:Source Sans Pro,Helvetica,Arial,sans-serif;font-size:16px;line-height:24px">Booking Date</td>
                    <td align="left" width="25%" style="padding:6px 12px;font-family:Source Sans Pro,Helvetica,Arial,sans-serif;font-size:16px;line-height:24px">${booking.bookingDate
    }</td>
                  </tr>
                  
                  
                  <tr>
                    <td align="left" width="75%" style="padding:6px 12px;font-family:Source Sans Pro,Helvetica,Arial,sans-serif;font-size:16px;line-height:24px">Pickup address</td>
                    <td align="left" width="25%" style="padding:6px 12px;font-family:Source Sans Pro,Helvetica,Arial,sans-serif;font-size:16px;line-height:24px">${booking.personalDetails.pickupAddress
    }</td>
                  </tr>
  
                  <tr>
                    <td align="left" width="75%" style="padding:6px 12px;font-family:Source Sans Pro,Helvetica,Arial,sans-serif;font-size:16px;line-height:24px">Dropoff address</td>
                    <td align="left" width="25%" style="padding:6px 12px;font-family:Source Sans Pro,Helvetica,Arial,sans-serif;font-size:16px;line-height:24px">${booking.personalDetails.dropoffAddress
    }</td>
                  </tr>

                  <tr>
                    <td align="left" width="75%" style="padding:6px 12px;font-family:Source Sans Pro,Helvetica,Arial,sans-serif;font-size:16px;line-height:24px">Suitcases</td>
                    <td align="left" width="25%" style="padding:6px 12px;font-family:Source Sans Pro,Helvetica,Arial,sans-serif;font-size:16px;line-height:24px">${booking.personalDetails.suitcases
    }</td>
                  </tr>
                  
                  <tr>
                    <td align="left" width="75%" style="padding:6px 12px;font-family:Source Sans Pro,Helvetica,Arial,sans-serif;font-size:16px;line-height:24px">Seats</td>
                    <td align="left" width="25%" style="padding:6px 12px;font-family:Source Sans Pro,Helvetica,Arial,sans-serif;font-size:16px;line-height:24px">
                    ${booking.seatDetails
      .map(
        (seat) =>
          seat.seats > 0 && `${seat.name} x ${seat.seats}`
      )
      .filter(Boolean)
      .join("<br />")}
                    </td>
                  </tr>
                  
                  <tr>
                    <td align="left" width="75%" style="padding:12px;font-family:Source Sans Pro,Helvetica,Arial,sans-serif;font-size:16px;line-height:24px;border-top:2px dashed #1e90ff;border-bottom:2px dashed #1e90ff"><strong>Total Amount</strong></td>
                    <td align="left" width="25%" style="padding:12px;font-family:Source Sans Pro,Helvetica,Arial,sans-serif;font-size:16px;line-height:24px;border-top:2px dashed #1e90ff;border-bottom:2px dashed #1e90ff"><strong>$${booking.flexOption == true
      ? booking.payment.amount + 8 + booking.payment.tax
      : booking.payment.amount + booking.payment.tax
    }</strong></td>
                  </tr>
                </tbody></table>
              </td>
            </tr>
          </tbody></table>
        </td>
      </tr>
      <tr>
        <td align="center" bgcolor="#1e90ff" style="padding:24px">
          <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width:600px">
            <tbody>
            <tr>
              <td align="center" bgcolor="#1e90ff" style="padding:12px 24px;">
                <a href="${process.env.FRONTEND_URL}/booking/${booking.bookingId
    }" target="_blank" style="
                    display: block;
                    background: white;
                    color: #1e90ff;
                    text-align: center;
                    padding: 10px 30px;
                    border-radius: 5px;
                    text-decoration: none;
                    font-weight: 600;
                    width: fit-content;
                    margin: auto;
                    margin-top: 0px;
                    font-size: 16px;
                ">View Complete Details on Website</a>
              </td>
            </tr>

            <tr>
              <td align="center" bgcolor="#1e90ff" style="padding:12px 24px;">
                <p style="margin:0"><a href="http://buenoexpresstransport.com" target="_blank" style="font-family:Source Sans Pro,Helvetica,Arial,sans-serif;font-size:14px;line-height:20px;color:#fff">buenoexpresstransport.com</a></p>
              </td>
            </tr>
          </tbody></table>
        </td>
      </tr>
    </tbody></table><div class="yj6qo"></div><div class="adL">
  </div>
  </div>
  `;

  const mailOptions = {
    from: "joharkhan2001@gmail.com",
    to: to,
    subject: "Bueno Express Bus Booking Details",
    html: html,
  };

  transporter.sendMail(mailOptions, (error, info) => {
    console.log(info);
  });
};

// Helper function to create a single booking
const createSingleBooking = async (bookingData, paymentDetailsId, personalDetailsId) => {
  const busId = bookingData.bus;
  const foundBus = await Bus.findById(busId).populate(
    "route busType locations locations.city ticketTypes ticketPrices"
  );

  if (!foundBus) {
    throw new Error("This Bus is not available. Please try again later.");
  }

  let requestedSeats = 0;
  const seatsDetails = [];

  bookingData.selectedSeats.forEach((seat) => {
    seatsDetails.push(seat);
    requestedSeats += parseInt(seat.seats);
  });

  // finally save the booking data and send the booking id as well as confirm message
  const bookingId = Date.now() + (bookingData.isReturnTrip ? 1 : 0); // Ensure unique IDs
  const newBooking = new Booking({
    bus: foundBus._id,
    busType: foundBus.busType._id,
    from: bookingData.from,
    to: bookingData.to,
    payment: paymentDetailsId,
    personalDetails: personalDetailsId,
    route: foundBus.route._id,
    bookingDate: bookingData.selectedDate,
    transaction_session_id: bookingData.transaction_session_id || null,
    bookingId: bookingId,
    user: bookingData.user ? bookingData.user?.id : null,
    seatDetails: seatsDetails,
    flexOption: bookingData.flexOption || false,
    tripType: bookingData.tripType || 'one-way',
    isReturnTrip: bookingData.isReturnTrip || false,
    linkedBookingId: bookingData.linkedBookingId || null,
  });

  let busAvailability = await BusAvailability.findOne({
    bus: foundBus._id,
    date: bookingData.selectedDate,
  });

  if (!busAvailability) {
    throw new Error("Bus availability not found.");
  }

  busAvailability.availableSeats -= requestedSeats;

  await newBooking.save();
  await busAvailability.save();

  return newBooking;
};

export const createPaymentIntent = async (req, res, next) => {
  try {
    if (!req.body.ticketsPrice) {
      return res.status(200).json({
        success: false,
        message: "Please provide complete booking price data.",
      });
    }

    let totalTicketsPrice = Number(req.body.ticketsPrice);

    const settings = await Settings.find({});
    if (settings[0]?.tax && settings[0]?.tax >= 0) {
      let taxAmount = (Number(settings[0].tax) / 100) * req.body.ticketsPrice;
      totalTicketsPrice = totalTicketsPrice + taxAmount;
    }

    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(totalTicketsPrice * 100),
      currency: "usd",
      automatic_payment_methods: {
        enabled: true,
      },
      metadata: {
        title: "Bueno Express Transport bus booking payment.",
      },
      description: "Payment for Bus reservation/booking wih Bueno Express.",
    });
    if (paymentIntent) {
      return res.send({ client_secret: paymentIntent.client_secret });
    }

    return res.status(500).send({ error: "Failed to create payment intent" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};
export const confirmBooking = async (req, res, next) => {
  const bookingData = req.body?.bookingData;
  const stripeData = req.body?.stripeData;
  const returnBookingData = req.body?.returnBookingData; // For round-trip

  try {
    if (
      !bookingData ||
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

    if (!stripeData || !stripeData.paymentId) {
      return res.status(200).json({
        success: false,
        message: "Please provide complete Payment details.",
      });
    }

    // Check if this is a round-trip booking
    const isRoundTrip = bookingData.tripType === 'round-trip' && returnBookingData;

    if (isRoundTrip && (!returnBookingData.bus || !returnBookingData.selectedDate)) {
      return res.status(200).json({
        success: false,
        message: "Please provide complete return trip data.",
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

    const settings = await Settings.find({});
    const taxRate = settings[0]?.tax || 0;
    const taxAmount = (Number(taxRate) / 100) * ticketsPrice;

    let paymentResponse = await retrievePayment(stripeData.paymentId);
    if (paymentResponse && paymentResponse.id) {
      console.log(paymentResponse);

      // Create shared payment and personal details records
      const paymentDetails = new Payment({
        transactionId: stripeData.paymentId,
        amount: ticketsPrice,
        user: bookingData.user ? bookingData.user?.id : null,
        tax: taxAmount,
      });

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

      // Prepare outbound booking data
      const outboundData = {
        ...bookingData,
        transaction_session_id: stripeData.paymentId,
      };

      // Create outbound booking
      const outboundBooking = await createSingleBooking(outboundData, paymentDetails._id, personalDetails._id);

      let returnBooking = null;
      if (isRoundTrip) {
        // Prepare return booking data
        const returnData = {
          ...returnBookingData,
          tripType: 'round-trip',
          isReturnTrip: true,
          linkedBookingId: outboundBooking.bookingId.toString(),
          user: bookingData.user,
          flexOption: bookingData.flexOption,
          transaction_session_id: stripeData.paymentId,
        };

        returnBooking = await createSingleBooking(returnData, paymentDetails._id, personalDetails._id);

        // Update outbound booking with linked return booking ID
        outboundBooking.linkedBookingId = returnBooking.bookingId.toString();
        await outboundBooking.save();
      }

      // Populate and send response
      const populatedOutbound = await Booking.findById(outboundBooking._id)
        .populate("payment")
        .populate("personalDetails")
        .populate("bus")
        .populate("route")
        .populate("from")
        .populate("to");

      await sendConfirmationEmail(populatedOutbound, populatedOutbound.personalDetails.email);

      const response = {
        success: true,
        message: isRoundTrip ? "Round-trip booking successfully added" : "Booking Successfully added",
        booking: populatedOutbound,
      };

      if (returnBooking) {
        const populatedReturn = await Booking.findById(returnBooking._id)
          .populate("payment")
          .populate("personalDetails")
          .populate("bus")
          .populate("route")
          .populate("from")
          .populate("to");
        response.returnBooking = populatedReturn;
        await sendConfirmationEmail(populatedReturn, populatedReturn.personalDetails.email);
      }

      return res.status(200).json(response);
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
      status: bookingData.status ? bookingData.status : "confirmed",
      isAddedByAdmin: true,
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

export const updateBooking = async (req, res, next) => {
  const bookingData = req.body;
  try {
    if (
      !bookingData.bus ||
      !bookingData.bookingId ||
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

    // confirm if booking exist
    const booking = await Booking.findOne({
      bookingId: bookingData.bookingId,
    });
    if (!booking) {
      return res.status(200).json({
        success: false,
        message: "This Booking is not available. Please try again later.",
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
    let previousBookedSeats = 0;
    const seatsDetails = [];

    booking.seatDetails.forEach((seat) => {
      previousBookedSeats += parseInt(seat.seats);
    });

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

    // if both new date and bus is changed then
    // Step 1: Check if either bus or date has changed
    if (
      booking.bus.toString() !== bookingData.bus.toString() || // Bus change
      new Date(booking.bookingDate).getTime() !==
      new Date(bookingData.selectedDate).getTime() // Date change
    ) {
      // Step 2: Handle Previous Bus Availability
      let previousAvailability = await BusAvailability.findOne({
        bus: booking.bus,
        date: booking.bookingDate,
      });

      if (previousAvailability) {
        previousAvailability.availableSeats += previousBookedSeats; // Revert seats from old booking
        await previousAvailability.save();
      }

      // Step 3: Check the new availability for the new bus and date
      let newBusAvailability = await BusAvailability.findOne({
        bus: bookingData.bus,
        date: bookingData.selectedDate,
      });

      // Step 4: Handle if new availability does not exist
      if (!newBusAvailability) {
        const totalSeats = foundBus.busType.seats;

        // Ensure the requested seats are not more than the bus capacity
        if (requestedSeats > totalSeats) {
          return res.status(400).json({
            success: false,
            message: "Requested seats exceed the bus capacity.",
          });
        }

        // Create new availability record if none exists
        newBusAvailability = new BusAvailability({
          bus: bookingData.bus,
          date: bookingData.selectedDate,
          totalSeats: totalSeats,
          availableSeats: totalSeats - requestedSeats,
        });
        await newBusAvailability.save();
      } else {
        // Step 5: Check if the new bus has enough seats available
        if (newBusAvailability.availableSeats < requestedSeats) {
          return res.status(400).json({
            success: false,
            message:
              "Not enough available seats on the new bus for the selected date.",
          });
        }
        // Deduct requested seats from new availability
        newBusAvailability.availableSeats -= requestedSeats;
        await newBusAvailability.save();
      }
    } else {
      // Step 1: Handle case when bus and date are the same, but requested seats have changed
      const seatDifference = requestedSeats - previousBookedSeats; // Calculate the difference in seats

      // Step 2: Fetch the availability for the current bus and date
      let currentAvailability = await BusAvailability.findOne({
        bus: booking.bus,
        date: booking.bookingDate,
      });

      if (!currentAvailability) {
        return res.status(400).json({
          success: false,
          message: "Bus availability not found for the selected date.",
        });
      }

      // Step 3: Handle case when the requested seats have increased
      if (seatDifference > 0) {
        // Ensure the bus has enough available seats to accommodate the increase
        if (currentAvailability.availableSeats < seatDifference) {
          return res.status(400).json({
            success: false,
            message:
              "Not enough available seats to accommodate the increased booking.",
          });
        }

        // Decrease the available seats by the seat difference
        currentAvailability.availableSeats -= seatDifference;
      }

      // Step 4: Handle case when the requested seats have decreased
      else if (seatDifference < 0) {
        // Increase the available seats by the seat difference (it's negative, so it adds back seats)
        currentAvailability.availableSeats += Math.abs(seatDifference);
      }

      // Step 5: Save the updated availability
      await currentAvailability.save();
    }

    // update payment details
    await Payment.findByIdAndUpdate(booking.payment, {
      amount: ticketsPrice,
    });

    // update personal details
    await PersonalDetails.findByIdAndUpdate(booking.personalDetails, {
      firstName: bookingData.personalDetails.firstName,
      lastName: bookingData.personalDetails.lastName,
      phone: bookingData.personalDetails.phone,
      email: bookingData.personalDetails.email,
      pickupAddress: bookingData.personalDetails.pickupAddress,
      dropoffAddress: bookingData.personalDetails.dropoffAddress,
      notes: bookingData.personalDetails.notes,
      suitcases: bookingData.personalDetails.suitcases,
    });

    // finally save the booking data and send the booking id as well as confirm message
    await Booking.findByIdAndUpdate(booking._id, {
      bus: foundBus._id,
      busType: foundBus.busType._id,
      from: bookingData.from,
      to: bookingData.to,
      route: foundBus.route._id,
      bookingDate: bookingData.selectedDate,
      seatDetails: seatsDetails,
    });

    return res.status(200).json({
      success: true,
      message: "Booking Successfully added",
    });
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
    console.log(error);
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
      status: {
        $in: ["pending", "confirmed"],
      },
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
    return false;
  }

  let bookingDate = booking.bookingDate;
  let departureTime = fromLocation.departureTime;
  let bookingDateTime = new Date(`${bookingDate} ${departureTime}`);
  let currentDateTime = Date.now();

  let timeDifference = bookingDateTime - currentDateTime;
  let hoursDifference = timeDifference / (1000 * 60 * 60);

  if (hoursDifference < 0) {
    return false;
  } else if (hoursDifference <= 24) {
    return false;
  } else {
    return true;
  }
};

const makeRefund = async (amount, transactionId, currency = "USD") => {
  try {
    // Use Stripe refund API
    const refund = await stripe.refunds.create({
      payment_intent: transactionId,
    });

    // Return response in format expected by existing code
    return `response_code=100&response=1&transactionid=${refund.id}&responsetext=SUCCESS`;
  } catch (error) {
    console.error("Stripe refund error:", error);
    const errorMessage = error.message || "Transaction not found";
    return `response_code=300&response=0&responsetext=${errorMessage}`;
  }
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

    // Process refund via Stripe API
    let paymentResponse = await makeRefund(
      payment.amount,
      payment.transactionId
    );

    if (paymentResponse) {
      console.log(paymentResponse);
      const decodedObject = paymentResponse.split("&").reduce((acc, curr) => {
        const [key, value] = curr.split("=");
        acc[key] = decodeURIComponent(value || "");
        return acc;
      }, {});

      // check if refund success
      if (
        decodedObject.response_code === "100" &&
        decodedObject.response === "1" &&
        decodedObject.transactionid
      ) {
        // update the booking schema
        booking.status = "cancelled";
        payment.isRefunded = true;
        // update the availability schema
        const busAvailability = await BusAvailability.findOne({
          bus: booking.bus._id,
          date: booking.bookingDate,
        });

        let seatsDetails = booking.seatDetails;
        let seatsToCancel = 0;
        seatsDetails.map((seat) => {
          seatsToCancel += seat.seats;
        });

        if (busAvailability.availableSeats >= busAvailability.totalSeats) {
          busAvailability.availableSeats = busAvailability.totalSeats;
        } else {
          busAvailability.availableSeats += seatsToCancel;
        }

        await booking.save();
        await busAvailability.save();
        await payment.save();

        return res.status(200).json({
          success: true,
          message: "Your Booking has been cancelled successfully!",
        });
      } else {
        // Refund failed
        return res.status(200).json({
          success: false,
          message: decodedObject.responsetext || "Payment Refund Failed. Please try again later.",
        });
      }
    } else {
      return res.status(200).json({
        success: false,
        message: "Payment Refund Failed. Please try again later.",
      });
    }

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

export const changeBookingStatus = async (req, res, next) => {
  let { bookingId, status } = req.body;
  try {
    if (!bookingId || !status) {
      return res.status(404).json({
        success: false,
        message: "Please provide booking Id and status.",
      });
    }
    status = status.toLowerCase();

    // find booking
    const booking = await Booking.findById(bookingId);

    if (!booking) {
      return res.status(200).json({
        success: false,
        message: `Booking with ID: ${bookingId} was not found!`,
      });
    }

    // if status is confirmed or pending then just update the status
    if (status === "pending") {
      booking.status = "pending";
      await booking.save();
      return res.status(200).json({
        success: true,
        message: `Booking status updated to pending.`,
      });
    } else if (status === "confirmed") {
      // if new status is confirm and if it was already cancel or refund then update to confirm and decrement the availability available seats
      if (booking.status === "cancelled" || booking.status === "refunded") {
        const busAvailability = await BusAvailability.findOne({
          bus: booking.bus,
          date: booking.bookingDate,
        });

        let seatsDetails = booking.seatDetails;
        let seatsToConfirm = 0;
        seatsDetails.map((seat) => {
          seatsToConfirm += seat.seats;
        });
        busAvailability.availableSeats -= seatsToConfirm;
        booking.status = status;
        await booking.save();
        await busAvailability.save();
      } else if (
        booking.status === "confirmed" ||
        booking.status === "pending"
      ) {
        booking.status = status;
        await booking.save();
      }
      return res.status(200).json({
        success: true,
        message: `Booking status updated to ${status}.`,
      });
    } else if (status === "cancelled" || status === "refunded") {
      if (booking.status === "pending" || booking.status === "confirmed") {
        // if current status is pending or confirmed then first check if booking is added by admin.
        // if booking added by admin then just update the status and available seats
        if (booking.isAddedByAdmin === true) {
          booking.status = status;
          const busAvailability = await BusAvailability.findOne({
            bus: booking.bus,
            date: booking.bookingDate,
          });

          let seatsDetails = booking.seatDetails;
          let seatsToCancel = 0;
          seatsDetails.map((seat) => {
            seatsToCancel += seat.seats;
          });
          busAvailability.availableSeats += seatsToCancel;
          await booking.save();
          await busAvailability.save();

          return res.status(200).json({
            success: true,
            message: `Booking status updated to ${status}.`,
          });
        } else {
          // if its not added by admin then check if it is refunded.
          // if its refunded then just update the status as well as the seats
          const payment = await Payment.findById(booking.payment);

          console.log('Payment object:', payment);
          console.log('Transaction ID:', payment?.transactionId);
          console.log('Transaction ID type:', typeof payment?.transactionId);

          if (!payment) {
            // If no payment record exists, just update status without refund
            booking.status = status;
            const busAvailability = await BusAvailability.findOne({
              bus: booking.bus,
              date: booking.bookingDate,
            });

            let seatsDetails = booking.seatDetails;
            let seatsToCancel = 0;
            seatsDetails.map((seat) => {
              seatsToCancel += seat.seats;
            });
            busAvailability.availableSeats += seatsToCancel;
            await booking.save();
            await busAvailability.save();

            return res.status(200).json({
              success: true,
              message: `Booking status updated to ${status}. No payment record found.`,
            });
          }

          if (payment.isRefunded === true) {
            booking.status = status;
            const busAvailability = await BusAvailability.findOne({
              bus: booking.bus,
              date: booking.bookingDate,
            });

            let seatsDetails = booking.seatDetails;
            let seatsToCancel = 0;
            seatsDetails.map((seat) => {
              seatsToCancel += seat.seats;
            });
            busAvailability.availableSeats += seatsToCancel;
            await booking.save();
            await busAvailability.save();

            return res.status(200).json({
              success: true,
              message: `Booking status updated to ${status}. Payment has already been refunded.`,
            });
          } else if (!payment.transactionId || (typeof payment.transactionId === 'string' && !payment.transactionId.startsWith('pi_')) || typeof payment.transactionId === 'number') {
            // If there's no valid Stripe transaction ID, just update status without refund
            console.log('Skipping refund - invalid transaction ID');
            booking.status = status;
            const busAvailability = await BusAvailability.findOne({
              bus: booking.bus,
              date: booking.bookingDate,
            });

            let seatsDetails = booking.seatDetails;
            let seatsToCancel = 0;
            seatsDetails.map((seat) => {
              seatsToCancel += seat.seats;
            });
            busAvailability.availableSeats += seatsToCancel;
            await booking.save();
            await busAvailability.save();

            return res.status(200).json({
              success: true,
              message: `Booking status updated to ${status}. No payment to refund.`,
            });
          } else {
            // if not refunded then run the makeRefund function to refund to user
            // and update the status as well as seats
            // Process refund via Stripe API
            let paymentResponse = await makeRefund(
              payment.amount,
              payment.transactionId
            );

            if (paymentResponse) {
              console.log(paymentResponse);
              const decodedObject = paymentResponse
                .split("&")
                .reduce((acc, curr) => {
                  const [key, value] = curr.split("=");
                  acc[key] = decodeURIComponent(value || "");
                  return acc;
                }, {});

              // check if refund success
              if (
                decodedObject.response_code === "100" &&
                decodedObject.response === "1" &&
                decodedObject.transactionid
              ) {
                // update the booking schema
                booking.status = status;
                payment.isRefunded = true;
                // update the availability schema
                const busAvailability = await BusAvailability.findOne({
                  bus: booking.bus,
                  date: booking.bookingDate,
                });

                let seatsDetails = booking.seatDetails;
                let seatsToCancel = 0;
                seatsDetails.map((seat) => {
                  seatsToCancel += seat.seats;
                });

                if (
                  busAvailability.availableSeats >= busAvailability.totalSeats
                ) {
                  busAvailability.availableSeats = busAvailability.totalSeats;
                } else {
                  busAvailability.availableSeats += seatsToCancel;
                }

                await booking.save();
                await busAvailability.save();
                await payment.save();

                return res.status(200).json({
                  success: true,
                  message: `Your Booking has been ${status} successfully! Refund if applicable is being processed.`,
                });
              } else {
                // Refund failed
                return res.status(200).json({
                  success: false,
                  message: decodedObject.responsetext || "Payment Refund Failed. Please try again later.",
                });
              }
            } else {
              return res.status(200).json({
                success: false,
                message: "Payment Refund Failed. Please try again later.",
              });
            }
          }
        }
      } else if (
        booking.status === "cancelled" ||
        booking.status === "refunded"
      ) {
        // if current status is cancelled or refunded then just update the status
        booking.status = status;
        await booking.save();
      }
      return res.status(200).json({
        success: true,
        message: `Booking status updated to ${status}.`,
      });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Internal server error. Please try again later.",
    });
  }
};

export const deleteBooking = async (req, res, next) => {
  try {
    const { bookingId } = req.body;

    if (!bookingId) {
      return res.status(400).json({
        success: false,
        message: "Booking ID is required.",
      });
    }

    // Find the booking with all related data
    const booking = await Booking.findOne({ bookingId })
      .populate("bus route from to personalDetails payment busType");

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: "Booking not found.",
      });
    }

    // Restore seat availability
    const busAvailability = await BusAvailability.findOne({
      bus: booking.bus._id,
      date: booking.bookingDate,
    });

    if (busAvailability) {
      // Calculate total seats from seatDetails
      let totalSeats = 0;
      booking.seatDetails.forEach((seat) => {
        totalSeats += parseInt(seat.seats);
      });

      busAvailability.availableSeats += totalSeats;
      await busAvailability.save();
    }

    // Create deletion log
    const deletionLog = new DeletionLog({
      bookingId: booking.bookingId,
      bookingDetails: {
        customerName: `${booking.personalDetails?.firstName || ''} ${booking.personalDetails?.lastName || ''}`,
        email: booking.personalDetails?.email,
        phone: booking.personalDetails?.phone,
        route: booking.route?.name,
        from: booking.from?.name,
        to: booking.to?.name,
        bookingDate: booking.bookingDate,
        seatDetails: booking.seatDetails,
        status: booking.status,
        totalAmount: booking.payment?.amount,
      },
      deletedBy: req.user.id,
      reason: "Deleted by admin",
    });

    await deletionLog.save();

    // Delete the booking
    await Booking.findOneAndDelete({ bookingId });

    return res.status(200).json({
      success: true,
      message: "Booking deleted successfully and seats restored.",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Internal server error. Please try again later.",
    });
  }
};

export const fetchDeletionLogs = async (req, res, next) => {
  try {
    const logs = await DeletionLog.find()
      .populate("deletedBy", "name email")
      .sort({ deletedAt: -1 });

    return res.status(200).json({
      success: true,
      message: "Deletion logs fetched successfully.",
      data: {
        logs,
      },
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Internal server error. Please try again later.",
    });
  }
};