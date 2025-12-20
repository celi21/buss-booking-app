import mongoose, { Schema, model } from "mongoose";

const deletionLogSchema = new Schema(
    {
        bookingId: {
            type: String,
            required: true,
        },
        bookingDetails: {
            type: Object,
            required: true,
        },
        deletedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        deletedAt: {
            type: Date,
            default: Date.now,
        },
        reason: {
            type: String,
            default: "Deleted by admin",
        },
    },
    {
        timestamps: true,
    }
);

const DeletionLog = model("DeletionLog", deletionLogSchema);

export default DeletionLog;
