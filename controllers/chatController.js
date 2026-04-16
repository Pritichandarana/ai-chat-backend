import Chat from "../models/chat.js";
import Groq from "groq-sdk";
// const groq = new Groq({
//   apiKey: process.env.GROQ_API_KEY,
// });

// ================= SEND MESSAGE =================
export const sendMessage = async (req, res) => {
  try {
    const groq = new Groq({
      apiKey: process.env.GROQ_API_KEY, // ✅ always fresh
    });

    const { message } = req.body;

    const response = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [{ role: "user", content: message }],
    });

    res.json({
      reply: response.choices[0].message.content,
    });
  } catch (err) {
    console.error("❌ Groq Error:", err);
    res.status(500).json({ error: "Something went wrong" });
  }
};

// ================= CREATE CHAT =================
export const createChat = async (req, res) => {
  try {
    const chat = await Chat.create({
      userId: req.userId,
      title: "New Chat",
      messages: [],
    });

    res.json(chat);
  } catch (error) {
    res.status(500).json({ error: "Failed to create chat" });
  }
};

// ================= GET ALL CHATS =================
export const getChats = async (req, res) => {
  try {
    const chats = await Chat.find({ userId: req.userId }).sort({
      updatedAt: -1,
    });

    res.json(chats);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch chats" });
  }
};

// ================= GET SINGLE CHAT =================
export const getChatById = async (req, res) => {
  try {
    const chat = await Chat.findOne({
      _id: req.params.id,
      userId: req.userId,
    });

    if (!chat) {
      return res.status(404).json({ error: "Chat not found" });
    }

    res.json(chat);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch chat" });
  }
};

// ================= UPDATE CHAT =================
export const updateChat = async (req, res) => {
  try {
    const chat = await Chat.findOneAndUpdate(
      { _id: req.params.id, userId: req.userId },
      req.body,
      { new: true },
    );

    res.json(chat);
  } catch (error) {
    res.status(500).json({ error: "Failed to update chat" });
  }
};

// ================= DELETE CHAT =================
export const deleteChat = async (req, res) => {
  try {
    await Chat.findOneAndDelete({
      _id: req.params.id,
      userId: req.userId,
    });

    res.json({ message: "Deleted" });
  } catch (error) {
    res.status(500).json({ error: "Failed to delete chat" });
  }
};
