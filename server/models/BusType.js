import mongoose from "mongoose";

const busTypeSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    seats: {
      type: Number,
      required: true,
    },
    status: {
      type: String,
      default: "active",
    },
  },
  {
    timestamps: true,
  }
);

const BusType = mongoose.model("BusType", busTypeSchema);
export default BusType;
