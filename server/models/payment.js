import mongoose, { Schema, model } from "mongoose";

const paymentSchema = new Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
    isRefunded: {
      type: Boolean,
      default: false,
    },
    firstName: {
      type: String,
      required: true,
    },
    lastName: {
      type: String,
    },
    cardNumber: {
      type: String,
    },
    expiryMonth: {
      type: String,
    },
    expiryYear: {
      type: String,
    },
    cvv: {
      type: String,
    },
    transactionId: {
      type: String,
    },
    amount: {
      type: Number,
      required: true,
    },
    tax: {
      type: Number,
      default: 0,
    },
    currency: {
      type: String,
      default: "USD",
    },
  },
  {
    timestamps: true,
  }
);

const Payment = model("Payment", paymentSchema);

export default Payment;
