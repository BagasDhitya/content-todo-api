import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

const SMTP_EMAIL = process.env.SMTP_EMAIL;
const SMTP_PASSWORD = process.env.SMTP_PASSWORD;
const SMTP_HOST = process.env.SMTP_HOST;
const SMTP_PORT = Number(process.env.SMTP_PORT);

if (!SMTP_EMAIL || !SMTP_PASSWORD) {
  throw new Error("SMTP Credentials are not set in .env");
}

const transporter = nodemailer.createTransport({
  host: SMTP_HOST,
  port: SMTP_PORT,
  secure: false,
  auth: {
    user: SMTP_EMAIL,
    pass: SMTP_PASSWORD,
  },
});

export async function sendEmail(to: string, subject: string, html: string) {
  const info = await transporter.sendMail({
    from: `"Todo App" <${SMTP_EMAIL}>`,
    to,
    subject,
    html,
  });

  console.log("Email sent : ", info.messageId);
}
