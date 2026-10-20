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

async function sendEmail({ from, to, replyTo, subject, text, html }) {
  if (process.env.RESEND_API_KEY) {
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
  const transport = createNodemailerTransport();
  const info = await transport.sendMail({ from, to, replyTo, subject, text, html });
  return { messageId: info.messageId };
}

async function verifyTransporter() {
  try {
    if (process.env.RESEND_API_KEY) {
      console.log("[EmailService] Resend HTTP API mode active — SMTP ports are not used.");
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

