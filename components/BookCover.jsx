"use client";

import { useState } from "react";
import Image from "next/image";

const PALETTE = ["#3F5A50", "#7A3B34", "#4C4A78", "#8A6A2F", "#2F5D68"];
function paletteFor(seed) {
  let h = 0;
  for (let i = 0; i < seed.length; i++) h = (h * 31 + seed.charCodeAt(i)) >>> 0;
  return PALETTE[h % PALETTE.length];
}

export default function BookCover({ book, sizes, className = "", priority = false }) {
  const [failed, setFailed] = useState(false);

  if (failed) {
    const bg = paletteFor(book.id);
    return (
      <div
        className={`flex h-full w-full flex-col justify-between p-3 text-paper ${className}`}
        style={{ background: `linear-gradient(160deg, ${bg}, ${bg}cc)` }}
      >
        <span className="text-[10px] uppercase tracking-widest text-paper/70">
         QuickPayBooks
        </span>
        <div>
          <p className="font-display text-[13px] leading-snug line-clamp-4">
            {book.title}
          </p>
          <p className="mt-1 text-[11px] text-paper/75 line-clamp-1">{book.author}</p>
        </div>
      </div>
    );
  }

  return (
    <Image
      src={`https://covers.openlibrary.org/b/isbn/${book.isbn}-L.jpg`}
      alt={`Cover of ${book.title}`}
      fill
      sizes={sizes}
      priority={priority}
      className={`object-cover ${className}`}
      onError={() => setFailed(true)}
    />
  );
}