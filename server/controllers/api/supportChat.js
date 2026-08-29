import SupportChat from "../../models/supportChat.js";
import Task from "../../models/task.js";
import User from "../../models/user.js";

// ─────────────────────────────────────────────────────────────────────────────
// TIMEZONE HELPERS
// Support hours: 4:30 AM through 9:30 PM Eastern Time daily
// ─────────────────────────────────────────────────────────────────────────────
export const isSupportAvailableET = () => {
    const nyDateString = new Date().toLocaleString("en-US", {
        timeZone: "America/New_York",
    });
    const nyDate = new Date(nyDateString);
    const hours = nyDate.getHours();
    const minutes = nyDate.getMinutes();
    const timeInMinutes = hours * 60 + minutes;

    const startInMinutes = 4 * 60 + 30; // 4:30 AM = 270 mins
    const endInMinutes = 21 * 60 + 30;  // 9:30 PM = 1290 mins

    return timeInMinutes >= startInMinutes && timeInMinutes <= endInMinutes;
};

// ─────────────────────────────────────────────────────────────────────────────
// CUSTOMER CHAT CONTROLLERS
// ─────────────────────────────────────────────────────────────────────────────

// Get or create session
export const getSession = async (req, res, next) => {
    try {
        const { sessionId, customerName, customerEmail } = req.body;

        if (!sessionId) {
            return res.status(400).json({
                success: false,
                message: "Session ID is required.",
            });
        }

        let chat = await SupportChat.findOne({ sessionId }).populate("user", "name email");

        if (!chat) {
            chat = new SupportChat({
                sessionId,
                customerName: customerName || (req.user ? req.user.name : "Guest Passenger"),
                customerEmail: customerEmail || (req.user ? req.user.email : ""),
                user: req.user ? req.user.id : null,
                status: "Open",
                messages: [
                    {
                        sender: "Dispatcher",
                        senderName: "Dispatch Support",
                        text: "Hello! Welcome to Bueno Transit Support. How can we help you today?",
                        createdAt: new Date(),
                    },
                ],
            });
            await chat.save();
        } else {
            // Update customer details if authenticated user or provided
            if (req.user) {
                chat.user = req.user.id;
                if (!chat.customerName || chat.customerName === "Guest Passenger") {
                    chat.customerName = req.user.name;
                }
                if (!chat.customerEmail) {
                    chat.customerEmail = req.user.email;
                }
            } else {
                if (customerName && chat.customerName === "Guest Passenger") {
                    chat.customerName = customerName;
                }
                if (customerEmail && !chat.customerEmail) {
                    chat.customerEmail = customerEmail;
                }
            }
            await chat.save();
        }

        const isAvailable = isSupportAvailableET();

        return res.status(200).json({
            success: true,
            data: {
                chat,
                isSupportAvailable: isAvailable,
                supportHoursNotice: "Live Dispatcher Support is available daily 4:30 AM – 9:30 PM Eastern Time.",
            },
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: "Failed to initialize support chat session.",
        });
    }
};

// Send message in chat
export const sendMessage = async (req, res, next) => {
    try {
        const { sessionId, text, senderName, customerEmail, customerName } = req.body;

        if (!sessionId || !text || !text.trim()) {
            return res.status(400).json({
                success: false,
                message: "Session ID and message text are required.",
            });
        }

        let chat = await SupportChat.findOne({ sessionId });
        if (!chat) {
            chat = new SupportChat({
                sessionId,
                customerName: customerName || (req.user ? req.user.name : "Guest Passenger"),
                customerEmail: customerEmail || (req.user ? req.user.email : ""),
                user: req.user ? req.user.id : null,
                status: "Open",
                messages: [],
            });
        }

        const isDispatcher = req.user && req.user.isAdmin;
        const sender = isDispatcher ? "Dispatcher" : "Customer";
        const finalSenderName = senderName || (isDispatcher ? req.user.name : (req.user ? req.user.name : chat.customerName || "Customer"));

        if (!isDispatcher) {
            if (customerEmail) chat.customerEmail = customerEmail;
            if (customerName) chat.customerName = customerName;
            chat.status = "Open"; // Mark open when customer posts
        } else {
            chat.status = "Waiting"; // Marked waiting for customer response when dispatcher replies
        }

        chat.messages.push({
            sender,
            senderName: finalSenderName,
            text: text.trim(),
            createdAt: new Date(),
        });
        chat.lastMessageAt = new Date();

        await chat.save();

        return res.status(200).json({
            success: true,
            data: { chat },
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: "Failed to send message.",
        });
    }
};

// ─────────────────────────────────────────────────────────────────────────────
// AFTER-HOURS DISPATCH REQUEST FORM CONTROLLER
// ─────────────────────────────────────────────────────────────────────────────
export const submitAfterHoursRequest = async (req, res, next) => {
    try {
        const { name, email, reason } = req.body;

        if (!name || !name.trim()) {
            return res.status(400).json({
                success: false,
                message: "Please enter your Name.",
            });
        }

        if (!email || !email.trim() || !email.includes("@")) {
            return res.status(400).json({
                success: false,
                message: "Please enter a valid Email address.",
            });
        }

        if (!reason || !reason.trim()) {
            return res.status(400).json({
                success: false,
                message: "Please provide a reason for your contact.",
            });
        }

        // Duplicate guard: check if identical request submitted in last 2 minutes
        const twoMinutesAgo = new Date(Date.now() - 2 * 60 * 1000);
        const existingRecentTask = await Task.findOne({
            title: `Need Help Request: ${name.trim()}`,
            createdAt: { $gte: twoMinutesAgo },
        });

        if (existingRecentTask) {
            return res.status(200).json({
                success: true,
                message: "Your request has already been sent to Dispatch. Our team will review it as soon as possible.",
                data: { taskId: existingRecentTask._id },
            });
        }

        const now = new Date();
        const nyDateStr = now.toLocaleDateString("en-US", {
            timeZone: "America/New_York",
            year: "numeric",
            month: "long",
            day: "numeric",
        });
        const nyTimeStr = now.toLocaleTimeString("en-US", {
            timeZone: "America/New_York",
            hour: "2-digit",
            minute: "2-digit",
        });

        const taskDescription = [
            "Customer submitted an After-Hours Need Help request.",
            "",
            `Customer Name: ${name.trim()}`,
            `Customer Email: ${email.trim()}`,
            `Submission Date: ${nyDateStr}`,
            `Submission Time: ${nyTimeStr} ET`,
            `Source: Need Help Chatbox`,
            "",
            "--- REASON FOR CONTACT ---",
            reason.trim(),
        ].join("\n");

        const userId = req.user ? req.user.id : null;

        const newTask = new Task({
            title: `Need Help Request: ${name.trim()}`,
            description: taskDescription,
            source: "Need Help Chatbox",
            tag: "Normal",
            status: "Pending",
            createdBy: userId,
            statusHistory: [
                {
                    status: "Pending",
                    changedBy: userId,
                    changedAt: now,
                },
            ],
        });

        await newTask.save();

        return res.status(201).json({
            success: true,
            message: "Your request has been sent to Dispatch. Our team will review it as soon as possible.",
            data: { taskId: newTask._id },
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: "Failed to submit request. Please try again.",
        });
    }
};

// ─────────────────────────────────────────────────────────────────────────────
// ADMIN / DISPATCHER CHAT INBOX CONTROLLERS
// ─────────────────────────────────────────────────────────────────────────────

// Get all chats for dispatcher inbox
export const getAdminChats = async (req, res, next) => {
    try {
        const chats = await SupportChat.find()
            .populate("user", "name email")
            .sort({ lastMessageAt: -1 });

        return res.status(200).json({
            success: true,
            data: { chats },
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: "Failed to fetch support chat inbox.",
        });
    }
};

// Update chat status (e.g. mark as Resolved / Open)
export const updateChatStatus = async (req, res, next) => {
    try {
        const { chatId, status } = req.body;

        if (!chatId || !status) {
            return res.status(400).json({
                success: false,
                message: "Chat ID and status are required.",
            });
        }

        const chat = await SupportChat.findById(chatId);
        if (!chat) {
            return res.status(404).json({
                success: false,
                message: "Chat session not found.",
            });
        }

        chat.status = status;
        await chat.save();

        return res.status(200).json({
            success: true,
            message: `Chat marked as ${status}.`,
            data: { chat },
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: "Failed to update chat status.",
        });
    }
};
