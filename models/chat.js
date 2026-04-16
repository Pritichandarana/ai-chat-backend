import mongoose from "mongoose";

const messageSchema = new mongoose.Schema(
  {
    role: { type: String, required: true }, // user / assistant
    content: { type: String, required: true },
  },
  { _id: false },
);

const chatSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      default: "New Chat",
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    messages: [messageSchema],
  },
  { timestamps: true },
);

export default mongoose.model("Chat", chatSchema);
