import nodemailer, { Transporter } from "nodemailer";

let transporter: Transporter | null = null;

function getTransporter(): Transporter {
  if (transporter) return transporter;

  const { SMTP_EMAIL, SMTP_PASSWORD, SMTP_HOST, SMTP_PORT } = process.env;

  if (!SMTP_EMAIL || !SMTP_PASSWORD || !SMTP_HOST || !SMTP_PORT) {
    throw new Error("SMTP credentials are not properly set");
  }

  transporter = nodemailer.createTransport({
    host: SMTP_HOST,
    port: Number(SMTP_PORT),
    secure: false,
    auth: {
      user: SMTP_EMAIL,
      pass: SMTP_PASSWORD,
    },
  });

  return transporter;
}

export async function sendEmail(to: string, subject: string, html: string) {
  const mailer = getTransporter();

  const info = await mailer.sendMail({
    from: `"Todo App" <${process.env.SMTP_EMAIL}>`,
    to,
    subject,
    html,
  });

  console.log("Email sent:", info.messageId);
}
