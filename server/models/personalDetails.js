import mongoose, { Schema, model } from "mongoose";

const personalDetailsSchema = new Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
    firstName: {
      type: String,
      required: true,
    },
    lastName: {
      type: String,
    },
    phone: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    pickupAddress: {
      type: String,
      required: true,
    },
    dropoffAddress: {
      type: String,
      required: true,
    },
    notes: {
      type: String,
    },
    suitcases: {
      type: Number,
    },
  },
  {
    timestamps: true,
  }
);

const PersonalDetails = model("PersonalDetails", personalDetailsSchema);

export default PersonalDetails;
