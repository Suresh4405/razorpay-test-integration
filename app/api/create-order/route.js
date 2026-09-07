import { NextResponse } from "next/server";
import Razorpay from "razorpay";
import { verifyVerificationToken } from "@/lib/verificationToken";

export async function POST(req) {
  let body;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }

  const {
    amount,
    currency = "INR",
    email,
    phone,
    emailToken,
    phoneToken,
  } = body || {};

  if (!amount || isNaN(Number(amount)) || Number(amount) <= 0) {
    return NextResponse.json(
      { error: "A valid amount is required." },
      { status: 400 }
    );
  }

  if (!email) {
    return NextResponse.json(
      { error: "Email is required." },
      { status: 400 }
    );
  }

  
  const emailOk = verifyVerificationToken(emailToken, "email", email);

  if (!emailOk) {
    return NextResponse.json(
      { error: "Please verify your email with OTP before paying." },
      { status: 403 }
    );
  }

  const keyId = process.env.RAZORPAY_KEY_ID;
  const keySecret = process.env.RAZORPAY_KEY_SECRET;

  if (!keyId || !keySecret) {
    console.error(
      "Missing Razorpay credentials — set RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET in .env.local"
    );
    return NextResponse.json(
      {
        error:
          "Server misconfiguration: Razorpay test-mode keys are not set. Contact the site administrator.",
      },
      { status: 500 }
    );
  }

  try {
    const razorpay = new Razorpay({ key_id: keyId, key_secret: keySecret });

    const order = await razorpay.orders.create({
      amount: Math.round(Number(amount) * 100), // rupees -> paise
      currency,
      receipt: `order_${Date.now()}`,
    });

    return NextResponse.json(order);
  } catch (err) {
    const description = err?.error?.description;
    const msg =
      (typeof description === "string" && description) ||
      err?.message ||
      (() => {
        try {
          return JSON.stringify(err);
        } catch {
          return String(err);
        }
      })();
    console.error("Razorpay order creation failed:", msg);
    return NextResponse.json(
      { error: `Could not create Razorpay order: ${msg}` },
      { status: 500 }
    );
  }
}
