import dotenv from "dotenv";
dotenv.config(); // 🔥 MUST be first

import {
  signupService,
  loginService,
  refreshTokenService,
  forgotPasswordService,
  resetPasswordService,
} from "../services/authService.js";

import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET;

// 🚨 safety check
if (!JWT_SECRET) {
  throw new Error("JWT_SECRET missing in authController ❌");
}

// const cookieOptions = {
//   httpOnly: true,
//   secure: false,
//   sameSite: "lax",
//   path: "/",
// };
const cookieOptions = {
  httpOnly: true,
  secure: true, // ✅ REQUIRED for production
  sameSite: "none", // ✅ REQUIRED for cross-domain
  path: "/",
};

//
// ✅ SIGNUP
//
export const signup = async (req, res) => {
  try {
    const result = await signupService(req.body);
    res.json(result);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

//
// ✅ LOGIN
//
export const login = async (req, res) => {
  try {
    const { accessToken, refreshToken } = await loginService(req.body);

    res.cookie("accessToken", accessToken, {
      ...cookieOptions,
      maxAge: 15 * 60 * 1000,
    });

    res.cookie("refreshToken", refreshToken, {
      ...cookieOptions,
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });
    const decoded = jwt.verify(accessToken, process.env.JWT_SECRET);

    // ✅ THIS IS THE IMPORTANT PART
    res.json({
      message: "Login successful",
      user: {
        userId: decoded.userId,
        name: decoded.name,
        email: decoded.email,
      },
    });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

//
// ✅ REFRESH TOKEN
//
export const refreshAccessToken = async (req, res) => {
  try {
    const token = req.cookies.refreshToken;

    if (!token) {
      return res.status(401).json({ error: "No refresh token" });
    }

    const { accessToken } = await refreshTokenService(token);

    res.cookie("accessToken", accessToken, {
      ...cookieOptions,
      maxAge: 15 * 60 * 1000,
    });

    res.json({ message: "Token refreshed" });
  } catch (err) {
    res.status(401).json({ error: err.message });
  }
};

//
// ✅ CHECK AUTH
//
export const checkAuth = (req, res) => {
  const token = req.cookies.accessToken;

  if (!token) {
    return res.status(401).json({ error: "No token" });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);

    return res.json({
      user: {
        userId: decoded.userId,
        name: decoded.name,
        email: decoded.email,
      },
    });
  } catch (err) {
    console.log("JWT ERROR:", err.message);
    return res.status(401).json({ error: "Invalid token" });
  }
};

//
// ✅ LOGOUT
//
export const logout = (req, res) => {
  res.clearCookie("accessToken", cookieOptions);
  res.clearCookie("refreshToken", cookieOptions);

  res.json({ message: "Logged out" });
};

//
// ✅ FORGOT PASSWORD
//
export const forgotPassword = async (req, res) => {
  try {
    const result = await forgotPasswordService(req.body);
    res.json(result);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

//
// ✅ RESET PASSWORD
//
export const resetPassword = async (req, res) => {
  try {
    const result = await resetPasswordService(req.body);
    res.json(result);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};
export const refreshTokenController = async (req, res) => {
  try {
    const { refreshToken } = req.body;

    const data = await refreshTokenService(refreshToken);

    res.json(data);
  } catch (err) {
    res.status(401).json({ error: err.message });
  }
};
