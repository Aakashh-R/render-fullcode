// controllers/sendController.js
import { sendMail } from "../utils/emailService.js";
import Template from "../models/template.js"; // if you store templates in DB
import { renderTemplate } from "../utils/renderTemplate.js"; // your render util
import validator from "validator";
import asyncHandler from "express-async-handler";

export const sendTemplateController = asyncHandler(async (req, res) => {
  const { to, subject, templateId, values } = req.body || {};

  if (!to || !validator.isEmail(String(to))) {
    res.status(400);
    throw new Error("Valid 'to' email is required");
  }
  if (!templateId) {
    res.status(400);
    throw new Error("templateId is required");
  }

  // server-side role check: ensure protect middleware set req.user
  const role = (req.user?.role || "").toString().toLowerCase();
  if (!["shipper", "admin"].includes(role)) {
    res.status(403);
    throw new Error("Not authorized to send templates");
  }

  // find template: from DB (example) or fallback map
  const tpl = await Template.findOne({ id: templateId }).lean();
  if (!tpl) {
    res.status(404);
    throw new Error("Template not found");
  }

  const html = renderTemplate(tpl.templateBody, values || {});
  const text = (html || "").replace(/<[^>]*>/g, "").trim();

  try {
    const info = await sendMail({
      to,
      subject: subject || tpl.title || "Document",
      html,
      text,
    });

    // info may include .previewUrl when using Ethereal
    return res.json({ ok: true, info });
  } catch (err) {
    console.error("sendMail error:", err);
    res
      .status(502)
      .json({ ok: false, error: err.message || "Mail provider error" });
  }
});
