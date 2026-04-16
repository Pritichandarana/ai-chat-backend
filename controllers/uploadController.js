import Tesseract from "tesseract.js";
import { PdfReader } from "pdfreader";

export const handleUpload = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    const filePath = req.file.path;
    const mime = req.file.mimetype;

    let extractedText = "";

    if (mime === "application/pdf") {
      await new Promise((resolve, reject) => {
        new PdfReader().parseFileItems(filePath, (err, item) => {
          if (err) return reject(err);
          if (!item) resolve();
          else if (item.text) extractedText += item.text + " ";
        });
      });
    } else if (mime.startsWith("image/")) {
      const result = await Tesseract.recognize(filePath, "eng");
      extractedText = result.data.text;
    } else {
      extractedText = "Unsupported file type";
    }

    res.json({
      fileName: req.file.originalname,
      text: extractedText.slice(0, 5000),
    });
  } catch (err) {
    console.error("UPLOAD ERROR:", err);
    res.status(500).json({ error: err.message });
  }
};
