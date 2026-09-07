import { NextResponse } from "next/server";
import { generateOtp, saveOtp } from "@/lib/otpStore";
import { sendOtpEmail } from "@/lib/mailer";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(req) {
  let body;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }

  const email = String(body?.email || "").trim().toLowerCase();
  const name = String(body?.name || "").trim();

  if (!EMAIL_RE.test(email)) {
    return NextResponse.json(
      { error: "Enter a valid email address first." },
      { status: 400 }
    );
  }

  const code = generateOtp();

  try {
    const result = await sendOtpEmail({ to: email, name, code });

 
    if (result.devMode) {
      console.log(`[OTP not delivered — SMTP not configured] email code for ${email}: ${code}`);
      return NextResponse.json(
        {
          error:
            "Email verification isn't set up yet — the site owner needs to add SMTP credentials (SMTP_HOST / SMTP_USER / SMTP_PASS) to .env.local before real codes can be sent.",
        },
        { status: 503 }
      );
    }

    saveOtp(`email:${email}`, code);
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("Failed to send OTP email:", err);
    return NextResponse.json(
      { error: "Could not send the verification email. Please try again." },
      { status: 500 }
    );
  }
}
