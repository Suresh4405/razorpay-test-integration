"use client";

import Link from "next/link";
import { Minus, Plus, Trash2, ShoppingBag } from "lucide-react";
import { useCart } from "@/context/CartContext";
import BookCover from "@/components/BookCover";

const INR = (n) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(n);

export default function CartPage() {
  const { items, updateQty, removeFromCart, subtotal, hydrated } = useCart();

  if (hydrated && items.length === 0) {
    return (
      <section className="mx-auto max-w-xl px-4 py-24 text-center sm:px-6">
        <ShoppingBag className="mx-auto h-10 w-10 text-stone" strokeWidth={1.5} />
        <h1 className="mt-4 font-display text-2xl text-ink">
          Your cart is empty
        </h1>
        <p className="mt-2 text-sm text-stone">
          Pick something up from one of the shelves.
        </p>
        <Link
          href="/"
          className="mt-6 inline-block rounded-md bg-ink px-5 py-2.5 text-sm font-medium text-paper hover:bg-ink-light"
        >
          Browse books
        </Link>
      </section>
    );
  }

  return (
    <section className="mx-auto max-w-4xl px-4 py-10 sm:px-6">
      <h1 className="font-display text-3xl text-ink">Your cart</h1>

      <div className="mt-8 grid gap-10 lg:grid-cols-[1fr,320px]">
        <ul className="divide-y divide-ink/10 border-y border-ink/10">
          {items.map((item) => (
            <li key={item.id} className="flex gap-4 py-5">
              <div className="relative h-24 w-16 shrink-0 overflow-hidden rounded-[3px]">
                               <BookCover book={item} sizes="64px" />
              </div>

              <div className="flex flex-1 flex-col justify-between">
                <div>
                  <p className="font-display text-[15px] leading-snug text-ink">
                    {item.title}
                  </p>
                  <p className="mt-0.5 text-[13px] text-stone">{item.author}</p>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1 rounded-md border border-ink/15">
                    <button
                      type="button"
                      onClick={() => updateQty(item.id, item.qty - 1)}
                      className="flex h-7 w-7 items-center justify-center text-ink hover:bg-ink/5"
                      aria-label={`Decrease quantity of ${item.title}`}
                    >
                      <Minus className="h-3.5 w-3.5" />
                    </button>
                    <span className="w-6 text-center text-sm">{item.qty}</span>
                    <button
                      type="button"
                      onClick={() => updateQty(item.id, item.qty + 1)}
                      className="flex h-7 w-7 items-center justify-center text-ink hover:bg-ink/5"
                      aria-label={`Increase quantity of ${item.title}`}
                    >
                      <Plus className="h-3.5 w-3.5" />
                    </button>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="text-sm font-medium text-ink">
                      {INR(item.price * item.qty)}
                    </span>
                    <button
                      type="button"
                      onClick={() => removeFromCart(item.id)}
                      className="text-stone hover:text-oxblood"
                      aria-label={`Remove ${item.title} from cart`}
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            </li>
          ))}
        </ul>

        <div className="h-fit rounded-lg border border-ink/10 bg-paper2 p-5">
          <h2 className="text-sm font-semibold text-ink">Order summary</h2>
          <div className="mt-4 flex justify-between text-sm text-stone">
            <span>Subtotal</span>
            <span className="text-ink">{INR(subtotal)}</span>
          </div>
          <div className="mt-1 flex justify-between text-sm text-stone">
            <span>Shipping</span>
            <span className="text-ink">Free</span>
          </div>
          <div className="mt-3 flex justify-between border-t border-ink/10 pt-3 text-[15px] font-semibold text-ink">
            <span>Total</span>
            <span>{INR(subtotal)}</span>
          </div>
          <Link
            href="/checkout"
            className="mt-5 block w-full rounded-md bg-ink px-4 py-2.5 text-center text-sm font-medium text-paper hover:bg-ink-light"
          >
            Proceed to checkout
          </Link>
        </div>
      </div>
    </section>
  );
}
