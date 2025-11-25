// controllers/templateController.js
import { sendMail } from '../utils/emailService.js';
import { renderTemplate, stripHtml } from '../utils/renderTemplate.js';
// import Templates from '../data/templates.js'; // optional local templates module

// Example: Templates could export an array like the TEMPLATES you posted earlier.
// If you store templates in DB, replace the below lookup with a DB query.

export async function sendTemplateEmail(req, res) {
  try {
    const { to, subject, templateId, values } = req.body;

    if (!to || !String(to).includes('@')) {
      return res.status(400).json({ ok: false, error: "Valid 'to' email required" });
    }
    if (!templateId) {
      return res.status(400).json({ ok: false, error: 'templateId is required' });
    }

    // locate template (local fallback)
    const template = (Templates || []).find(t => t.id === templateId);
    if (!template) {
      return res.status(404).json({ ok: false, error: 'Template not found' });
    }

    const html = renderTemplate(template.templateBody || '', values || {});
    const text = stripHtml(html);

    const info = await sendMail({
      to,
      subject: subject || template.title || 'Document',
      html,
      text,
    });

    const result = { ok: true, message: 'Email sent' };
    if (info && info.previewUrl) result.previewUrl = info.previewUrl; // helpful for dev
    return res.json(result);
  } catch (err) {
    console.error('sendTemplateEmail failed:', err && err.stack ? err.stack : err);
    return res.status(500).json({ ok: false, error: 'Failed to send email' });
  }
}
