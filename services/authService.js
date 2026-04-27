import dotenv from "dotenv";
dotenv.config();
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import User from "../models/User.js";
import sendEmail from "../utils/sendEmail.js";
console.log("JWT:", process.env.JWT_SECRET);
console.log("REFRESH:", process.env.REFRESH_SECRET);
const JWT_SECRET = process.env.JWT_SECRET;
const REFRESH_SECRET = process.env.REFRESH_SECRET;

//
// ✅ SIGNUP
//
export const signupService = async ({ name, email, password }) => {
  const existingUser = await User.findOne({ email });
  if (existingUser) throw new Error("User already exists");

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await User.create({
    name,
    email,
    password: hashedPassword,
  });

  return {
    message: "Signup successful",
    userId: user._id,
  };
};

//
// ✅ LOGIN
//
export const loginService = async ({ email, password }) => {
  const user = await User.findOne({ email });
  if (!user) throw new Error("Invalid credentials");

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) throw new Error("Invalid credentials");

  // 🔐 Access Token (short-lived)
  const accessToken = jwt.sign(
    {
      userId: user._id,
      name: user.name,
      email: user.email,
    },
    JWT_SECRET,
    { expiresIn: "15m" },
  );

  // 🔁 Refresh Token (long-lived)
  const refreshToken = jwt.sign({ userId: user._id }, REFRESH_SECRET, {
    expiresIn: "7d",
  });

  return {
    accessToken,
    refreshToken,
  };
};

//
// ✅ REFRESH TOKEN
//
export const refreshTokenService = async (refreshToken) => {
  if (!refreshToken) {
    throw new Error("Refresh token is required");
  }

  let decoded;

  try {
    decoded = jwt.verify(refreshToken, REFRESH_SECRET);
  } catch (err) {
    throw new Error("Invalid or expired refresh token");
  }

  const user = await User.findById(decoded.userId);
  if (!user) throw new Error("User not found");

  // 🔄 New Access Token
  const newAccessToken = jwt.sign(
    {
      userId: user._id,
      name: user.name,
      email: user.email,
    },
    JWT_SECRET,
    { expiresIn: "15m" },
  );

  return {
    accessToken: newAccessToken,
  };
};

//
// ✅ FORGOT PASSWORD
//
//
// ✅ FORGOT PASSWORD
//
export const forgotPasswordService = async ({ email }) => {
  const user = await User.findOne({ email });
  if (!user) throw new Error("User not found");

  const token = crypto.randomBytes(32).toString("hex");

  user.resetToken = token;
  user.resetTokenExpiry = Date.now() + 15 * 60 * 1000; // 15 min
  await user.save();

  // 🔥 FIX: use ENV instead of localhost
  const resetLink = `${process.env.CLIENT_URL}/reset-password/${token}`;

  await sendEmail(email, resetLink);

  return {
    message: "Reset link sent to email",
  };
};

//
// ✅ RESET PASSWORD
//
export const resetPasswordService = async ({ token, password }) => {
  const user = await User.findOne({
    resetToken: token,
    resetTokenExpiry: { $gt: Date.now() },
  });

  if (!user) throw new Error("Invalid or expired token");

  const hashedPassword = await bcrypt.hash(password, 10);

  user.password = hashedPassword;
  user.resetToken = undefined;
  user.resetTokenExpiry = undefined;

  await user.save();

  return {
    message: "Password reset successful",
  };
};
