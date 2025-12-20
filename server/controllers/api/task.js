import Task from "../../models/task.js";

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
