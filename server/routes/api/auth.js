import express from "express";
import {
  signup,
  login,
  checkIfUserIsLoggedIn,
} from "../../controllers/api/auth.js";

const router = express.Router();

router.post("/signup", signup);
router.post("/login", login);
router.post("/check-user-auth", checkIfUserIsLoggedIn);

export default router;
