// routes/sendRoutes.js
import express from "express";
import { sendTemplateController } from "../controllers/sendcontroller.js";
import { protect } from "../middleware/authMiddleware.js"; // ensure protect sets req.user
const router = express.Router();
router.post("/send", protect, sendTemplateController);
export default router;
