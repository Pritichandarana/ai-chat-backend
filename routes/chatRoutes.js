import express from "express";
import authMiddleware from "../middleware/authmiddleware.js";
import {
  sendMessage,
  createChat,
  getChats,
  getChatById,
  updateChat,
  deleteChat,
} from "../controllers/chatController.js";

const router = express.Router();

router.post("/chat", authMiddleware, sendMessage);

router.post("/", authMiddleware, createChat);
router.get("/", authMiddleware, getChats);
router.get("/:id", authMiddleware, getChatById);
router.put("/:id", authMiddleware, updateChat);
router.delete("/:id", authMiddleware, deleteChat);

export default router;
