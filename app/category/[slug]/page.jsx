import { notFound } from "next/navigation";
import { CATEGORIES, getBooksByCategory, getCategory } from "@/data/books";
import BookCard from "@/components/BookCard";

export function generateStaticParams() {
  return CATEGORIES.map((c) => ({ slug: c.slug }));
}

export function generateMetadata({ params }) {
  const category = getCategory(params.slug);
  if (!category) return {};
  return {
    title: `${category.label} — QuickPayBooks`,
    description: category.tagline,
  };
}

export default function CategoryPage({ params }) {
  const category = getCategory(params.slug);
  if (!category) notFound();

  const books = getBooksByCategory(category.slug);

  return (
    <section className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
      <div className="mb-8 border-b border-ink/10 pb-6">
        <h1 className="font-display text-3xl text-ink sm:text-4xl">
          {category.label}
        </h1>
       
      </div>

      <div className="grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
        {books.map((book) => (
          <div key={book.id} id={book.slug}>
            <BookCard book={book} />
          </div>
        ))}
      </div>
    </section>
  );
}
