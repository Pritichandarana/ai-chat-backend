import mongoose from "mongoose";

const pdfSchema = new mongoose.Schema({
  fileName: String,
  chunks: [String],
});

export default mongoose.model("Pdf", pdfSchema);
