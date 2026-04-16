import Chat from "../models/chat.js";
import Pdf from "../models/pdf.js";
import { findRelevantChunks } from "../utils/textUtils.js";
import { generateAIResponse } from "./aiService.js";

export const processChat = async ({ message, chatId, pdfId, userId }) => {
  let context = "";

  if (pdfId) {
    const pdf = await Pdf.findById(pdfId);

    if (pdf && pdf.chunks?.length) {
      const relevantChunks = findRelevantChunks(pdf.chunks, message);

      if (relevantChunks.length > 0) {
        context = relevantChunks.join("\n");
      }
    }
  }

  let chat = null;

  if (chatId) {
    chat = await Chat.findById(chatId);
  }

  let history = "";
  if (chat?.messages?.length) {
    history = chat.messages
      .slice(-6)
      .map((m) => `${m.role}: ${m.content}`)
      .join("\n");
  }

  let reply = "";

  try {
    reply = await generateAIResponse(message, context + "\n" + history);
  } catch (err) {
    console.error("AI ERROR:", err.message);
    reply = "Error generating response.";
  }

  if (chatId) {
    await Chat.findOneAndUpdate(
      { _id: chatId, userId },
      {
        $push: {
          messages: {
            $each: [
              { role: "user", content: message },
              { role: "assistant", content: reply },
            ],
          },
        },
      },
      { new: true, upsert: true },
    );
  }

  return reply;
};
