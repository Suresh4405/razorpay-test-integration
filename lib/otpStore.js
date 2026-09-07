

const OTP_TTL_MS = 5 * 60 * 1000; 
const MAX_ATTEMPTS = 5;

const store = globalThis.__otpStore || new Map();
globalThis.__otpStore = store;

export function generateOtp() {
  return String(Math.floor(100000 + Math.random() * 900000));
}

export function saveOtp(key, code) {
  store.set(key, {
    code,
    expiresAt: Date.now() + OTP_TTL_MS,
    attempts: 0,
  });
}


export function consumeOtp(key, submittedCode) {
  const entry = store.get(key);
  if (!entry) return { ok: false, reason: "not_found" };

  if (Date.now() > entry.expiresAt) {
    store.delete(key);
    return { ok: false, reason: "expired" };
  }

  if (entry.attempts >= MAX_ATTEMPTS) {
    store.delete(key);
    return { ok: false, reason: "too_many_attempts" };
  }

  if (entry.code !== String(submittedCode).trim()) {
    entry.attempts += 1;
    return { ok: false, reason: "mismatch" };
  }

  store.delete(key);
  return { ok: true };
}
