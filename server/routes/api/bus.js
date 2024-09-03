import express from "express";
import {
  getBuses,
  addBus,
  removeBus,
  addReview,
  getReview,
  addBusType,
  fetchBusTypes,
  removeBusType,
  updateBusTypeStatus,
  updateBusType,
  AddNewBus,
  fetchBuses,
  fetchBus,
  updateBus,
} from "../../controllers/api/bus.js";
import verifyAdmin from "../../middlewares/verifyAdmin.js";
import verifyUser from "../../middlewares/verifyUser.js";

const router = express.Router();

router.get("/", verifyAdmin, getBuses);
router.post("/add-bus-type", verifyAdmin, addBusType);
router.post("/fetch-bus-types", verifyAdmin, fetchBusTypes);
router.delete("/remove-bus-type", verifyAdmin, removeBusType);
router.put("/update-bus-type-status", verifyAdmin, updateBusTypeStatus);
router.put("/update-bus-type", verifyAdmin, updateBusType);
router.post("/add-new-bus", verifyAdmin, AddNewBus);
router.post("/fetch-buses", verifyAdmin, fetchBuses);
router.get("/fetch-bus/:busId", verifyAdmin, fetchBus);
router.put("/edit-bus", verifyAdmin, updateBus);

router.post("/add", verifyAdmin, addBus);
router.delete("/remove/:busId", verifyAdmin, removeBus);

router.post("/review/add/:busId", verifyUser, addReview);
router.get("/review/:busId", verifyAdmin, getReview);

export default router;
