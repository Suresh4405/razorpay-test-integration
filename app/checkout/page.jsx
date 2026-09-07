"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import BookCover from "@/components/BookCover";
import { ShoppingBag, ShieldCheck, CheckCircle2, Loader2 } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { COUNTRIES } from "@/lib/countries";
import { DIAL_CODES, DEFAULT_DIAL_CODE } from "@/lib/dialCodes";
import { payWithRazorpay } from "@/lib/razorpayClient";
import OtpInput from "@/components/OtpInput";

const INR = (n) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(n);

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_RE = /^\+[1-9]\d{7,14}$/;

const initialOtpState = {
  sent: false,
  code: "",
  verified: false,
  token: null,
  sending: false,
  verifying: false,
  error: "",
  cooldown: 0,
};

export default function CheckoutPage() {
  const { items, subtotal, hydrated, clearCart } = useCart();
  const router = useRouter();

  const [form, setForm] = useState({
    name: "",
    email: "",
    dialCode: DEFAULT_DIAL_CODE,
    phoneNumber: "",
    address: "",
    city: "",
    pincode: "",
    country: "India",
  });
  const [errors, setErrors] = useState({});
  const [otp, setOtp] = useState({ email: initialOtpState });
    const [paying, setPaying] = useState(false);
  const [payError, setPayError] = useState("");

  const intervalRef = useRef(null);

  // The full E.164-ish number OTP send/verify and Razorpay actually use.
  const fullPhone = `${form.dialCode}${form.phoneNumber.replace(/\D/g, "")}`;

  // Tick down resend cooldowns once a second.
  useEffect(() => {
    intervalRef.current = setInterval(() => {
      setOtp((prev) => ({
        email: { ...prev.email, cooldown: Math.max(0, prev.email.cooldown - 1) },
      }));
    }, 1000);
    return () => clearInterval(intervalRef.current);
  }, []);

  if (hydrated && items.length === 0) {
    return (
      <section className="mx-auto max-w-xl px-4 py-24 text-center sm:px-6">
        <ShoppingBag className="mx-auto h-10 w-10 text-stone" strokeWidth={1.5} />
        <h1 className="mt-4 font-display text-2xl text-ink">
          There's nothing to check out yet
        </h1>
        <p className="mt-2 text-sm text-stone">
          Add a book to your cart first.
        </p>
      </section>
    );
  }

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
    if (errors[name]) setErrors((er) => ({ ...er, [name]: undefined }));

    // Editing a verified email resets its verification.
    if (name === "email" && otp.email.verified) {
      setOtp((o) => ({ ...o, email: initialOtpState }));
    }
  };

  const handlePhoneNumberChange = (e) => {
    const digits = e.target.value.replace(/\D/g, "");
    setForm((f) => ({ ...f, phoneNumber: digits }));
    if (errors.phone) setErrors((er) => ({ ...er, phone: undefined }));
  };

  const handleDialCodeChange = (e) => {
    setForm((f) => ({ ...f, dialCode: e.target.value }));
  };

  const validate = () => {
    const errs = {};
    if (!form.name.trim()) errs.name = "Full name is required.";
    if (!EMAIL_RE.test(form.email)) errs.email = "Enter a valid email address.";
    if (!PHONE_RE.test(fullPhone))
      errs.phone = "Choose a country code and enter a valid phone number.";
    if (!form.address.trim()) errs.address = "Address is required.";
    if (!form.city.trim()) errs.city = "City is required.";
    if (!form.pincode.trim()) errs.pincode = "Postal / ZIP code is required.";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const sendOtp = async (type) => {
    const value = type === "email" ? form.email : fullPhone;
    const isValid = type === "email" ? EMAIL_RE.test(value) : PHONE_RE.test(value);

    if (!isValid) {
      setErrors((er) => ({
        ...er,
        [type]:
          type === "email"
            ? "Enter a valid email address first."
            : "Choose a country code and enter a valid phone number first.",
      }));
      return;
    }

    setOtp((o) => ({ ...o, [type]: { ...o[type], sending: true, error: "" } }));

    try {
      const res = await fetch(`/api/otp/send-${type}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(
          type === "email" ? { email: value, name: form.name } : { phone: value }
        ),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || "Could not send code.");

      setOtp((o) => ({
        ...o,
        [type]: { ...initialOtpState, sent: true, cooldown: 30 },
      }));
    } catch (err) {
      setOtp((o) => ({
        ...o,
        [type]: { ...o[type], sending: false, error: err.message },
      }));
    }
  };

  const verifyOtp = async (type) => {
    const value = type === "email" ? form.email : fullPhone;
    const code = otp[type].code;

    if (!code || code.length < 6) {
      setOtp((o) => ({
        ...o,
        [type]: { ...o[type], error: "Enter all 6 digits of the code you received." },
      }));
      return;
    }

    setOtp((o) => ({ ...o, [type]: { ...o[type], verifying: true, error: "" } }));

    try {
      const res = await fetch(`/api/otp/verify-${type}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(
          type === "email" ? { email: value, code } : { phone: value, code }
        ),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || "Verification failed.");

      setOtp((o) => ({
        ...o,
        [type]: { ...o[type], verifying: false, verified: true, token: data.token },
      }));
    } catch (err) {
      setOtp((o) => ({
        ...o,
        [type]: { ...o[type], verifying: false, error: err.message },
      }));
    }
  };

  const emailVerified = otp.email.verified;
    const detailsStarted =
    form.name.trim() || form.email.trim() || form.phoneNumber.trim() || form.address.trim();
  const step = emailVerified ? 3 : detailsStarted ? 2 : 1;

  const handlePay = async () => {
    setPayError("");
    if (!validate()) return;
     if (!emailVerified) {
      setPayError("Verify your email with OTP before paying.");
      return;
    }
    setPaying(true);
    try {
           await payWithRazorpay({
        amount: subtotal,
        currency: "INR",
        email: form.email,
        phone: fullPhone,
        emailToken: otp.email.token,
        prefill: { name: form.name, email: form.email, contact: fullPhone },
        description: `${items.length} book${items.length === 1 ? "" : "s"} from QuickPayBooks`,
      });

      // Success — stash a small order summary for the confirmation page.
      const summary = {
        name: form.name,
        email: form.email,
        total: subtotal,
        itemCount: items.reduce((s, i) => s + i.qty, 0),
        placedAt: new Date().toISOString(),
      };
      window.sessionStorage.setItem("QuickPayBooks_last_order", JSON.stringify(summary));
      clearCart();
      router.push("/order-success");
    } catch (err) {
      setPayError(err.message || "Payment could not be completed.");
    } finally {
      setPaying(false);
    }
  };

  return (
    <section className="mx-auto max-w-4xl px-4 py-10 sm:px-6">
      <h1 className="font-display text-3xl text-ink">Checkout</h1>
      <p className="mt-1 text-sm text-stone">
        Verify your email and phone with a real one-time code, then pay
        securely with Razorpay (test mode — no real charge).
      </p>

      <ol className="mt-6 flex items-center gap-3 text-xs font-medium text-stone sm:text-sm">
        {["Your details", "Verify email & phone", "Pay"].map((label, i) => {
          const n = i + 1;
          const state = n < step ? "done" : n === step ? "active" : "todo";
          return (
            <li key={label} className="flex items-center gap-3">
              <span className="flex items-center gap-2">
                <span
                  className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-[11px] ${
                    state === "done"
                      ? "bg-ink text-paper"
                      : state === "active"
                      ? "bg-brass text-ink"
                      : "bg-ink/10 text-stone"
                  }`}
                >
                  {state === "done" ? "✓" : n}
                </span>
                <span className={state === "todo" ? "hidden sm:inline" : "inline"}>
                  {label}
                </span>
              </span>
              {n < 3 && <span className="h-px w-6 bg-ink/15 sm:w-10" />}
            </li>
          );
        })}
      </ol>

      <div className="mt-8 grid gap-10 lg:grid-cols-[1fr,320px]">
        <div className="space-y-6">
          <fieldset className="space-y-5 rounded-lg border border-ink/10 p-5">
            <legend className="px-1 text-sm font-semibold text-ink">
              Contact details
            </legend>

            <Field
              label="Full name"
              name="name"
              value={form.name}
              onChange={handleChange}
              error={errors.name}
              autoComplete="name"
            />

            <VerifiableField
              type="email"
              label="Email address"
              inputSlot={
                <input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="you@example.com"
                  value={form.email}
                  onChange={handleChange}
                  readOnly={otp.email.verified}
                  autoComplete="email"
                  className={`block w-full rounded-md border px-3 py-2 text-sm shadow-sm focus:border-brass ${
                    otp.email.verified
                      ? "border-green-600/30 bg-green-50 text-ink"
                      : "border-ink/20 bg-paper text-ink"
                  }`}
                />
              }
              error={errors.email}
              otpState={otp.email}
              setOtp={setOtp}
              onSend={() => sendOtp("email")}
              onVerify={() => verifyOtp("email")}
              deliveryHint={`We'll email a 6-digit code to ${form.email || "this address"}.`}
            />

                      <div>
              <label htmlFor="phone" className="block text-sm font-medium text-ink">
                Phone number <span className="text-oxblood">*</span>
              </label>
              <div className="mt-1 flex gap-2">
                <select
                  aria-label="Country code"
                  value={form.dialCode}
                  onChange={handleDialCodeChange}
                  className="w-[104px] shrink-0 rounded-md border border-ink/20 bg-paper px-2 py-2 text-sm text-ink shadow-sm focus:border-brass"
                >
                  {DIAL_CODES.map((c) => (
                    <option key={c.iso} value={c.dial}>
                      {c.dial} {c.iso}
                    </option>
                  ))}
                </select>
                <input
                  id="phone"
                  name="phoneNumber"
                  type="tel"
                  inputMode="numeric"
                  placeholder="98765 43210"
                  value={form.phoneNumber}
                  onChange={handlePhoneNumberChange}
                  autoComplete="tel-national"
                  className="block w-full rounded-md border border-ink/20 bg-paper px-3 py-2 text-sm text-ink shadow-sm focus:border-brass"
                />
              </div>
              {errors.phone && <p className="mt-1 text-xs text-oxblood">{errors.phone}</p>}
            </div>
          </fieldset>

          <fieldset className="space-y-4 rounded-lg border border-ink/10 p-5">
            <legend className="px-1 text-sm font-semibold text-ink">
              Shipping address
            </legend>

            <Field
              label="Address"
              name="address"
              value={form.address}
              onChange={handleChange}
              error={errors.address}
              autoComplete="street-address"
            />

            <div className="grid grid-cols-2 gap-4">
              <Field
                label="City"
                name="city"
                value={form.city}
                onChange={handleChange}
                error={errors.city}
                autoComplete="address-level2"
              />
              <Field
                label="Postal / ZIP code"
                name="pincode"
                value={form.pincode}
                onChange={handleChange}
                error={errors.pincode}
                autoComplete="postal-code"
              />
            </div>

            <div>
              <label htmlFor="country" className="block text-sm font-medium text-ink">
                Country
              </label>
              <select
                id="country"
                name="country"
                value={form.country}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border border-ink/20 bg-paper px-3 py-2 text-sm text-ink shadow-sm focus:border-brass"
              >
                {COUNTRIES.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>
          </fieldset>

          <p className="flex items-center gap-2 text-xs text-stone">
            <ShieldCheck className="h-4 w-4 text-brass-dark" />
            Card details are entered on Razorpay's own secure screen — this
            site never sees or stores your card number.
          </p>
        </div>

        <div className="h-fit space-y-4">
          <div className="rounded-lg border border-ink/10 bg-paper2 p-5">
            <h2 className="text-sm font-semibold text-ink">Order summary</h2>
            <ul className="mt-3 space-y-3">
              {items.map((item) => (
                <li key={item.id} className="flex items-center gap-3">
                                 <div className="relative h-12 w-9 shrink-0 overflow-hidden rounded-[3px]">
                    <BookCover book={item} sizes="36px" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-[13px] text-ink">{item.title}</p>
                    <p className="text-[12px] text-stone">Qty {item.qty}</p>
                  </div>
                  <span className="shrink-0 text-[13px] text-ink">
                    {INR(item.price * item.qty)}
                  </span>
                </li>
              ))}
            </ul>
            <div className="mt-4 flex justify-between border-t border-ink/10 pt-3 text-[15px] font-semibold text-ink">
              <span>Total</span>
              <span>{INR(subtotal)}</span>
            </div>
          </div>

          <button
            type="button"
            onClick={handlePay}
            disabled={paying}
            className="flex w-full items-center justify-center gap-2 rounded-md bg-ink px-4 py-3 text-sm font-medium text-paper transition-colors hover:bg-ink-light disabled:cursor-not-allowed disabled:opacity-60"
          >
            {paying ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" /> Processing...
              </>
            ) : (
              <>Pay {INR(subtotal)} with Razorpay</>
            )}
          </button>

                   {!emailVerified && (
            <p className="text-center text-xs text-stone">
              Verify your email above to enable payment.
            </p>
          )}

          {payError && (
            <p className="rounded-md border border-oxblood/25 bg-oxblood/5 px-3 py-2 text-xs text-oxblood">
              {payError}
            </p>
          )}

          {/* <p className="text-center text-[11px] text-stone">
            Test gateway — use card{" "}
            <span className="font-mono">4111 1111 1111 1111</span>, any
            future expiry, any CVV.
          </p> */}
        </div>
      </div>
    </section>
  );
}

function Field({ label, name, value, onChange, error, autoComplete, ...rest }) {
  return (
    <div>
      <label htmlFor={name} className="block text-sm font-medium text-ink">
        {label} <span className="text-oxblood">*</span>
      </label>
      <input
        id={name}
        name={name}
        value={value}
        onChange={onChange}
        autoComplete={autoComplete}
        className="mt-1 block w-full rounded-md border border-ink/20 bg-paper px-3 py-2 text-sm text-ink shadow-sm focus:border-brass"
        {...rest}
      />
      {error && <p className="mt-1 text-xs text-oxblood">{error}</p>}
    </div>
  );
}

function VerifiableField({
  label,
  type,
  inputSlot,
  error,
  otpState,
  setOtp,
  onSend,
  onVerify,
  deliveryHint,
}) {
  return (
    <div>
      <label htmlFor={type} className="block text-sm font-medium text-ink">
        {label} <span className="text-oxblood">*</span>
      </label>

      <div className="mt-1 flex gap-2">
        {inputSlot}

        {otpState.verified ? (
          <span className="flex shrink-0 items-center gap-1 rounded-md bg-green-600/10 px-3 text-xs font-medium text-green-700">
            <CheckCircle2 className="h-4 w-4" /> Verified
          </span>
        ) : (
          <button
            type="button"
            onClick={onSend}
            disabled={otpState.sending || otpState.cooldown > 0}
            className="shrink-0 rounded-md border border-ink/20 px-3 py-2 text-xs font-medium text-ink hover:bg-ink/5 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {otpState.sending
              ? "Sending..."
              : otpState.cooldown > 0
              ? `Resend (${otpState.cooldown}s)`
              : otpState.sent
              ? "Resend code"
              : "Send code"}
          </button>
        )}
      </div>
      {error && <p className="mt-1 text-xs text-oxblood">{error}</p>}

      {otpState.sent && !otpState.verified && (
        <div className="mt-3 rounded-md border border-brass/25 bg-brass/5 p-3">
          <p className="text-xs text-stone">{deliveryHint}</p>
          <div className="mt-2 flex flex-wrap items-center gap-2">
            <OtpInput
              value={otpState.code}
              onChange={(code) =>
                setOtp((o) => ({ ...o, [type]: { ...o[type], code } }))
              }
            />
            <button
              type="button"
              onClick={onVerify}
              disabled={otpState.verifying}
              className="rounded-md bg-brass px-4 py-2 text-xs font-medium text-ink hover:bg-brass-light disabled:cursor-not-allowed disabled:opacity-60"
            >
              {otpState.verifying ? "Checking..." : "Confirm code"}
            </button>
          </div>
        </div>
      )}
      {otpState.error && (
        <p className="mt-1 text-xs text-oxblood">{otpState.error}</p>
      )}
    </div>
  );
}
