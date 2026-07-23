import Task from "../../models/task.js";
import User from "../../models/user.js";
import Booking from "../../models/booking.js";

export const getTasks = async (req, res, next) => {
    try {
        const tasks = await Task.find()
            .populate("relatedBooking", "bookingId")
            .populate("assignedTo", "name email")
            .populate("createdBy", "name email")
            .sort({ createdAt: -1 });

        return res.status(200).json({
            success: true,
            data: { tasks },
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "Internal server error. Please try again later.",
        });
    }
};

export const createTask = async (req, res, next) => {
    try {
        const { title, description, source, tag, relatedBooking, assignedTo } = req.body;

        if (!title) {
            return res.status(400).json({
                success: false,
                message: "Task title is required.",
            });
        }

        const newTask = new Task({
            title,
            description,
            source,
            tag,
            relatedBooking,
            assignedTo,
            createdBy: req.user.id,
            statusHistory: [
                {
                    status: "Pending",
                    changedBy: req.user.id,
                    changedAt: new Date(),
                },
            ],
        });

        await newTask.save();

        const populatedTask = await Task.findById(newTask._id)
            .populate("relatedBooking", "bookingId")
            .populate("assignedTo", "name email")
            .populate("createdBy", "name email");

        return res.status(201).json({
            success: true,
            message: "Task created successfully.",
            data: { task: populatedTask },
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "Internal server error. Please try again later.",
        });
    }
};

export const updateTaskStatus = async (req, res, next) => {
    try {
        const { taskId, status } = req.body;

        if (!taskId || !status) {
            return res.status(400).json({
                success: false,
                message: "Task ID and status are required.",
            });
        }

        const task = await Task.findById(taskId);

        if (!task) {
            return res.status(404).json({
                success: false,
                message: "Task not found.",
            });
        }

        task.status = status;
        task.statusHistory.push({
            status,
            changedBy: req.user.id,
            changedAt: new Date(),
        });

        await task.save();

        const populatedTask = await Task.findById(task._id)
            .populate("relatedBooking", "bookingId")
            .populate("assignedTo", "name email")
            .populate("createdBy", "name email");

        return res.status(200).json({
            success: true,
            message: "Task status updated successfully.",
            data: { task: populatedTask },
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "Internal server error. Please try again later.",
        });
    }
};

export const deleteTask = async (req, res, next) => {
    try {
        const { taskId } = req.body;

        if (!taskId) {
            return res.status(400).json({
                success: false,
                message: "Task ID is required.",
            });
        }

        const task = await Task.findByIdAndDelete(taskId);

        if (!task) {
            return res.status(404).json({
                success: false,
                message: "Task not found.",
            });
        }

        return res.status(200).json({
            success: true,
            message: "Task deleted successfully.",
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "Internal server error. Please try again later.",
        });
    }
};

// ─────────────────────────────────────────────────────────────────────────────
// ACCOUNT DELETION REQUEST
// Called by authenticated passenger from /user/profile
// ─────────────────────────────────────────────────────────────────────────────
export const requestAccountDeletion = async (req, res, next) => {
    try {
        const userId = req.user.id;

        // Guard: prevent duplicate active requests
        const existingTask = await Task.findOne({
            title: { $regex: `^Account Deletion Request:`, $options: "i" },
            status: { $in: ["Pending", "Started"] },
            createdBy: userId,
        });

        if (existingTask) {
            return res.status(409).json({
                success: false,
                message: "You already have a pending account deletion request.",
            });
        }

        // Gather user info
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found.",
            });
        }

        // Determine login provider
        let loginProvider = "Email/Password";
        if (user.googleId) loginProvider = "Google";
        else if (user.appleId) loginProvider = "Apple";

        // Count bookings
        const activeBookings = await Booking.countDocuments({
            user: userId,
            status: { $in: ["confirmed", "pending"] },
        });
        const completedBookings = await Booking.countDocuments({
            user: userId,
            status: "cancelled",
        });

        const now = new Date();
        const requestDate = now.toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
        });
        const requestTime = now.toLocaleTimeString("en-US", {
            hour: "2-digit",
            minute: "2-digit",
        });

        const description = [
            "Customer has requested permanent deletion of their Bueno Transit account.",
            "",
            `Request ID: ${userId}-${Date.now()}`,
            `User ID: ${userId}`,
            `Customer Name: ${user.name}`,
            `Customer Email: ${user.email}`,
            `Login Provider: ${loginProvider}`,
            `Request Date: ${requestDate}`,
            `Request Time: ${requestTime}`,
            `Active Reservations: ${activeBookings}`,
            `Completed/Cancelled Reservations: ${completedBookings}`,
        ].join("\n");

        const newTask = new Task({
            title: `Account Deletion Request: ${user.name}`,
            description,
            source: "Passenger",
            tag: "URGENT",
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
            message:
                "Your account deletion request has been submitted successfully. Our team will review and process your request shortly.",
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "Internal server error. Please try again later.",
        });
    }
};

// ─────────────────────────────────────────────────────────────────────────────
// PERMANENT ACCOUNT DELETION
// Called by Admin/Dispatch from the Dispatch Task Queue
// Deletes the User document. Does NOT delete bookings, payments, or audit records.
// ─────────────────────────────────────────────────────────────────────────────
export const deleteUserAccount = async (req, res, next) => {
    try {
        const { taskId, targetUserId } = req.body;

        if (!taskId || !targetUserId) {
            return res.status(400).json({
                success: false,
                message: "Task ID and target user ID are required.",
            });
        }

        // Find the task
        const task = await Task.findById(taskId);
        if (!task) {
            return res.status(404).json({
                success: false,
                message: "Deletion request task not found.",
            });
        }

        if (task.status === "Completed") {
            return res.status(400).json({
                success: false,
                message: "This deletion request has already been completed.",
            });
        }

        // Safety: do not allow admins to delete their own account via this flow
        if (targetUserId === req.user.id) {
            return res.status(400).json({
                success: false,
                message: "Admins cannot delete their own account through this workflow.",
            });
        }

        // Find and delete the user
        const targetUser = await User.findByIdAndDelete(targetUserId);
        if (!targetUser) {
            return res.status(404).json({
                success: false,
                message: "Target user account not found. It may have already been deleted.",
            });
        }

        // Mark task as Completed with admin info appended to description
        const now = new Date();
        const completedDate = now.toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
        });
        const completedTime = now.toLocaleTimeString("en-US", {
            hour: "2-digit",
            minute: "2-digit",
        });

        task.status = "Completed";
        task.description =
            task.description +
            `\n\n--- ACCOUNT DELETED ---\nCompleted By Admin ID: ${req.user.id}\nCompleted Date: ${completedDate}\nCompleted Time: ${completedTime}`;
        task.statusHistory.push({
            status: "Completed",
            changedBy: req.user.id,
            changedAt: now,
        });

        await task.save();

        return res.status(200).json({
            success: true,
            message: `Account for ${targetUser.name} (${targetUser.email}) has been permanently deleted.`,
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "Internal server error. Please try again later.",
        });
    }
};

