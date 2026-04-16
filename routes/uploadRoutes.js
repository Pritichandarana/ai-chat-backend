import express from "express";
import multer from "multer";
import { handleUpload } from "../controllers/uploadController.js";

const router = express.Router();

/* ================= MULTER CONFIG ================= */
const upload = multer({
  dest: "uploads/",
});

/* ================= ROUTES ================= */
router.post("/upload", upload.single("file"), handleUpload);

export default router;
