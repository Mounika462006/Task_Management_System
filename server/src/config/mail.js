const nodemailer = require("nodemailer");

let _resendClient = null;

function getResendClient() {
  if (!_resendClient) {
    const { Resend } = require("resend");
    _resendClient = new Resend(process.env.RESEND_API_KEY);
  }
  return _resendClient;
}

function createNodemailerTransport() {
  const user = process.env.SMTP_USER || "taskflow.portal@gmail.com";
  const pass = process.env.SMTP_PASSWORD;
  const host = process.env.SMTP_HOST || "smtp.gmail.com";
  if (host === "smtp.gmail.com") {
    return nodemailer.createTransport({ service: "gmail", auth: { user, pass } });
  }
  const port = parseInt(process.env.SMTP_PORT || "587", 10);
  const secure = process.env.SMTP_SECURE === "true" || port === 465;
  return nodemailer.createTransport({ host, port, secure, auth: { user, pass } });
}

/**
 * Brevo (Sendinblue) HTTP API dispatcher.
 * Sends emails to ANY different email address (friends, employees, examiners)
 * without requiring a custom domain. Uses standard HTTPS port 443.
 */
async function sendWithBrevo({ from, to, replyTo, subject, text, html }) {
  const apiKey = process.env.BREVO_API_KEY;
  const senderEmail = process.env.BREVO_SENDER || process.env.SMTP_USER || "taskflow.portal@gmail.com";
  let senderName = process.env.BREVO_SENDER_NAME || "TaskFlow System";
  if (from && typeof from === "string" && from.includes('"')) {
    const match = from.match(/"([^"]+)"/);
    if (match && match[1]) {
      senderName = `${match[1]} (via TaskFlow)`;
    }
  }

  const recipients = (Array.isArray(to) ? to : [to]).map((email) => ({
    email: typeof email === "string" ? email.trim() : email.email,
  }));

  const payload = {
    sender: { name: senderName, email: senderEmail },
    to: recipients,
    subject: subject,
    htmlContent: html || ("<pre>" + text + "</pre>"),
  };

  if (text) {
    payload.textContent = text;
  }

  if (replyTo && typeof replyTo === "string" && replyTo.includes("@")) {
    payload.replyTo = { email: replyTo.trim() };
  }

  const response = await fetch("https://api.brevo.com/v3/smtp/email", {
    method: "POST",
    headers: {
      "accept": "application/json",
      "api-key": apiKey,
      "content-type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    const errMsg = data.message || data.error || response.statusText || "Unknown Brevo error";
    throw new Error(`Brevo API error (${response.status}): ${errMsg}`);
  }

  return { messageId: data.messageId || "brevo-sent" };
}

/**
 * Resend HTTP API dispatcher.
 */
async function sendWithResend({ from, to, replyTo, subject, text, html }) {
  const resend = getResendClient();
  const resendFrom = process.env.RESEND_FROM || "TaskFlow <onboarding@resend.dev>";
  const result = await resend.emails.send({
    from: resendFrom,
    to: Array.isArray(to) ? to : [to],
    subject,
    html: html || ("<pre>" + text + "</pre>"),
    ...(text && { text }),
    ...(replyTo && { reply_to: replyTo }),
  });
  if (result.error) {
    throw new Error("Resend API error: " + (result.error.message || JSON.stringify(result.error)));
  }
  return { messageId: result.data && result.data.id ? result.data.id : "resend-sent" };
}

/**
 * Universal email dispatcher:
 * 1. If BREVO_API_KEY is configured -> sends to ANY recipient email via Brevo HTTP API (Port 443)
 * 2. If RESEND_API_KEY is configured -> sends via Resend HTTP API (Port 443)
 * 3. Default fallback -> Nodemailer Gmail SMTP (local dev)
 */
async function sendEmail(options) {
  if (process.env.BREVO_API_KEY) {
    return await sendWithBrevo(options);
  }
  if (process.env.RESEND_API_KEY) {
    return await sendWithResend(options);
  }
  const transport = createNodemailerTransport();
  const info = await transport.sendMail(options);
  return { messageId: info.messageId };
}

async function verifyTransporter() {
  try {
    if (process.env.BREVO_API_KEY) {
      console.log("[EmailService] Brevo HTTP API mode active — can send to ANY recipient email.");
      return true;
    }
    if (process.env.RESEND_API_KEY) {
      console.log("[EmailService] Resend HTTP API mode active.");
      return true;
    }
    const transport = createNodemailerTransport();
    if (!process.env.SMTP_PASSWORD) {
      console.error("[EmailService] CRITICAL WARNING: SMTP_PASSWORD is not set!");
      return false;
    }
    await transport.verify();
    console.log("[EmailService] Nodemailer SMTP verified (local dev mode).");
    return true;
  } catch (error) {
    console.error("[EmailService] Transport verification failed: " + error.message);
    return false;
  }
}

module.exports = {
  sendEmail,
  verifyTransporter,
  createNodemailerTransport,
  get transporter() {
    return createNodemailerTransport();
  },
  fromEmail: process.env.EMAIL_FROM || '"TaskFlow System" <taskflow.portal@gmail.com>',
  adminEmail: process.env.ADMIN_EMAIL || "admin.taskflow@gmail.com",
};
