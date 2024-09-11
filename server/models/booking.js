import mongoose, { Schema, model } from "mongoose";

const bookingSchema = new Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
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
    availableSeats: {
      type: Number,
      required: true,
    },
    // payment:{
    //   type: mongoose.Schema.Types.ObjectId,
    //   ref: "Payment",
    //   required: true,
    // },
    // personalDetails:{
    //   type: mongoose.Schema.Types.ObjectId,
    //   ref: "PersonalDetails",
    //   required: true,
    // }
  },
  {
    timestamps: true,
  }
);

const Booking = model("Booking", bookingSchema);

export default Booking;
