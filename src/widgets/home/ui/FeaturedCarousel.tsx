"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";

export type FeaturedItem = {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  featured_image_url: string | null;
  published_at: Date | string | null;
  category: { name: string } | null;
};

const dateFmt = new Intl.DateTimeFormat("id-ID", {
  day: "numeric",
  month: "long",
  year: "numeric",
});

function formatMeta(a: FeaturedItem) {
  const parts: string[] = [];
  if (a.category?.name) parts.push(a.category.name);
  if (a.published_at) parts.push(dateFmt.format(new Date(a.published_at)));
  return parts.join(" • ");
}

const INTERVAL = 5000;

export function FeaturedCarousel({ items }: { items: FeaturedItem[] }) {
  const [index, setIndex] = useState(0);
  const paused = useRef(false);

  useEffect(() => {
    if (items.length <= 1) return;
    const id = setInterval(() => {
      if (!paused.current) setIndex((i) => (i + 1) % items.length);
    }, INTERVAL);
    return () => clearInterval(id);
  }, [items.length]);

  if (items.length === 0) return null;

  return (
    <div>
      {/* Slides (crossfade) */}
      <div
        className="group relative aspect-[4/3] overflow-hidden rounded-3xl bg-emerald-950 transition-transform duration-300 hover:-translate-y-1"
        onMouseEnter={() => (paused.current = true)}
        onMouseLeave={() => (paused.current = false)}
      >
        {items.map((a, i) => (
          <Link
            key={a.id}
            href={`/artikel/${a.slug}`}
            aria-hidden={i !== index}
            tabIndex={i === index ? 0 : -1}
            className={`absolute inset-0 flex transition-opacity duration-700 ${
              i === index ? "z-10 opacity-100" : "pointer-events-none opacity-0"
            }`}
          >
            {a.featured_image_url && (
              <Image
                src={a.featured_image_url}
                alt={a.title}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-105"
                sizes="(min-width: 1024px) 66vw, 100vw"
                priority={i === 0}
              />
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
            <div className="relative z-10 mt-auto w-full p-4 pb-12 sm:p-6 sm:pb-14">
              <div className="w-full rounded-3xl border border-white/20 bg-white/10 p-6 shadow-2xl backdrop-blur-md sm:p-8">
                <p className="text-xs font-semibold uppercase tracking-widest text-emerald-300">
                  {formatMeta(a)}
                </p>
                <h3 className="mt-3 text-2xl font-bold leading-tight text-white sm:text-3xl line-clamp-1">
                  {a.title}
                </h3>
                {a.excerpt && (
                  <p className="mt-3 text-sm leading-relaxed text-white sm:text-base line-clamp-2">
                    {a.excerpt}
                  </p>
                )}
                <span className="mt-6 inline-flex items-center gap-2 rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground transition-colors group-hover:bg-primary/90">
                  Baca Selengkapnya
                </span>
              </div>
            </div>
          </Link>
        ))}

        {/* Pagination dots (inside card) */}
        {items.length > 1 && (
          <div className="absolute bottom-5 left-1/2 z-20 flex -translate-x-1/2 gap-2">
            {items.map((a, i) => (
              <button
                key={a.id}
                type="button"
                onClick={() => setIndex(i)}
                aria-label={`Tampilkan artikel ${i + 1}`}
                aria-current={i === index}
                className={`h-2.5 rounded-full transition-all ${
                  i === index
                    ? "w-6 bg-white"
                    : "w-2.5 bg-white/40 hover:bg-white/60"
                }`}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
