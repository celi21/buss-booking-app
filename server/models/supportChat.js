import mongoose, { Schema, model } from "mongoose";

const messageSchema = new Schema({
    sender: {
        type: String,
        enum: ["Customer", "Dispatcher"],
        required: true,
    },
    senderName: {
        type: String,
        default: "Customer",
    },
    text: {
        type: String,
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

const supportChatSchema = new Schema(
    {
        sessionId: {
            type: String,
            required: true,
            unique: true,
            index: true,
        },
        customerName: {
            type: String,
            default: "Guest Passenger",
        },
        customerEmail: {
            type: String,
            default: "",
        },
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            default: null,
        },
        status: {
            type: String,
            enum: ["Open", "Waiting", "Resolved"],
            default: "Open",
        },
        lastMessageAt: {
            type: Date,
            default: Date.now,
        },
        messages: [messageSchema],
    },
    {
        timestamps: true,
    }
);

const SupportChat = model("SupportChat", supportChatSchema);

export default SupportChat;
