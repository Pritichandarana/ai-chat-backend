import groq from "../config/groq.js";

export const generateAIResponse = async (message, context) => {
  const completion = await groq.chat.completions.create({
    model: "llama-3.3-70b-versatile",
    messages: [
      {
        role: "system",
        content:
          "Answer based ONLY on the provided PDF context. If not found, say 'Not found in document'.",
      },
      {
        role: "user",
        content: `Context:\n${context}\n\nQuestion:\n${message}`,
      },
    ],
  });

  return completion.choices[0].message.content;
};
