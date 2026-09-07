

let scriptPromise = null;

export function loadRazorpayScript() {
  if (scriptPromise) return scriptPromise;

  scriptPromise = new Promise((resolve) => {
    if (typeof window === "undefined") return resolve(false);
    if (window.Razorpay) return resolve(true);

    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    script.onload = () => resolve(true);
    script.onerror = () => {
      scriptPromise = null;
      resolve(false);
    };
    document.head.appendChild(script);
  });

  return scriptPromise;
}

async function createOrder({ amount, currency, email, phone, emailToken, phoneToken }) {
  const res = await fetch("/api/create-order", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ amount, currency, email, phone, emailToken, phoneToken }),
  });

  const raw = await res.text().catch(() => "");
  let data;
  try {
    data = JSON.parse(raw);
  } catch {
    throw new Error(`Unexpected response from server: ${raw.slice(0, 200)}`);
  }

  if (!res.ok) {
    throw new Error(data?.error || `HTTP ${res.status}`);
  }
  if (!data?.id) {
    throw new Error("Razorpay order creation returned no order id.");
  }
  return data;
}


export async function payWithRazorpay({
  amount,
  currency = "INR",
  email,
  phone,
  emailToken,
  phoneToken,
  prefill = {},
  name = "QuickPayBooks",
  description = "Book order",
}) {
  const loaded = await loadRazorpayScript();
  if (!loaded) {
    throw new Error(
      "Razorpay checkout could not be loaded. Check your internet connection."
    );
  }

  const order = await createOrder({ amount, currency, email, phone, emailToken, phoneToken });

  const keyId = process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID;
  if (!keyId) {
    throw new Error(
      "Razorpay key is not configured. Add NEXT_PUBLIC_RAZORPAY_KEY_ID to .env.local and restart the dev server."
    );
  }

  return new Promise((resolve, reject) => {
    const options = {
      key: keyId,
      amount: order.amount,
      currency: order.currency,
      name,
      description,
      order_id: order.id,
      prefill,
      theme: { color: "#B8862F" },
      handler: async (response) => {
        try {
          const verifyRes = await fetch("/api/verify-payment", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(response),
          });
          const verifyData = await verifyRes.json();
          if (verifyData.verified) {
            resolve(response);
          } else {
            reject(new Error("Payment could not be verified. Please contact support."));
          }
        } catch (err) {
          reject(err);
        }
      },
      modal: {
        confirm_close: true,
        ondismiss: () => reject(new Error("Payment window closed before completing.")),
      },
    };

    const rzp = new window.Razorpay(options);
    rzp.on("payment.failed", (response) => {
      reject(
        new Error(
          response?.error?.description || response?.error?.reason || "Payment failed."
        )
      );
    });
    rzp.open();
  });
}
