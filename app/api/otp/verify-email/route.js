import { NextResponse } from "next/server";
import { consumeOtp } from "@/lib/otpStore";
import { issueVerificationToken } from "@/lib/verificationToken";

const REASON_MESSAGES = {
  not_found: "Send a new code — this one has expired or was never sent.",
  expired: "That code has expired. Send a new one.",
  too_many_attempts: "Too many incorrect attempts. Send a new code.",
  mismatch: "That code doesn't match. Check it and try again.",
};

export async function POST(req) {
  let body;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }

  const email = String(body?.email || "").trim().toLowerCase();
  const code = String(body?.code || "").trim();

  if (!email || !code) {
    return NextResponse.json(
      { error: "Email and code are required." },
      { status: 400 }
    );
  }

  const result = consumeOtp(`email:${email}`, code);
  if (!result.ok) {
    return NextResponse.json(
      { error: REASON_MESSAGES[result.reason] || "Verification failed." },
      { status: 400 }
    );
  }

  const token = issueVerificationToken("email", email);
  return NextResponse.json({ ok: true, token });
}
