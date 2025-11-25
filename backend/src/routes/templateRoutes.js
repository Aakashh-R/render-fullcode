// routes/templateRoutes.js
import express from 'express';
import { sendTemplateEmail } from '../controllers/templateController.js';
// import authMiddleware from '../middleware/auth.js'; // optional

const router = express.Router();

// Protect the route if you want:
router.post('/send', sendTemplateEmail);

// routes/templates.js
// import express from "express";
import multer from "multer";
import { getTransporter, sendMail } from "../utils/emailService.js";


const upload = multer(); // memory storage

const TEMPLATES = [
  {
    id: "quotation",
    title: "QUOTATION",
    templateBody: `<h2>Quotation</h2>
       <p>Date: {{date}}</p>
       <p>To: <strong>{{to}}</strong> — {{company}}</p>
       <p>Items: {{items}}</p>
       <p>Total: {{total}}</p>
       <p>Notes: {{notes}}</p>`,
  },
  {
    id: "invoice",
    title: "INVOICE",
    templateBody: `<h2>Invoice</h2>
       <p>Date: {{date}}</p>
       <p>Invoice No: {{invoiceNo}}</p>
       <p>Bill To: {{billTo}}</p>
       <pre style="white-space:pre-wrap;">{{items}}</pre>
       <p>Subtotal: {{subtotal}}</p>
       <p>Tax: {{tax}}</p>
       <p><strong>Total: {{total}}</strong></p>`,
  },
];

function renderTemplateServer(body, values) {
  if (!body) return "";
  return body.replace(/{{\s*([^}]+)\s*}}/g, (m, key) => {
    const v = values && values[key] !== undefined ? values[key] : "";
    return String(v).replace(/</g, "&lt;").replace(/>/g, "&gt;");
  });
}

function stripHtml(html) {
  if (!html) return "";
  return String(html).replace(/<[^>]*>/g, "");
}

router.post("/send", upload.single("file"), async (req, res) => {
  try {
    const isMultipart = !!req.file;
    const to = (req.body && req.body.to) || "";
    const subject = (req.body && (req.body.subject || req.body.subject === "" ? req.body.subject : "Document")) || "Document";

    if (!to || !String(to).includes("@")) {
      return res.status(400).json({ ok: false, message: "Valid recipient required" });
    }

    if (isMultipart) {
      const html = req.file.buffer.toString("utf8");
      const transporter = await getTransporter();
      const forcedFrom = process.env.MAIL_FROM || "no-reply@example.com";

      const mailOptions = {
        from: forcedFrom,
        to,
        subject,
        html,
        attachments: [
          {
            filename: req.file.originalname || "document.html",
            content: req.file.buffer,
            contentType: req.file.mimetype || "text/html",
          },
        ],
      };

      const info = await transporter.sendMail(mailOptions);
      const previewUrl = info?.previewUrl || null;
      return res.status(200).json({ ok: true, message: "Email sent (with attachment)", previewUrl });
    }

    // JSON / normal flow
    const { templateId, values, html, text } = req.body || {};
    let finalHtml = html || "";
    let finalText = text || "";

    if (!finalHtml && templateId) {
      const tmpl = TEMPLATES.find((t) => t.id === templateId);
      if (tmpl) {
        finalHtml = renderTemplateServer(tmpl.templateBody, values || {});
        finalText = stripHtml(finalHtml);
      }
    }

    if (!finalHtml && !finalText) {
      return res.status(400).json({ ok: false, message: "No content to send" });
    }

    const info = await sendMail({ to, subject, html: finalHtml, text: finalText });
    const previewUrl = info?.previewUrl || null;
    return res.status(200).json({ ok: true, message: "Email sent", previewUrl });
  } catch (err) {
    console.error("templates.send error", err && err.message ? err.message : err);
    return res.status(500).json({ ok: false, message: err?.message || "send failed" });
  }
});

export default router;
