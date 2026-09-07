import Link from "next/link";
import { BOOKS, CATEGORIES, getBooksByCategory } from "@/data/books";
import ShelfRow from "@/components/ShelfRow";
import BookCard from "@/components/BookCard";
import BookCover from "@/components/BookCover";

export default function HomePage() {
   const bestsellers = [...BOOKS]
    .sort((a, b) => b.rating - a.rating)
    .slice(0, 12);

  const heroBooks = CATEGORIES.map(
    (c) => getBooksByCategory(c.slug)[0]
  );

  return (
    <>
      <section className="mx-auto max-w-6xl px-4 pb-6 pt-10 sm:px-6 sm:pt-16">
        <div className="grid items-center gap-10 lg:grid-cols-[1.1fr,0.9fr]">
          <div className="max-w-xl">
            <h1 className="font-display text-[2.5rem] leading-[1.08] text-ink sm:text-[3.4rem]">
           Great Books Deserve Great Code
            </h1>
            <p className="mt-5 max-w-md text-[15px] leading-relaxed text-stone sm:text-base">
             
              QuickPayBooks is a Next.js 14 e-commerce demonstration featuring a curated inventory of 40 books across 4 genres - fiction, science, folktales, and mystery. The platform implements a full payment workflow using Razorpay's test mode, complete with order creation, payment intent generation, and webhook handling — all without processing real transactions.
            </p>
            <div className="mt-7 flex flex-wrap gap-3">
              <a
                href="#fiction"
                className="rounded-md bg-ink px-5 py-2.5 text-sm font-medium text-paper hover:bg-ink-light"
              >
                Start browsing
              </a>
              <Link
                href="/cart"
                className="rounded-md border border-ink/20 px-5 py-2.5 text-sm font-medium text-ink hover:bg-ink/5"
              >
                View cart
              </Link>
            </div>
          </div>

          <div className="relative mx-auto hidden h-[280px] w-full max-w-sm sm:block">
            {heroBooks.map((book, i) => {
              const rotations = [-9, -3, 4, 10];
              const offsets = [0, 40, 80, 120];
              return (
                <div
                  key={book.id}
                  className="absolute top-0 h-[260px] w-[170px] overflow-hidden rounded-[3px] shadow-lift ring-1 ring-ink/10"
                  style={{
                    left: `${offsets[i]}px`,
                    transform: `rotate(${rotations[i]}deg)`,
                    zIndex: i,
                  }}
                >
              <BookCover book={book} sizes="170px" priority={i === 0} />
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
        <div className="mb-5">
          <h2 className="font-display text-2xl text-ink sm:text-[26px]">
            Reader favourites
          </h2>
          <p className="mt-1 text-sm text-stone">
            The highest-rated titles across every shelf.
          </p>
        </div>
                      <div className="grid grid-cols-2 gap-x-5 gap-y-9 sm:grid-cols-3 sm:gap-x-6 sm:gap-y-10 lg:grid-cols-4 lg:gap-x-8 lg:gap-y-12">
          {bestsellers.map((book) => (
            <BookCard key={book.id} book={book} />
          ))}
        </div>
        <div className="mt-5 h-px bg-gradient-to-r from-ink/15 via-ink/5 to-transparent" />
      </section>

      {CATEGORIES.map((c) => (
        <ShelfRow
          key={c.slug}
          category={c}
          books={getBooksByCategory(c.slug).slice(0, 5)}
        />
      ))}
    </>
  );
}
