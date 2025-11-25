// utils/emailService.js
import nodemailer from 'nodemailer';

let transporter = null;
let usingTestAccount = false;

async function createTransporter() {
  if (transporter) return transporter;

  const host = process.env.MAIL_HOST;
  const port = parseInt(process.env.MAIL_PORT || '587', 10);
  const secure = process.env.MAIL_SECURE === 'true';

  const user = process.env.MAIL_USER;
  const pass = process.env.MAIL_PASS;

  // If a MAIL_HOST is explicitly set, use it (user supplied SMTP)
  if (host) {
    transporter = nodemailer.createTransport({
      host,
      port,
      secure,
      auth: user ? { user, pass } : undefined,
      pool: true,
      tls: {
        rejectUnauthorized: process.env.NODE_ENV === 'production',
      },
    });
    usingTestAccount = false;
    console.log(`Using SMTP host=${host} port=${port} secure=${secure}`);
    transporter
      .verify()
      .then(() => console.log('Mail transporter verified'))
      .catch(err =>
        console.warn('Mail transporter verify failed:', err && err.message ? err.message : err)
      );
    return transporter;
  }

  // If no MAIL_HOST but SENDGRID_API_KEY is set — auto-configure SendGrid SMTP
  if (process.env.SENDGRID_API_KEY) {
    // SendGrid SMTP credentials: host smtp.sendgrid.net, user "apikey", pass = actual API key
    transporter = nodemailer.createTransport({
      host: 'smtp.sendgrid.net',
      port: port || 587,
      secure: false,
      auth: {
        user: process.env.MAIL_USER || 'apikey',
        pass: process.env.SENDGRID_API_KEY,
      },
      pool: true,
      tls: {
        rejectUnauthorized: process.env.NODE_ENV === 'production',
      },
    });
    usingTestAccount = false;
    console.log('Using SendGrid SMTP (via SENDGRID_API_KEY).');
    transporter
      .verify()
      .then(() => console.log('Mail transporter verified (SendGrid)'))
      .catch(err =>
        console.warn(
          'Mail transporter verify failed (SendGrid):',
          err && err.message ? err.message : err
        )
      );
    return transporter;
  }

  // Fallback: create Ethereal account for development convenience
  if (process.env.NODE_ENV !== 'production') {
    const test = await nodemailer.createTestAccount();
    transporter = nodemailer.createTransport({
      host: 'smtp.ethereal.email',
      port: 587,
      secure: false,
      auth: { user: test.user, pass: test.pass },
    });
    usingTestAccount = true;
    console.log('Using Ethereal test SMTP account for mails (dev).');
    transporter
      .verify()
      .then(() => console.log('Mail transporter verified (Ethereal)'))
      .catch(err =>
        console.warn(
          'Mail transporter verify failed (Ethereal):',
          err && err.message ? err.message : err
        )
      );
    return transporter;
  }

  throw new Error('No mail transport configured (set MAIL_HOST or SENDGRID_API_KEY).');
}

export async function getTransporter() {
  if (transporter) return transporter;
  return createTransporter();
}

/**
 * sendMail: Accepts { to, subject, html, text }.
 * Server ALWAYS uses MAIL_FROM (no client-provided from accepted).
 */
export async function sendMail({ to, subject, html, text }) {
  const t = await getTransporter();

  const forcedFrom = process.env.MAIL_FROM || 'no-reply@example.com';
  if (process.env.NODE_ENV === 'production' && !process.env.MAIL_FROM) {
    throw new Error('MAIL_FROM must be configured in production');
  }

  if (!to || !String(to).includes('@')) {
    throw new Error("Valid recipient 'to' required");
  }

  const mailOptions = {
    from: forcedFrom,
    to,
    subject,
    text,
    html,
  };

  const info = await t.sendMail(mailOptions);

  // attach Ethereal preview url when available (dev)
  try {
    const previewUrl = nodemailer.getTestMessageUrl(info);
    if (previewUrl) info.previewUrl = previewUrl;
  } catch (err) {
    /* ignore */
  }

  return info;
}

export async function verifyTransporter() {
  try {
    const t = await getTransporter();
    await t.verify();
    console.log('verifyTransporter: OK');
  } catch (err) {
    console.warn('verifyTransporter failed:', err && err.message ? err.message : err);
  }
}
