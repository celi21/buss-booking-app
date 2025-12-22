import express from "express";
import authRouter from "./auth.js";
import busRouter from "./bus.js";
import bookingRouter from "./booking.js";
import couponRouter from "./coupon.js";
import paymentRouter from "./payment.js";
import routesRouter from "./routes.js";
import settingsRouter from "./settings.js";
import taskRouter from "./task.js";
import oauthRouter from "./oauth.js";

const router = express.Router();

router.use("/auth", authRouter);
router.use("/bus", busRouter);
router.use("/settings", settingsRouter);
router.use("/routes", routesRouter);
router.use("/booking", bookingRouter);
router.use("/coupon", couponRouter);
router.use("/payment", paymentRouter);
router.use("/task", taskRouter);
router.use("/oauth", oauthRouter);

export default router;
