import express from "express";
import {
    getSession,
    sendMessage,
    submitAfterHoursRequest,
    getAdminChats,
    updateChatStatus,
    deleteChat,
} from "../../controllers/api/supportChat.js";
import verifyAdmin from "../../middlewares/verifyAdmin.js";

const router = express.Router();

// Optional user authentication extractor
const optionalAuth = (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        const token = req.cookies?.token || (authHeader && authHeader.startsWith("Bearer ") ? authHeader.split(" ")[1] : null);
        if (token) {
            import("jsonwebtoken").then((jwt) => {
                try {
                    const decoded = jwt.default.verify(token, process.env.JWT_SECRET);
                    req.user = decoded;
                } catch (e) {
                    // Token invalid/expired - proceed as guest
                }
                next();
            });
        } else {
            next();
        }
    } catch (error) {
        next();
    }
};

// Customer routes
router.post("/session", optionalAuth, getSession);
router.post("/send", optionalAuth, sendMessage);
router.post("/after-hours", optionalAuth, submitAfterHoursRequest);

// Admin / Dispatcher inbox routes
router.post("/admin/chats", verifyAdmin, getAdminChats);
router.post("/admin/status", verifyAdmin, updateChatStatus);
router.post("/admin/delete", verifyAdmin, deleteChat);

export default router;
