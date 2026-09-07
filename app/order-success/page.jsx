"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { CheckCircle2 } from "lucide-react";

const INR = (n) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(n);

function orderNumber(placedAt) {
  const t = placedAt ? new Date(placedAt).getTime() : Date.now();
  return `INK-${String(t).slice(-8)}`;
}

export default function OrderSuccessPage() {
  const [order, setOrder] = useState(null);

  useEffect(() => {
    try {
      const raw = window.sessionStorage.getItem("QuickPayBooks_last_order");
      if (raw) setOrder(JSON.parse(raw));
    } catch {
    }
  }, []);

  return (
    <section className="mx-auto max-w-lg px-4 py-20 text-center sm:px-6">
      <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-green-600/10">
        <CheckCircle2 className="h-9 w-9 text-green-600" />
      </div>
      <h1 className="mt-5 font-display text-3xl text-ink">Order placed</h1>
      <p className="mt-2 text-sm text-stone">
        {order
          ? `Thanks${order.name ? `, ${order.name}` : ""} — your test-mode payment went through.`
          : "Your payment went through."}
      </p>

      {order && (
        <div className="mt-8 rounded-lg border border-ink/10 bg-paper2 p-5 text-left">
          <div className="flex items-center justify-between border-b border-ink/10 pb-3">
            <span className="text-xs font-medium uppercase tracking-wide text-stone">
              Order number
            </span>
            <span className="font-mono text-sm text-ink">
              {orderNumber(order.placedAt)}
            </span>
          </div>
          <dl className="mt-3 space-y-2 text-sm">
            <div className="flex justify-between">
              <dt className="text-stone">Items</dt>
              <dd className="text-ink">
                {order.itemCount} book{order.itemCount === 1 ? "" : "s"}
              </dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-stone">Total paid</dt>
              <dd className="font-semibold text-ink">{INR(order.total)}</dd>
            </div>
            {order.email && (
              <div className="flex justify-between gap-4">
                <dt className="text-stone">Sent to</dt>
                <dd className="truncate text-ink">{order.email}</dd>
              </div>
            )}
          </dl>
        </div>
      )}

      {order?.email && (
        <p className="mt-4 text-xs text-stone">
          A confirmation would normally be sent to {order.email}.
        </p>
      )}
      <Link
        href="/"
        className="mt-8 inline-block rounded-md bg-ink px-5 py-2.5 text-sm font-medium text-paper hover:bg-ink-light"
      >
        Continue browsing
      </Link>
    </section>
  );
}
