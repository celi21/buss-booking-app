import mongoose, { Schema, model } from "mongoose";

const settingsSchema = new Schema(
  {
    tax: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

const Settings = model("Settings", settingsSchema);

export default Settings;
