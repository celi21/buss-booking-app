import express from "express";
import {
  search,
  create,
  cancel,
  getUserBookings,
  getBusBookings,
  fetchCities,
  checkBusAvailability,
  confirmBusSeatsAvailability,
  confirmBooking,
  searchBooking,
  fetchUserBookings,
} from "../../controllers/api/booking.js";
import verifyAdmin from "../../middlewares/verifyAdmin.js";
import verifyUser from "../../middlewares/verifyUser.js";

const router = express.Router();

router.post("/fetch-cities", fetchCities);
router.post("/check-bus-availability", checkBusAvailability);
router.post("/confirm-bus-seats-availability", confirmBusSeatsAvailability);
router.post("/confirm-booking", confirmBooking);
router.get("/search-booking/:bookingId", searchBooking);
router.post("/user-bookings", verifyUser, fetchUserBookings);

router.post("/search", verifyUser, search);
router.post("/create", verifyUser, create);
router.patch("/cancel/:bookingId", verifyUser, cancel);
router.get("/user/:userId", verifyUser, getUserBookings);

router.get("/bus/:busId", verifyAdmin, getBusBookings);

export default router;
