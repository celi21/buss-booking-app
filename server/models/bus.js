import mongoose, { Schema, model } from "mongoose";

const BusLocationSchema = new Schema(
  {
    city: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "City",
      required: true,
    },
    departureTime: {
      type: "String",
      required: false,
    },
    arrivalTime: {
      type: "String",
      required: false,
    },
  },
  {
    timestamps: true,
  }
);

const DaySchema = new Schema({
  id: {
    type: Number,
  },
  name: {
    type: String,
    required: true,
  },
  checked: {
    type: Boolean,
    required: true,
    default: false,
  },
});

const busSchema = new Schema(
  {
    status: {
      type: String,
      default: "active",
    },
    route: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Route",
      required: true,
    },
    busType: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "BusType",
      required: true,
    },
    locations: [BusLocationSchema],
    periodStartDate: {
      type: String,
    },
    periodEndDate: {
      type: String,
    },
    recurring: [DaySchema],
    outOfServiceDates: [
      {
        type: String,
      },
    ],
  },
  {
    timestamps: true,
  }
);

const Bus = model("Bus", busSchema);

export default Bus;
