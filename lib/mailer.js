import nodemailer from "nodemailer";

let transporter = null;

function getTransporter() {
  const { SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS } = process.env;
  if (!SMTP_HOST || !SMTP_USER || !SMTP_PASS) return null;

  if (!transporter) {
       transporter = nodemailer.createTransport({
      host: SMTP_HOST,
      port: Number(SMTP_PORT) || 587,
      secure: Number(SMTP_PORT) === 465,
      auth: { user: SMTP_USER, pass: SMTP_PASS },
      family: 4, 
    });
  }
  return transporter;
}


export async function sendOtpEmail({ to, name, code }) {
  const t = getTransporter();

  if (!t) {
    console.log(
      `\n[DEV MODE] No SMTP configured — email OTP for ${to} is: ${code}\n`
    );
    return { sent: false, devMode: true };
  }

  const from = process.env.EMAIL_FROM || `QuickPayBooks <${process.env.SMTP_USER}>`;

  await t.sendMail({
    from,
    to,
    subject: `Your QuickPayBooks verification code: ${code}`,
    text: `Hi ${name || "there"},\n\nYour verification code is ${code}. It expires in 5 minutes.\n\nIf you didn't request this, you can ignore this email.\n\n— QuickPayBooks`,
    html: `<div style="font-family:sans-serif;max-width:480px;margin:auto">
      <h2 style="color:#1F2D27">QuickPayBooks</h2>
      <p>Hi ${name || "there"},</p>
      <p>Your verification code is:</p>
      <p style="font-size:28px;font-weight:bold;letter-spacing:4px;color:#B8862F">${code}</p>
      <p style="color:#6B675C;font-size:13px">This code expires in 5 minutes. If you didn't request this, you can ignore this email.</p>
    </div>`,
  });

  return { sent: true, devMode: false };
}
