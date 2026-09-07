

import crypto from "crypto";

const SECRET =
  process.env.OTP_TOKEN_SECRET || "dev-only-insecure-secret-change-me";

const TOKEN_TTL_MS = 15 * 60 * 1000; 

export function issueVerificationToken(type, value) {
  const payload = `${type}:${value.trim().toLowerCase()}:${Date.now()}`;
  const payloadB64 = Buffer.from(payload, "utf8").toString("base64url");
  const signature = crypto
    .createHmac("sha256", SECRET)
    .update(payloadB64)
    .digest("base64url");
  return `${payloadB64}.${signature}`;
}

export function verifyVerificationToken(token, type, expectedValue) {
  if (!token || typeof token !== "string" || !token.includes(".")) {
    return false;
  }
  const [payloadB64, signature] = token.split(".");
  const expectedSig = crypto
    .createHmac("sha256", SECRET)
    .update(payloadB64)
    .digest("base64url");

  const sigOk =
    signature.length === expectedSig.length &&
    crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expectedSig));
  if (!sigOk) return false;

  const payload = Buffer.from(payloadB64, "base64url").toString("utf8");
  const [tokenType, tokenValue, tokenTimeStr] = payload.split(":");
  const tokenTime = Number(tokenTimeStr);

  if (tokenType !== type) return false;
  if (tokenValue !== expectedValue.trim().toLowerCase()) return false;
  if (!tokenTime || Date.now() - tokenTime > TOKEN_TTL_MS) return false;

  return true;
}
