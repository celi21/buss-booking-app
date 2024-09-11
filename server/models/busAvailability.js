import mongoose, { Schema, model } from "mongoose";

const busAvailabilitySchema = new Schema(
  {
    bus: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Bus",
      required: true,
    },
    date: {
      type: String,
      required: true, // Store the date as a string (or Date type) to track each day's availability
    },
    totalSeats: {
      type: Number,
      required: true,
    },
    availableSeats: {
      type: Number,
      required: true,
    },
    bookedSeats: {
      type: [Number], // Keep an array of booked seat numbers
      default: [],
    },
  },
  {
    timestamps: true,
  }
);

const BusAvailability = model("BusAvailability", busAvailabilitySchema);

export default BusAvailability;
