import express from "express";
const router = express.Router();
router.get("/", (req, res) => res.json([{ name: "placeholder template" }]));
export default router;
