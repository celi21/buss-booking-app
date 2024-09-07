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

const TicketTypeSchema = new Schema(
  {
    name: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

const PriceDetailSchema = new Schema(
  {
    fromLocationId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "BusLocation",
      required: true,
    },
    toLocationId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "BusLocation",
      required: true,
    },
    price: {
      type: String,
      required: true,
    },
  },
  {
    _id: false,
    timestamps: true,
  }
);

const TicketPriceSchema = new Schema(
  {
    ticketType: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "TicketType",
      required: true,
    },
    prices: [PriceDetailSchema],
  },
  {
    timestamps: true,
  }
);

const BusSchema = new Schema(
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
    ticketTypes: [TicketTypeSchema],
    ticketPrices: [TicketPriceSchema],
  },
  {
    timestamps: true,
  }
);

const Bus = model("Bus", BusSchema);

export default Bus;
