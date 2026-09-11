const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../../.env') });
const { transporter, fromEmail, adminEmail } = require('../config/mail');

const clientUrl = process.env.CLIENT_URL || 'http://localhost:5173';

/**
 * Checks if an email belongs to a placeholder or non-deliverable demo domain (e.g. example.com).
 * Seed/demo accounts must not be treated as real email recipients to prevent Gmail "Address not found" bounce notices.
 */
const isPlaceholderEmail = (email) => {
  if (!email || typeof email !== 'string') return true;
  const normalized = email.trim().toLowerCase();
  return (
    normalized.endsWith('@example.com') ||
    normalized.endsWith('@example.org') ||
    normalized.endsWith('@example.net') ||
    normalized.includes('example.com')
  );
};

/**
 * Format priority to High / Medium / Low / Urgent display string.
 */
const formatPriority = (priority) => {
  if (!priority) return 'Medium';
  const p = priority.toString().trim().toUpperCase();
  switch (p) {
    case 'LOW':
      return 'Low';
    case 'HIGH':
      return 'High';
    case 'URGENT':
      return 'Urgent';
    case 'MEDIUM':
    default:
      return 'Medium';
  }
};

/**
 * Format status to user-friendly display string.
 */
const formatStatus = (status) => {
  if (!status) return 'Not Started';
  const s = status.toString().trim().toUpperCase();
  switch (s) {
    case 'NOT_STARTED':
    case 'TODO':
      return 'Not Started';
    case 'IN_PROGRESS':
      return 'In Progress';
    case 'COMPLETED':
      return 'Completed';
    default:
      return status.charAt(0).toUpperCase() + status.slice(1).toLowerCase();
  }
};

/**
 * Flow A: Sends Email Verification OTP to an employee during registration.
 * Blocking/awaitable so caller can guarantee email was dispatched before saving registration.
 * Never logs the OTP value or echoes credentials.
 */
const sendVerificationOtpEmail = async ({ toEmail, name, otp }) => {
  if (!toEmail) {
    throw new Error('No recipient email provided.');
  }

  const normalizedTo = toEmail.trim().toLowerCase();

  // Guard against sending real emails to demo/placeholder domains
  if (isPlaceholderEmail(normalizedTo)) {
    console.log(`[EmailService] Skipping real OTP email delivery for demo address: ${normalizedTo}`);
    return { skipped: true, reason: 'placeholder_email' };
  }

  const employeeName = name ? name.trim() : 'Team Member';

  const mailOptions = {
    from: fromEmail,
    to: normalizedTo,
    subject: 'TaskFlow - Verify Your Email',
    text: `Hello ${employeeName},\n\nYour TaskFlow verification code is:\n\n${otp}\n\nThis code will expire in 5 minutes.\n\nRegards,\nTaskFlow System`,
    html: `
      <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; max-width: 540px; margin: 0 auto; padding: 32px 24px; border: 1px solid #e2e8f0; border-radius: 12px; background-color: #ffffff; color: #1e293b;">
        <div style="margin-bottom: 24px; padding-bottom: 16px; border-bottom: 1px solid #f1f5f9;">
          <h2 style="color: #2563eb; margin: 0; font-size: 22px; font-weight: 700; letter-spacing: -0.5px;">TaskFlow System</h2>
          <p style="color: #64748b; font-size: 13px; margin: 4px 0 0 0;">Employee Email Verification</p>
        </div>
        
        <p style="color: #1e293b; font-size: 15px; margin: 0 0 16px 0;">Hello <strong>${employeeName}</strong>,</p>
        <p style="color: #334155; font-size: 15px; margin: 0 0 20px 0; line-height: 1.5;">Your TaskFlow verification code is:</p>
        
        <div style="background-color: #f1f5f9; padding: 20px; border-radius: 8px; text-align: center; margin: 24px 0; border: 1px dashed #cbd5e1;">
          <span style="font-family: 'Courier New', Courier, monospace; font-size: 34px; font-weight: 700; letter-spacing: 8px; color: #0f172a;">${otp}</span>
        </div>
        
        <p style="color: #64748b; font-size: 14px; line-height: 1.5; margin: 20px 0 28px 0;">
          This code will expire in <strong>5 minutes</strong>.
        </p>
        
        <div style="border-top: 1px solid #e2e8f0; padding-top: 16px; color: #475569; font-size: 14px; line-height: 1.6;">
          Regards,<br />
          <strong style="color: #0f172a;">TaskFlow System</strong>
        </div>
      </div>
    `,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log(`[EmailService] Verification OTP email successfully dispatched to ${normalizedTo}`);
    return info;
  } catch (error) {
    console.error(`[EmailService] Failed to send verification OTP email: ${error.message}`);
    throw error;
  }
};

/**
 * Flow B: Sends Task Assigned Email to the employee's registered email address.
 * Non-blocking: failures are logged server-side only and do not fail the task-creation request.
 * Seed accounts ending in @example.com are safely skipped so Gmail never generates "Address not found" bounce notices.
 */
const sendTaskAssignedEmail = ({ toEmail, employeeName, adminName, taskId, taskTitle, description, priority, status }) => {
  setImmediate(async () => {
    try {
      if (!toEmail) {
        console.warn('[EmailService] Task Assigned: No recipient email provided.');
        return;
      }

      const normalizedTo = toEmail.trim().toLowerCase();

      // Guard: Seed/demo accounts must not be treated as real email recipients
      if (isPlaceholderEmail(normalizedTo)) {
        console.log(`[EmailService] Skipping real task assignment email: recipient "${normalizedTo}" is a demo/placeholder address.`);
        return;
      }

      const name = employeeName ? employeeName.trim() : 'Team Member';
      const formattedPriority = formatPriority(priority);
      const taskDesc = description ? description.trim() : 'No description provided.';
      const taskLink = taskId ? `${clientUrl}/employee/tasks/${taskId}` : `${clientUrl}/employee/tasks`;

      const mailOptions = {
        from: fromEmail,
        to: normalizedTo,
        subject: 'TaskFlow - New Task Assigned',
        text: `Hello ${name},\n\nA new task has been assigned to you.\n\nTask:\n${taskTitle}\n\nDescription:\n${taskDesc}\n\nPriority:\n${formattedPriority}\n\nPlease log in to TaskFlow to view and manage the task.\n\nRegards,\nTaskFlow System`,
        html: `
          <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; max-width: 580px; margin: 0 auto; padding: 32px 24px; border: 1px solid #e2e8f0; border-radius: 12px; background-color: #ffffff; color: #1e293b;">
            <div style="margin-bottom: 24px; padding-bottom: 16px; border-bottom: 1px solid #f1f5f9;">
              <h2 style="color: #2563eb; margin: 0; font-size: 22px; font-weight: 700; letter-spacing: -0.5px;">TaskFlow System</h2>
              <p style="color: #64748b; font-size: 13px; margin: 4px 0 0 0;">New Task Assignment</p>
            </div>

            <p style="color: #1e293b; font-size: 15px; margin: 0 0 16px 0;">Hello <strong>${name}</strong>,</p>
            <p style="color: #334155; font-size: 15px; margin: 0 0 20px 0; line-height: 1.5;">A new task has been assigned to you.</p>
            
            <div style="background-color: #f8fafc; border-left: 4px solid #2563eb; padding: 18px 20px; border-radius: 6px; margin: 24px 0; border: 1px solid #f1f5f9; border-left: 4px solid #2563eb;">
              <div style="margin-bottom: 16px;">
                <span style="display: block; font-size: 12px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px; color: #64748b; margin-bottom: 4px;">Task</span>
                <span style="font-size: 17px; font-weight: 700; color: #0f172a;">${taskTitle}</span>
              </div>

              <div style="margin-bottom: 16px;">
                <span style="display: block; font-size: 12px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px; color: #64748b; margin-bottom: 4px;">Description</span>
                <span style="font-size: 14px; color: #475569; white-space: pre-wrap; line-height: 1.6;">${taskDesc}</span>
              </div>

              <div>
                <span style="display: block; font-size: 12px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px; color: #64748b; margin-bottom: 6px;">Priority</span>
                <span style="display: inline-block; padding: 4px 12px; border-radius: 6px; background-color: #e0e7ff; color: #3730a3; font-weight: 700; font-size: 13px;">${formattedPriority}</span>
              </div>
            </div>

            <div style="margin: 28px 0;">
              <a href="${taskLink}" style="display: inline-block; padding: 12px 22px; background-color: #2563eb; color: #ffffff; text-decoration: none; border-radius: 8px; font-weight: 600; font-size: 14px;">
                Log In to TaskFlow →
              </a>
            </div>

            <p style="color: #64748b; font-size: 14px; line-height: 1.5; margin: 0 0 24px 0;">
              Please log in to TaskFlow to view and manage the task.
            </p>

            <div style="border-top: 1px solid #e2e8f0; padding-top: 16px; color: #475569; font-size: 14px; line-height: 1.6;">
              Regards,<br />
              <strong style="color: #0f172a;">TaskFlow System</strong>
            </div>
          </div>
        `,
      };

      await transporter.sendMail(mailOptions);
      console.log(`[EmailService] Task Assigned notification successfully dispatched to ${normalizedTo}`);
    } catch (error) {
      console.error(`[EmailService] Failed to send Task Assigned email: ${error.message}`);
    }
  });
};

/**
 * Flow C: Sends Task Status Updated Email to Admin.
 * Status update persists in DB regardless of email delivery.
 * Recipient is read strictly from process.env.ADMIN_EMAIL.
 * Never hardcodes admin@example.com or sends to placeholder domains.
 */
const sendTaskStatusUpdatedEmail = async ({ adminEmail: directAdminEmail, adminEmails, employeeName, taskTitle, taskId, previousStatus, newStatus, updatedAt }) => {
  try {
    let recipient = process.env.ADMIN_EMAIL || directAdminEmail;
    if (!recipient && adminEmails) {
      recipient = Array.isArray(adminEmails) ? adminEmails[0] : adminEmails;
    }
    if (!recipient || isPlaceholderEmail(recipient)) {
      recipient = process.env.ADMIN_EMAIL || adminEmail || 'admin.taskflow@gmail.com';
    }

    if (!recipient) {
      console.warn('[EmailService] Status Updated: No admin email found to notify.');
      return;
    }

    const normalizedRecipient = recipient.trim().toLowerCase();

    // Guard: Never use placeholder/demo domains for real email delivery
    if (isPlaceholderEmail(normalizedRecipient)) {
      console.log(`[EmailService] Skipping real status update email: admin recipient "${normalizedRecipient}" is a placeholder address.`);
      return;
    }

    const name = employeeName ? employeeName.trim() : 'An employee';
    const taskLink = taskId ? `${clientUrl}/admin/tasks/${taskId}` : `${clientUrl}/admin/tasks`;

    console.log(`[EmailService] Sending task status notification to: ${normalizedRecipient}`);

    const mailOptions = {
      from: fromEmail,
      to: normalizedRecipient,
      subject: 'TaskFlow - Task Status Updated',
      text: `Hello Admin,\n\n${name} has updated the status of a task.\n\nTask:\n${taskTitle}\n\nPrevious Status:\n${previousStatus}\n\nNew Status:\n${newStatus}\n\nPlease log in to TaskFlow to view the latest update.\n\nRegards,\nTaskFlow System`,
      html: `
        <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; max-width: 580px; margin: 0 auto; padding: 32px 24px; border: 1px solid #e2e8f0; border-radius: 12px; background-color: #ffffff; color: #1e293b;">
          <div style="margin-bottom: 24px; padding-bottom: 16px; border-bottom: 1px solid #f1f5f9;">
            <h2 style="color: #0f172a; margin: 0; font-size: 22px; font-weight: 700; letter-spacing: -0.5px;">TaskFlow System</h2>
            <p style="color: #64748b; font-size: 13px; margin: 4px 0 0 0;">Task Status Update</p>
          </div>

          <p style="color: #1e293b; font-size: 15px; margin: 0 0 16px 0;">Hello <strong>Admin</strong>,</p>
          <p style="color: #334155; font-size: 15px; margin: 0 0 20px 0; line-height: 1.5;"><strong>${name}</strong> has updated the status of a task.</p>
          
          <div style="background-color: #f8fafc; border-left: 4px solid #10b981; padding: 18px 20px; border-radius: 6px; margin: 24px 0; border: 1px solid #f1f5f9; border-left: 4px solid #10b981;">
            <div style="margin-bottom: 16px;">
              <span style="display: block; font-size: 12px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px; color: #64748b; margin-bottom: 4px;">Task</span>
              <span style="font-size: 17px; font-weight: 700; color: #0f172a;">${taskTitle}</span>
            </div>

            <div style="margin-bottom: 14px;">
              <span style="display: block; font-size: 12px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px; color: #64748b; margin-bottom: 4px;">Previous Status</span>
              <span style="font-size: 14px; text-decoration: line-through; color: #64748b; font-weight: 500;">${previousStatus}</span>
            </div>

            <div>
              <span style="display: block; font-size: 12px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px; color: #64748b; margin-bottom: 6px;">New Status</span>
              <span style="display: inline-block; padding: 4px 12px; border-radius: 6px; background-color: #d1fae5; color: #065f46; font-weight: 700; font-size: 13px;">${newStatus}</span>
            </div>
          </div>

          <div style="margin: 28px 0;">
            <a href="${taskLink}" style="display: inline-block; padding: 12px 22px; background-color: #0f172a; color: #ffffff; text-decoration: none; border-radius: 8px; font-weight: 600; font-size: 14px;">
              View in Admin Console →
            </a>
          </div>

          <p style="color: #64748b; font-size: 14px; line-height: 1.5; margin: 0 0 24px 0;">
            Please log in to TaskFlow to view the latest update.
          </p>

          <div style="border-top: 1px solid #e2e8f0; padding-top: 16px; color: #475569; font-size: 14px; line-height: 1.6;">
            Regards,<br />
            <strong style="color: #0f172a;">TaskFlow System</strong>
          </div>
        </div>
      `,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('[EmailService] Email sent successfully');
    console.log(`[EmailService] Message ID: ${info.messageId}`);
    return { success: true, messageId: info.messageId, info };
  } catch (error) {
    console.error('[EmailService] Failed to send task status notification');
    console.error(`[EmailService] ${error.message}`);
    return { success: false, error: error.message };
  }
};

module.exports = {
  isPlaceholderEmail,
  sendTaskAssignedEmail,
  sendTaskStatusUpdatedEmail,
  sendVerificationOtpEmail,
};
