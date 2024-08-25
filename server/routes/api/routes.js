import express from "express";
import { addCity, fetchCities } from "../../controllers/api/routes.js";
import verifyAdmin from "../../middlewares/verifyAdmin.js";

const router = express.Router();

router.post("/add-city", verifyAdmin, addCity);
router.post("/fetch-cities", verifyAdmin, fetchCities);
export default router;
