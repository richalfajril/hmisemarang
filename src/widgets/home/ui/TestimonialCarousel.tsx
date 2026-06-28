"use client";

import { useRef, useEffect, useCallback } from "react";
import Image from "next/image";
import { Quote } from "lucide-react";

export type Testimonial = {
  id: string;
  photoUrl: string | null;
  quote: string;
  name: string;
  title: string;
};

const SPEED = 0.4;

export function TestimonialCarousel({
  testimonials,
}: {
  testimonials: Testimonial[];
}) {
  const trackRef = useRef<HTMLDivElement>(null);
  const s = useRef({
    x: 0,
    paused: false,
    dragging: false,
    startX: 0,
    startOffset: 0,
  });
  const rafRef = useRef(0);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    const tick = () => {
      const st = s.current;
      if (!st.dragging && !st.paused) {
        st.x -= SPEED;
        const half = track.scrollWidth / 2;
        if (st.x < -half) st.x += half;
        track.style.transform = `translateX(${st.x}px)`;
      }
      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
  }, []);

  const startDrag = useCallback((x: number) => {
    s.current.dragging = true;
    s.current.startX = x;
    s.current.startOffset = s.current.x;
  }, []);
  const moveDrag = useCallback((x: number) => {
    if (!s.current.dragging || !trackRef.current) return;
    s.current.x = s.current.startOffset + (x - s.current.startX);
    trackRef.current.style.transform = `translateX(${s.current.x}px)`;
  }, []);
  const endDrag = useCallback(() => {
    if (!trackRef.current) return;
    s.current.dragging = false;
    const half = trackRef.current.scrollWidth / 2;
    while (s.current.x < -half) s.current.x += half;
    while (s.current.x > 0) s.current.x -= half;
  }, []);

  const doubled = [...testimonials, ...testimonials];

  return (
    <div
      className="cursor-grab overflow-hidden active:cursor-grabbing"
      onMouseEnter={() => {
        s.current.paused = true;
      }}
      onMouseLeave={() => {
        s.current.paused = false;
        endDrag();
      }}
      onMouseDown={(e) => startDrag(e.clientX)}
      onMouseMove={(e) => moveDrag(e.clientX)}
      onMouseUp={endDrag}
      onTouchStart={(e) => startDrag(e.touches[0].clientX)}
      onTouchMove={(e) => moveDrag(e.touches[0].clientX)}
      onTouchEnd={endDrag}
    >
      <div
        ref={trackRef}
        className="flex select-none gap-6 py-2"
        style={{ width: "max-content" }}
      >
        {doubled.map((t, i) => (
          <TestimonialCard key={`${t.id}-${i}`} t={t} />
        ))}
      </div>
    </div>
  );
}

function TestimonialCard({ t }: { t: Testimonial }) {
  return (
    <figure className="flex w-80 shrink-0 flex-col rounded-3xl border bg-card p-6 shadow-sm sm:w-96 sm:p-8">
      <Quote className="h-9 w-9 shrink-0 text-emerald-200" aria-hidden="true" />
      <blockquote className="mt-4 flex-1 text-sm italic leading-relaxed text-foreground/90 line-clamp-4 sm:text-base">
        &ldquo;{t.quote}&rdquo;
      </blockquote>
      <figcaption className="mt-6 flex items-center gap-3 border-t pt-5">
        <div className="relative h-11 w-11 shrink-0 overflow-hidden rounded-full bg-emerald-100">
          {t.photoUrl ? (
            <Image src={t.photoUrl} alt={t.name} fill className="object-cover" sizes="44px" />
          ) : (
            <span className="flex h-full w-full items-center justify-center text-sm font-bold text-primary">
              {t.name.charAt(0)}
            </span>
          )}
        </div>
        <div className="min-w-0">
          <p className="truncate font-bold text-foreground">{t.name}</p>
          <p className="truncate text-xs text-muted-foreground">{t.title}</p>
        </div>
      </figcaption>
    </figure>
  );
}
