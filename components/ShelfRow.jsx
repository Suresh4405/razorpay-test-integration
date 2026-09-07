import Link from "next/link";
import { ChevronRight } from "lucide-react";
import BookCard from "./BookCard";

export default function ShelfRow({ category, books }) {
  return (
    <section className="mx-auto max-w-6xl px-4 py-10 sm:px-6" id={category.slug}>
      <div className="mb-5 flex items-end justify-between gap-4">
        <div>
          <h2 className="font-display text-2xl text-ink sm:text-[26px]">
            {category.label}
          </h2>
          <p className="mt-1 text-sm text-stone">{category.tagline}</p>
        </div>
        <Link
          href={`/category/${category.slug}`}
          className="flex shrink-0 items-center gap-0.5 text-sm font-medium text-brass-dark hover:text-brass"
        >
          View all
          <ChevronRight className="h-4 w-4" />
        </Link>
      </div>

      
      <div className="-mx-4 flex snap-x gap-4 overflow-x-auto px-4 pb-2 sm:mx-0 sm:grid sm:grid-cols-3 sm:gap-6 sm:overflow-visible sm:px-0 md:grid-cols-4 lg:grid-cols-5">
        {books.map((book) => (
          <div
            key={book.id}
            className="w-[42vw] shrink-0 snap-start sm:w-auto"
          >
            <BookCard book={book} />
          </div>
        ))}
      </div>

      <div className="mt-5 h-px bg-gradient-to-r from-ink/15 via-ink/5 to-transparent" />
    </section>
  );
}
