import mongoose from "mongoose";

const RouteSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      default: "active",
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
    locations: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "City",
        required: true,
      },
    ],
  },
  { timestamps: true }
);

const Route = mongoose.model("Route", RouteSchema);
export default Route;
