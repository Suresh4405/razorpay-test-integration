"use client";

import Link from "next/link";
import { useState } from "react";
import { usePathname } from "next/navigation";
import { Menu, X, ShoppingBag, BookOpen } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { CATEGORIES } from "@/data/books";

export default function Header() {
  const [open, setOpen] = useState(false);
  const { count } = useCart();
  const pathname = usePathname();

  const navLink = (href, label, key) => {
    const active = pathname === href;
    return (
      <Link
        key={key}
        href={href}
        onClick={() => setOpen(false)}
        className={`block py-2 text-[15px] transition-colors md:py-0 ${
          active
            ? "text-brass-dark font-medium"
            : "text-ink-soft hover:text-ink"
        }`}
      >
        {label}
      </Link>
    );
  };

  return (
    <header className="sticky top-0 z-40 border-b border-ink/10 bg-paper/95 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
        <Link href="/" className="flex items-center gap-2" onClick={() => setOpen(false)}>
          <BookOpen className="h-6 w-6 text-brass-dark" strokeWidth={1.75} />
          <span className="font-display text-xl tracking-tight text-ink">
           QuickPayBooks
          </span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden items-center gap-7 md:flex">
          {CATEGORIES.map((c) => navLink(`/category/${c.slug}`, c.label, c.slug))}
        </nav>

        <div className="flex items-center gap-2">
          <Link
            href="/cart"
            className="relative flex h-10 w-10 items-center justify-center rounded-full text-ink transition-colors hover:bg-ink/5"
            aria-label={`Cart, ${count} item${count === 1 ? "" : "s"}`}
          >
            <ShoppingBag className="h-5 w-5" strokeWidth={1.75} />
            {count > 0 && (
              <span className="absolute -right-0.5 -top-0.5 flex h-[18px] min-w-[18px] items-center justify-center rounded-full bg-oxblood px-1 text-[10px] font-semibold leading-none text-paper">
                {count}
              </span>
            )}
          </Link>

          <button
            type="button"
            className="flex h-10 w-10 items-center justify-center rounded-full text-ink hover:bg-ink/5 md:hidden"
            onClick={() => setOpen((v) => !v)}
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Mobile nav */}
      {open && (
        <nav className="border-t border-ink/10 bg-paper px-4 pb-4 pt-1 md:hidden sm:px-6">
          {CATEGORIES.map((c) => navLink(`/category/${c.slug}`, c.label, `m-${c.slug}`))}
        </nav>
      )}
    </header>
  );
}
