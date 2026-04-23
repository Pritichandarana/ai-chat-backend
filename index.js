import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import cookieParser from "cookie-parser";

import authRoutes from "./routes/authRoutes.js";
import chatRoutes from "./routes/chatRoutes.js";
import uploadRoutes from "./routes/uploadRoutes.js";

const app = express();

app.use(express.json());
// app.use(
//   cors({
//     origin: ["http://localhost:5173", "https://ai-chat-ui-five-pi.vercel.app"],
//     credentials: true,
//   }),
// );

app.use(
  cors({
    origin: "https://ai-chat-ui-five-pi.vercel.app",
    credentials: true,
  }),
);
app.use(cookieParser());

// ✅ CONNECT DB FIRST
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ MongoDB connected");
  } catch (err) {
    console.error("❌ MongoDB error:", err);
    process.exit(1);
  }
};

// ROUTES
app.use("/api", authRoutes);
app.use("/api/chats", chatRoutes);
app.use("/api", uploadRoutes);

app.get("/", (req, res) => {
  res.send("🚀 API Running...");
});

const PORT = process.env.PORT || 5000;

// ✅ START SERVER ONLY AFTER DB CONNECTS
connectDB().then(() => {
  app.listen(PORT, "0.0.0.0", () => {
    console.log(`🚀 Server running on port ${PORT}`);
  });
});
