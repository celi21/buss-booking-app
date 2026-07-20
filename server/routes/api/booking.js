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
  addBooking,
  fetchAdminBookings,
  fetchPassengersList,
  cancelBooking,
  changeBookingStatus,
  markRefunded,
  updateBooking,
  createPaymentIntent,
  deleteBooking,
  fetchDeletionLogs,
  getDashboardStats,
  getDispatchTrips,
  getPassengerManifest,
  updatePassengerStatus,
  updatePassengerDetails,
  updatePickupOrder,
  updateTripStatus,
  getPassengerDashboard,
  checkInPassenger,
  getPassengerWallet,
  submitPassengerRequest,
  getPassengerRequests,
  getPublicTripStatuses,
} from "../../controllers/api/booking.js";
import verifyAdmin from "../../middlewares/verifyAdmin.js";
import verifyUser from "../../middlewares/verifyUser.js";

const router = express.Router();

router.post("/fetch-cities", fetchCities);
router.post("/public-trip-statuses", getPublicTripStatuses);
router.post("/check-bus-availability", checkBusAvailability);
router.post("/confirm-bus-seats-availability", confirmBusSeatsAvailability);
router.post("/confirm-booking", confirmBooking);
router.post("/create-payment-intent", createPaymentIntent);
router.get("/search-booking/:bookingId", searchBooking);
router.post("/user-bookings", verifyUser, fetchUserBookings);
router.post("/add-booking", verifyAdmin, addBooking);
router.post("/fetch-admin-bookings", verifyAdmin, fetchAdminBookings);
router.post("/fetch-passengers-list", verifyAdmin, fetchPassengersList);
router.post("/cancel-booking", verifyUser, cancelBooking);
router.post("/change-booking-status", verifyAdmin, changeBookingStatus);
router.post("/mark-refunded", verifyAdmin, markRefunded);
router.post("/update-booking", verifyAdmin, updateBooking);
router.post("/delete-booking", verifyAdmin, deleteBooking);
router.post("/fetch-deletion-logs", verifyAdmin, fetchDeletionLogs);
router.post("/get-dashboard-stats", verifyAdmin, getDashboardStats);
router.post("/get-dispatch-trips", verifyAdmin, getDispatchTrips);
router.post("/get-passenger-manifest", verifyAdmin, getPassengerManifest);
router.post("/update-passenger-status", verifyAdmin, updatePassengerStatus);
router.post("/update-trip-status", verifyAdmin, updateTripStatus);
router.post("/update-passenger-details", verifyAdmin, updatePassengerDetails);
router.post("/update-pickup-order", verifyAdmin, updatePickupOrder);
router.post("/get-passenger-dashboard", verifyUser, getPassengerDashboard);
router.post("/check-in-passenger", verifyUser, checkInPassenger);
router.post("/get-passenger-wallet", verifyUser, getPassengerWallet);
router.post("/submit-passenger-request", verifyUser, submitPassengerRequest);
router.post("/get-passenger-requests", verifyUser, getPassengerRequests);

router.post("/search", verifyUser, search);
router.post("/create", verifyUser, create);
router.patch("/cancel/:bookingId", verifyUser, cancel);
router.get("/user/:userId", verifyUser, getUserBookings);

router.get("/bus/:busId", verifyAdmin, getBusBookings);

export default router;
