import express from "express";
import {
  signup,
  login,
  checkIfUserIsLoggedIn,
  updateProfile,
} from "../../controllers/api/auth.js";
import verifyUser from "../../middlewares/verifyUser.js";

const router = express.Router();

router.post("/signup", signup);
router.post("/login", login);
router.post("/check-user-auth", checkIfUserIsLoggedIn);
router.post("/update-profile", verifyUser, updateProfile);

export default router;
