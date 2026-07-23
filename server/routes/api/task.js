import express from "express";
import {
    getTasks,
    createTask,
    updateTaskStatus,
    deleteTask,
    requestAccountDeletion,
    deleteUserAccount,
} from "../../controllers/api/task.js";
import verifyAdmin from "../../middlewares/verifyAdmin.js";
import verifyUser from "../../middlewares/verifyUser.js";

const router = express.Router();

router.post("/get-tasks", verifyAdmin, getTasks);
router.post("/create-task", verifyAdmin, createTask);
router.post("/update-task-status", verifyAdmin, updateTaskStatus);
router.post("/delete-task", verifyAdmin, deleteTask);

// Account deletion workflow
router.post("/request-account-deletion", verifyUser, requestAccountDeletion);
router.post("/delete-user-account", verifyAdmin, deleteUserAccount);

export default router;
