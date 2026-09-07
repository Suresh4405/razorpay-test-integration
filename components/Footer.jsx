import Link from "next/link";
import { CATEGORIES } from "@/data/books";

export default function Footer() {
  return (
    <footer className="mt-20 border-t border-ink/10 bg-paper2">
      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
        <div className="grid gap-10 sm:grid-cols-3">
          <div>
            <p className="font-display text-lg text-ink">QuickPayBooks</p>
            <p className="mt-2 max-w-xs text-sm leading-relaxed text-stone">
              A small shelf of good books, sorted honestly and shipped
              carefully. This is a demo storefront running Razorpay in test
              mode — no real payments are taken.
            </p>
          </div>

          <div>
            <p className="text-sm font-medium text-ink">Browse</p>
            <ul className="mt-3 space-y-2 text-sm text-stone">
              {CATEGORIES.map((c) => (
                <li key={c.slug}>
                  <Link href={`/category/${c.slug}`} className="hover:text-ink">
                    {c.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="text-sm font-medium text-ink">Your order</p>
            <ul className="mt-3 space-y-2 text-sm text-stone">
              <li>
                <Link href="/cart" className="hover:text-ink">
                  Cart
                </Link>
              </li>
              <li>
                <Link href="/checkout" className="hover:text-ink">
                  Checkout
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <p className="mt-10 border-t border-ink/10 pt-6 text-xs text-stone">
          © {new Date().getFullYear()} QuickPayBooks. Demo project — test
          mode only.
        </p>
      </div>
    </footer>
  );
}
