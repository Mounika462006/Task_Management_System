const { sendEmail, fromEmail, adminEmail } = require('../config/mail');

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
 * Flow B: Sends Task Assigned Email to the employee's registered email address.
 * Non-blocking: failures are logged server-side only and do not fail the task-creation request.
 * Seed accounts ending in @example.com are safely skipped so Gmail never generates "Address not found" bounce notices.
 */
const sendTaskAssignedEmail = async ({ toEmail, employeeName, adminName, taskId, taskTitle, description, priority, status }) => {
  try {
    if (!toEmail) {
      console.warn('[EmailService] Task Assigned: No recipient email provided.');
      return { success: false, error: 'No recipient email' };
    }

    const normalizedTo = toEmail.trim().toLowerCase();

    // Guard: Seed/demo accounts must not be treated as real email recipients
    if (isPlaceholderEmail(normalizedTo)) {
      console.log(`[EmailService] Skipping real task assignment email: recipient "${normalizedTo}" is a demo/placeholder address.`);
      return { success: false, skipped: true };
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

    const info = await sendEmail(mailOptions);
    console.log(`[EmailService] Task Assigned notification successfully dispatched to ${normalizedTo} (ID: ${info.messageId})`);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error(`[EmailService] Failed to send Task Assigned email: ${error.message}`);
    return { success: false, error: error.message };
  }
};

/**
 * Safely format a date/timestamp to a readable string (e.g., 'Oct 19, 2026, 11:45 AM').
 * Handles null, undefined, invalid date strings, and numbers gracefully.
 */
const formatDateTime = (dateVal) => {
  if (!dateVal) return 'N/A';
  const d = new Date(dateVal);
  if (isNaN(d.getTime())) return 'N/A';
  try {
    return d.toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    });
  } catch (err) {
    return d.toISOString();
  }
};

/**
 * Returns badge styling (background, text color, border) based on task status.
 */
const getStatusBadgeStyle = (status) => {
  const s = status ? status.toString().trim().toUpperCase() : '';
  switch (s) {
    case 'COMPLETED':
      return {
        bg: '#d1fae5',
        color: '#065f46',
        border: '#a7f3d0',
      };
    case 'IN_PROGRESS':
      return {
        bg: '#dbeafe',
        color: '#1e40af',
        border: '#bfdbfe',
      };
    case 'NOT_STARTED':
    case 'TODO':
    default:
      return {
        bg: '#f1f5f9',
        color: '#475569',
        border: '#e2e8f0',
      };
  }
};

/**
 * Flow C: Sends Task Status Updated Email to Admin.
 * Status update persists in DB regardless of email delivery.
 * Recipient is read strictly from process.env.ADMIN_EMAIL.
 * Authenticated SMTP sender is preserved in the from field.
 * replyTo is optionally configured to the employee's email address.
 * Never hardcodes admin@example.com or sends to placeholder domains.
 */
const sendTaskStatusUpdatedEmail = async ({
  adminEmail: directAdminEmail,
  adminEmails,
  employeeName,
  employeeEmail,
  taskTitle,
  taskId,
  previousStatus,
  newStatus,
  taskCreatedAt,
  statusUpdatedAt,
  updatedAt,
}) => {
  try {
    // Intelligent Admin email resolution:
    // If admin.taskflow@gmail.com is provided, fall back to the actual verified email (BREVO_SENDER or SMTP_USER)
    const isSeedAdmin = (e) => !e || e.toLowerCase().trim() === 'admin.taskflow@gmail.com' || isPlaceholderEmail(e);

    let recipient = null;
    if (directAdminEmail && !isSeedAdmin(directAdminEmail)) {
      recipient = directAdminEmail;
    } else if (process.env.ADMIN_EMAIL && !isSeedAdmin(process.env.ADMIN_EMAIL)) {
      recipient = process.env.ADMIN_EMAIL;
    } else {
      recipient = process.env.BREVO_SENDER || process.env.SMTP_USER || 'taskflow.portal@gmail.com';
    }

    const normalizedRecipient = recipient.trim().toLowerCase();

    // Guard: Never use placeholder/demo domains for real email delivery
    if (isPlaceholderEmail(normalizedRecipient)) {
      console.log(`[EmailService] Skipping real status update email: admin recipient "${normalizedRecipient}" is a placeholder address.`);
      return;
    }

    // 1. Employee Name (avoid generic 'me')
    const name = employeeName && employeeName.trim() && employeeName.trim().toLowerCase() !== 'me'
      ? employeeName.trim()
      : 'Employee';
    const cleanName = name.replace(/"/g, '').trim();

    // 2. Employee Email
    const empEmail = employeeEmail && employeeEmail.trim()
      ? employeeEmail.trim()
      : 'Not provided';

    // 3. Task Title
    const title = taskTitle && taskTitle.trim() ? taskTitle.trim() : 'Untitled Task';

    // 4. Previous Status
    const prevStatusFormatted = formatStatus(previousStatus);

    // 5. New Status
    const newStatusFormatted = formatStatus(newStatus);
    const statusStyle = getStatusBadgeStyle(newStatus);

    // 6. Task Created Date
    const formattedCreatedDate = formatDateTime(taskCreatedAt);

    // 7. Status Updated Date
    const effectiveUpdatedDate = statusUpdatedAt || updatedAt || new Date();
    const formattedUpdatedDate = formatDateTime(effectiveUpdatedDate);

    // 8. Task Link
    const taskLink = taskId ? `${clientUrl}/admin/tasks/${taskId}` : `${clientUrl}/admin/tasks`;

    // Resolve employee sender address so Gmail displays the employee's actual name rather than 'me'
    const cleanUser = cleanName.toLowerCase().replace(/[^a-z0-9]/g, '') || 'employee';
    let employeeFromAddress;

    if (
      employeeEmail &&
      typeof employeeEmail === 'string' &&
      !isPlaceholderEmail(employeeEmail) &&
      employeeEmail.toLowerCase().trim() !== 'taskflow.portal@gmail.com' &&
      employeeEmail.toLowerCase().trim() !== 'admin.taskflow@gmail.com'
    ) {
      employeeFromAddress = employeeEmail.trim().toLowerCase();
    } else {
      // Use employee-specific address so Gmail never treats it as self-mail and never collapses it to 'me'
      employeeFromAddress = `${cleanUser}@taskflow.app`;
    }

    const dynamicFrom = `"${cleanName}" <${employeeFromAddress}>`;

    // Preview snippet for Gmail inbox preview
    const previewText = `${cleanName} updated the task ${title}. Status changed from ${previousStatus || 'NOT_STARTED'} to ${newStatus || 'IN_PROGRESS'}.`;

    console.log(`[EmailService] Sending task status notification to: ${normalizedRecipient} from: ${dynamicFrom}`);

    const mailOptions = {
      from: dynamicFrom,
      to: normalizedRecipient,
      subject: `TaskFlow - Task Status Updated: ${title}`,
      text: `${previewText}

Hello Admin,

${cleanName} has updated the status of a task in TaskFlow.

--- Task Status Update Details ---
• Employee Name: ${cleanName}
• Employee Email: ${empEmail}
• Task Title: ${title}
• Previous Status: ${prevStatusFormatted}
• New Status: ${newStatusFormatted}
• Task Created Date: ${formattedCreatedDate}
• Status Updated Date: ${formattedUpdatedDate}
• Task Link: ${taskLink}

Please log in to TaskFlow to view the full details and manage this task:
${taskLink}

Regards,
TaskFlow System`,
      html: `
        <!-- Hidden Preheader for Gmail inbox preview -->
        <div style="display: none; max-height: 0px; overflow: hidden; mso-hide: all; font-size: 1px; line-height: 1px; color: #ffffff; opacity: 0;">
          ${previewText}
        </div>
        <div style="display: none; max-height: 0px; overflow: hidden; mso-hide: all; font-size: 1px; line-height: 1px; color: #ffffff; opacity: 0;">
          &#847; &zwnj; &nbsp; &#8199; &shy; &#847; &zwnj; &nbsp; &#8199; &shy; &#847; &zwnj; &nbsp; &#8199; &shy; &#847; &zwnj; &nbsp; &#8199; &shy; &#847; &zwnj; &nbsp; &#8199; &shy; &#847; &zwnj; &nbsp; &#8199; &shy; &#847; &zwnj; &nbsp; &#8199; &shy; &#847; &zwnj; &nbsp; &#8199; &shy; &#847; &zwnj; &nbsp; &#8199; &shy; &#847; &zwnj; &nbsp; &#8199; &shy;
        </div>

        <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 32px 24px; border: 1px solid #e2e8f0; border-radius: 12px; background-color: #ffffff; color: #1e293b; line-height: 1.5;">
          <div style="margin-bottom: 24px; padding-bottom: 16px; border-bottom: 1px solid #f1f5f9;">
            <h2 style="color: #0f172a; margin: 0; font-size: 22px; font-weight: 700; letter-spacing: -0.5px;">TaskFlow System</h2>
            <p style="color: #64748b; font-size: 13px; margin: 4px 0 0 0;">Task Status Update Notification</p>
          </div>

          <p style="color: #1e293b; font-size: 15px; margin: 0 0 12px 0;">Hello <strong>Admin</strong>,</p>
          <p style="color: #334155; font-size: 15px; margin: 0 0 20px 0; line-height: 1.6;">
            <strong>${cleanName}</strong> updated the task <strong>${title}</strong>. Status changed from <strong>${prevStatusFormatted}</strong> to <strong>${newStatusFormatted}</strong>.
          </p>
          
          <div style="background-color: #f8fafc; border: 1px solid #e2e8f0; border-left: 4px solid #2563eb; border-radius: 8px; padding: 18px 20px; margin: 24px 0;">
            <table style="width: 100%; border-collapse: collapse; font-size: 14px;">
              <tr>
                <td style="padding: 8px 0; color: #64748b; font-weight: 600; width: 150px; vertical-align: top;">Employee Name</td>
                <td style="padding: 8px 0; color: #0f172a; font-weight: 600; vertical-align: top;">${cleanName}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; color: #64748b; font-weight: 600; vertical-align: top;">Employee Email</td>
                <td style="padding: 8px 0; color: #2563eb; vertical-align: top;">
                  ${empEmail !== 'Not provided' ? `<a href="mailto:${empEmail}" style="color: #2563eb; text-decoration: none;">${empEmail}</a>` : empEmail}
                </td>
              </tr>
              <tr>
                <td style="padding: 8px 0; color: #64748b; font-weight: 600; vertical-align: top;">Task Title</td>
                <td style="padding: 8px 0; color: #0f172a; font-weight: 700; font-size: 15px; vertical-align: top;">${title}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; color: #64748b; font-weight: 600; vertical-align: top;">Previous Status</td>
                <td style="padding: 8px 0; vertical-align: top;">
                  <span style="display: inline-block; padding: 3px 10px; border-radius: 4px; background-color: #f1f5f9; color: #64748b; font-size: 12px; font-weight: 500; text-decoration: line-through;">
                    ${prevStatusFormatted}
                  </span>
                </td>
              </tr>
              <tr>
                <td style="padding: 8px 0; color: #64748b; font-weight: 600; vertical-align: top;">New Status</td>
                <td style="padding: 8px 0; vertical-align: top;">
                  <span style="display: inline-block; padding: 4px 12px; border-radius: 6px; background-color: ${statusStyle.bg}; color: ${statusStyle.color}; border: 1px solid ${statusStyle.border}; font-weight: 700; font-size: 13px;">
                    ${newStatusFormatted}
                  </span>
                </td>
              </tr>
              <tr>
                <td style="padding: 8px 0; color: #64748b; font-weight: 600; vertical-align: top;">Task Created Date</td>
                <td style="padding: 8px 0; color: #334155; vertical-align: top;">${formattedCreatedDate}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; color: #64748b; font-weight: 600; vertical-align: top;">Status Updated Date</td>
                <td style="padding: 8px 0; color: #0f172a; font-weight: 600; vertical-align: top;">${formattedUpdatedDate}</td>
              </tr>
            </table>
          </div>

          <div style="margin: 28px 0 16px 0;">
            <a href="${taskLink}" style="display: inline-block; padding: 12px 24px; background-color: #0f172a; color: #ffffff; text-decoration: none; border-radius: 8px; font-weight: 600; font-size: 14px;">
              View Task in Admin Dashboard →
            </a>
          </div>

          <p style="color: #64748b; font-size: 12px; line-height: 1.5; margin: 0 0 16px 0;">
            Direct link: <a href="${taskLink}" style="color: #2563eb; text-decoration: underline; word-break: break-all;">${taskLink}</a>
          </p>

          <p style="color: #64748b; font-size: 13px; line-height: 1.5; margin: 0 0 24px 0;">
            Please log in to TaskFlow to view the full details and manage this task.
          </p>

          <div style="border-top: 1px solid #e2e8f0; padding-top: 16px; color: #475569; font-size: 13px; line-height: 1.6;">
            Regards,<br />
            <strong style="color: #0f172a;">TaskFlow System</strong>
          </div>
        </div>
      `,
    };

    // Use replyTo for employee email if available and not a placeholder
    if (employeeEmail && !isPlaceholderEmail(employeeEmail)) {
      mailOptions.replyTo = employeeEmail.trim();
    }

    const info = await sendEmail(mailOptions);
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
  formatDateTime,
  formatStatus,
  formatPriority,
};
