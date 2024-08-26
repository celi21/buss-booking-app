import express from "express";
import {
  addCity,
  fetchCities,
  updateCityStatus,
  removeCity,
  updateCity,
} from "../../controllers/api/routes.js";
import verifyAdmin from "../../middlewares/verifyAdmin.js";

const router = express.Router();

router.post("/add-city", verifyAdmin, addCity);
router.post("/fetch-cities", verifyAdmin, fetchCities);
router.put("/update-city-status", verifyAdmin, updateCityStatus);
router.delete("/remove-city", verifyAdmin, removeCity);
router.put("/update-city", verifyAdmin, updateCity);
export default router;
