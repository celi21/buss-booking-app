import mongoose, { Schema, model } from "mongoose";

// Define a sub-schema for seat details
const seatDetailsSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  seats: {
    type: Number,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
});

const bookingSchema = new Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
    bus: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Bus",
      required: true,
    },
    busType: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "BusType",
      required: true,
    },
    route: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Route",
      required: true,
    },
    from: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "City",
      required: true,
    },
    to: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "City",
      required: true,
    },
    bookingDate: {
      type: String,
    },
    bookedSeats: {
      type: [Number],
      default: [],
    },
    payment: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Payment",
      required: true,
    },
    personalDetails: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "PersonalDetails",
      required: true,
    },
    transaction_session_id: {
      type: String,
    },
    bookingId: {
      type: String,
    },
    seatDetails: [seatDetailsSchema],
    status: {
      type: String,
      default: "confirmed", //confirmed,pending,cancelled
    },
  },
  {
    timestamps: true,
  }
);

const Booking = model("Booking", bookingSchema);

export default Booking;
