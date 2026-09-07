# Razorpay test api Integration 

A small online bookstore built with Next.js to demonstrate a complete, production-style Razorpay checkout — real order creation, OTP-verified customers, and cryptographically verified payments, all running safely in test mode.

**Live demo:** [razorpay-testapi-integration.vercel.app](https://razorpay-testapi-integration.vercel.app/)

**Repository:** [github.com/Suresh4405/razorpay-test-integration](https://github.com/Suresh4405/razorpay-test-integration)

---

## Overview

Most Razorpay demos stop at "create an order, open the checkout modal." This project goes further and handles payments the way a real product would have to:

- A customer can't pay until their email is verified with a one-time code
- Orders are created server-side, with the amount fixed by the server — never trusted from the client
- Every completed payment is verified with an HMAC-SHA256 signature check before it's accepted
- Verification state travels as a signed, short-lived token, not a plain boolean in the request body

It's built around a small real product rather than a bare form: a bookstore with four curated shelves — Fiction, Science, Story & Folktale, and Mystery & Thriller — ten titles each.

---

## Features

- **Curated catalogue** — four categories, ten books each, with cover art, ratings, and blurbs
- **Persistent cart** — client-side cart state backed by `localStorage`, survives page refreshes
- **Email OTP verification** — a six-digit code is emailed via SMTP and must be confirmed before checkout unlocks payment
- **Signed verification tokens** — once an OTP is confirmed, the server issues a short-lived signed token; order creation rejects any request without a valid one
- **Server-side order creation** — the Razorpay order is created on the server with a server-trusted amount, then the Razorpay Checkout modal opens on the client
- **Payment signature verification** — the signature Razorpay returns after payment is independently recomputed and checked with HMAC-SHA256
- **Order confirmation page** — a clean success screen after a verified payment

---

## Tech stack

| Layer | Technology |
|---|---|
| Framework | Next.js 14 (App Router) |
| UI | React 18, Tailwind CSS, lucide-react |
| Payments | Razorpay Orders API + Checkout.js (test mode) |
| Email OTP | Nodemailer (SMTP) |
| Security | Node `crypto` — HMAC-SHA256 signature and token verification |
| State | React Context (cart), in-memory OTP store |
| Deployment | Vercel |

---

## How the checkout flow works

1. Customer fills in shipping details on `/checkout`
2. Customer requests an email OTP → `POST /api/otp/send-email`
3. Customer enters the code → `POST /api/otp/verify-email`, which returns a signed, short-lived verification token
4. Customer clicks Pay → `POST /api/create-order`, which re-checks the verification token and creates the Razorpay order with a server-trusted amount
5. The Razorpay Checkout modal opens with that order ID
6. On success, Razorpay returns a payment ID, order ID, and signature
7. The client sends these to `POST /api/verify-payment`, which recomputes the HMAC signature and compares it
8. Only a matching signature is treated as a successful payment

Nothing about "this order is paid" is ever trusted from the browser — it's independently verified on the server at every step.

---

## Project structure

```
app/
├── api/
│   ├── create-order/route.js       Server-side Razorpay order creation
│   ├── verify-payment/route.js     HMAC signature verification
│   └── otp/
│       ├── send-email/route.js     Generates and emails the OTP
│       └── verify-email/route.js   Verifies the OTP, issues a signed token
├── cart/page.jsx                   Cart view
├── checkout/page.jsx               Shipping form, OTP, and payment
├── order-success/                  Post-payment confirmation
├── category/[slug]/                Shelf pages per category
└── page.jsx                        Homepage

components/     BookCard, BookCover, Header, Footer, ShelfRow, OtpInput, TrustStrip
context/        CartContext — localStorage-backed cart state
data/books.js   Book catalogue and categories
lib/
├── razorpayClient.js       Loads Checkout.js, orchestrates client-side payment
├── mailer.js                Nodemailer transport and OTP email template
├── otpStore.js              OTP generation, storage, attempt limiting
├── verificationToken.js     Signed token issue/verify
├── countries.js             Country list for the shipping form
└── dialCodes.js             Phone dial-code list
```
