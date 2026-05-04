import dotenv from "dotenv";
dotenv.config();

import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import crypto from "crypto";

import User from "../models/User.js";
import sendEmail from "../utils/sendEmail.js";

const JWT_SECRET = process.env.JWT_SECRET;
const REFRESH_SECRET = process.env.REFRESH_SECRET;

if (!JWT_SECRET) {
  throw new Error("JWT_SECRET is missing");
}

if (!REFRESH_SECRET) {
  throw new Error("REFRESH_SECRET is missing");
}

//
// ✅ SIGNUP
//
export const signupService = async ({ name, email, password }) => {
  if (!name || !email || !password) {
    throw new Error("All fields are required");
  }

  const existingUser = await User.findOne({ email });

  if (existingUser) {
    throw new Error("User already exists");
  }

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
  if (!email || !password) {
    throw new Error("Email and password are required");
  }

  const user = await User.findOne({ email });

  if (!user) {
    throw new Error("Invalid credentials");
  }

  const isMatch = await bcrypt.compare(password, user.password);

  if (!isMatch) {
    throw new Error("Invalid credentials");
  }

  const accessToken = jwt.sign(
    {
      userId: user._id,
      name: user.name,
      email: user.email,
    },
    JWT_SECRET,
    {
      expiresIn: "15m",
    },
  );

  const refreshToken = jwt.sign(
    {
      userId: user._id,
    },
    REFRESH_SECRET,
    {
      expiresIn: "7d",
    },
  );

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

  if (!user) {
    throw new Error("User not found");
  }

  const accessToken = jwt.sign(
    {
      userId: user._id,
      name: user.name,
      email: user.email,
    },
    JWT_SECRET,
    {
      expiresIn: "15m",
    },
  );

  return {
    accessToken,
  };
};

//
// ✅ FORGOT PASSWORD - SECURE HASHED TOKEN
//
export const forgotPasswordService = async ({ email }) => {
  if (!email) {
    throw new Error("Email is required");
  }

  const user = await User.findOne({ email });

  if (!user) {
    throw new Error("User not found");
  }

  // Raw token goes in email
  const rawToken = crypto.randomBytes(32).toString("hex");

  // Hashed token goes in database
  const hashedToken = crypto
    .createHash("sha256")
    .update(rawToken)
    .digest("hex");

  user.resetToken = hashedToken;
  user.resetTokenExpiry = Date.now() + 15 * 60 * 1000; // 15 minutes

  await user.save();

  const clientUrl = process.env.CLIENT_URL;

  if (!clientUrl) {
    throw new Error("CLIENT_URL is missing");
  }

  const resetLink = `${clientUrl}/reset-password/${rawToken}`;

  await sendEmail(email, resetLink);

  return {
    message: "Reset link sent to email",
  };
};

//
// ✅ RESET PASSWORD - CHECK HASHED TOKEN
//
export const resetPasswordService = async ({ token, password }) => {
  if (!token || !password) {
    throw new Error("Token and password are required");
  }

  const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

  const user = await User.findOne({
    resetToken: hashedToken,
    resetTokenExpiry: { $gt: Date.now() },
  });

  if (!user) {
    throw new Error("Invalid or expired token");
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  user.password = hashedPassword;
  user.resetToken = undefined;
  user.resetTokenExpiry = undefined;

  await user.save();

  return {
    message: "Password reset successful",
  };
};
