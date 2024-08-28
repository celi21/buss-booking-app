import express from "express";
import {
  addCity,
  fetchCities,
  updateCityStatus,
  removeCity,
  updateCity,
  addRoute,
  fetchRoutes,
  removeRoute,
  updateRoute,
  updateRouteStatus,
} from "../../controllers/api/routes.js";
import verifyAdmin from "../../middlewares/verifyAdmin.js";

const router = express.Router();

router.post("/add-city", verifyAdmin, addCity);
router.post("/fetch-cities", verifyAdmin, fetchCities);
router.put("/update-city-status", verifyAdmin, updateCityStatus);
router.delete("/remove-city", verifyAdmin, removeCity);
router.put("/update-city", verifyAdmin, updateCity);
router.post("/add-route", verifyAdmin, addRoute);
router.put("/update-route", verifyAdmin, updateRoute);
router.put("/update-route-status", verifyAdmin, updateRouteStatus);
router.delete("/remove-route", verifyAdmin, removeRoute);
router.post("/fetch-routes", verifyAdmin, fetchRoutes);
export default router;
