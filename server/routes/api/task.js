import express from "express";
import {
    getTasks,
    createTask,
    updateTaskStatus,
    deleteTask,
} from "../../controllers/api/task.js";
import verifyAdmin from "../../middlewares/verifyAdmin.js";

const router = express.Router();

router.post("/get-tasks", verifyAdmin, getTasks);
router.post("/create-task", verifyAdmin, createTask);
router.post("/update-task-status", verifyAdmin, updateTaskStatus);
router.post("/delete-task", verifyAdmin, deleteTask);

export default router;
