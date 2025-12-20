import mongoose, { Schema, model } from "mongoose";

const taskSchema = new Schema(
    {
        title: {
            type: String,
            required: true,
        },
        description: {
            type: String,
            default: "",
        },
        source: {
            type: String,
            enum: ["Passenger", "Admin"],
            default: "Admin",
        },
        tag: {
            type: String,
            enum: ["Normal", "URGENT"],
            default: "Normal",
        },
        status: {
            type: String,
            enum: ["Pending", "Started", "Completed"],
            default: "Pending",
        },
        relatedBooking: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Booking",
            default: null,
        },
        assignedTo: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            default: null,
        },
        createdBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        statusHistory: [
            {
                status: String,
                changedBy: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: "User",
                },
                changedAt: {
                    type: Date,
                    default: Date.now,
                },
            },
        ],
    },
    {
        timestamps: true,
    }
);

const Task = model("Task", taskSchema);

export default Task;
