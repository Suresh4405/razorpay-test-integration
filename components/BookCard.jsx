"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Star, Check } from "lucide-react";
import { useCart } from "@/context/CartContext";
import BookCover from "./BookCover";

const INR = (n) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(n);

export default function BookCard({ book }) {
  const { addToCart } = useCart();
  const router = useRouter();
  const [added, setAdded] = useState(false);

  const handleAdd = () => {
    addToCart(book, 1);
    setAdded(true);
    setTimeout(() => setAdded(false), 1400);
  };

  const handleBuyNow = () => {
    addToCart(book, 1);
    router.push("/checkout");
  };

  const discount = Math.round(100 - (book.price / book.mrp) * 100);

  return (
    <div className="group flex w-full flex-col">
      <Link
        href={`/category/${book.category}#${book.slug}`}
        className="relative block overflow-hidden rounded-[3px] bg-ink shadow-spine transition-transform duration-200 group-hover:-translate-y-1 group-hover:shadow-lift"
        style={{ aspectRatio: "2 / 3" }}
        aria-label={book.title}
      >
              <BookCover
          book={book}
          sizes="(max-width: 640px) 45vw, (max-width: 1024px) 22vw, 200px"
        />
        {discount > 0 && (
          <span className="absolute left-0 top-2 rounded-r-full bg-oxblood px-2 py-0.5 text-[11px] font-medium text-paper">
            {discount}% off
          </span>
        )}
      </Link>

      <div className="mt-3 flex flex-1 flex-col">
        <h3 className="line-clamp-2 font-display text-[15px] leading-snug text-ink">
          {book.title}
        </h3>
        <p className="mt-0.5 text-[13px] text-stone">{book.author}</p>

        <div className="mt-1.5 flex items-center gap-1 text-[12px] text-stone">
          <Star className="h-3.5 w-3.5 fill-brass text-brass" />
          <span>{book.rating}</span>
        </div>

        <div className="mt-2 flex items-baseline gap-2">
          <span className="text-[15px] font-semibold text-ink">
            {INR(book.price)}
          </span>
          {book.mrp > book.price && (
            <span className="text-[12px] text-stone line-through">
              {INR(book.mrp)}
            </span>
          )}
        </div>

        <div className="mt-3 flex gap-2">
          <button
            type="button"
            onClick={handleAdd}
            className="flex flex-1 items-center justify-center gap-1 rounded-md border border-ink/15 px-2 py-1.5 text-[12.5px] font-medium text-ink transition-colors hover:border-ink/30 hover:bg-ink/5"
          >
            {added ? (
              <>
                <Check className="h-3.5 w-3.5" /> Added
              </>
            ) : (
              "Add to cart"
            )}
          </button>
          <button
            type="button"
            onClick={handleBuyNow}
            className="flex-1 rounded-md bg-ink px-2 py-1.5 text-[12.5px] font-medium text-paper transition-colors hover:bg-ink-light"
          >
            Buy now
          </button>
        </div>
      </div>
    </div>
  );
}
