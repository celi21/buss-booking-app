import express from "express";
import { fetchTax, updateTax } from "../../controllers/api/settings.js";
import verifyAdmin from "../../middlewares/verifyAdmin.js";

const router = express.Router();

router.post("/fetch-tax", fetchTax);
router.post("/update-tax", verifyAdmin, updateTax);

export default router;
