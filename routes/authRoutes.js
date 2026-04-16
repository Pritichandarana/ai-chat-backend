import express from "express";
import {
  signup,
  login,
  refreshAccessToken,
  logout,
  forgotPassword,
  resetPassword,
  checkAuth, // 🔥 ADD THIS
} from "../controllers/authController.js";

const router = express.Router();

//
// ✅ AUTH ROUTES
//
router.post("/signup", signup);
router.post("/login", login);
router.post("/refresh", refreshAccessToken);
router.post("/logout", logout);

//
// ✅ NEW (IMPORTANT)
router.get("/check-auth", checkAuth); // 🔥 THIS FIXES 404

//
// ✅ PASSWORD
//
router.post("/forgot-password", forgotPassword);
router.post("/reset-password", resetPassword);

export default router;
