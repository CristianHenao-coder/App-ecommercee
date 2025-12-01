import nodemailer from "nodemailer";

/**
 * Create and return a nodemailer transporter
 */
export function createEmailTransporter() {
  return nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });
}

/**
 * Send an email using nodemailer
 * Logs errors but doesn't throw to avoid breaking the main flow
 */
export async function sendEmail(
  to: string,
  subject: string,
  html: string,
  from?: string
): Promise<{ success: boolean; error?: string }> {
  try {
    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
      console.warn("Email credentials not configured. Skipping email send.");
      return { success: false, error: "Email not configured" };
    }

    const transporter = createEmailTransporter();
    const emailFrom = from || process.env.EMAIL_USER;

    await transporter.sendMail({
      from: emailFrom,
      to,
      subject,
      html,
    });

    return { success: true };
  } catch (error: any) {
    console.error("Error sending email:", error);
    return { success: false, error: error.message || "Unknown error" };
  }
}

