"use client";

import { useRef, useEffect, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { Calendar, MapPin, ArrowRight, Clock } from "lucide-react";
import {
  getAgendaStatus,
  getAgendaBadge,
  getCountdownLabel,
  formatAgendaDate,
} from "@/shared/lib/agenda";

export type AgendaItem = {
  id: string;
  title: string;
  slug: string;
  flyer_url: string | null;
  start_datetime: Date | string;
  end_datetime: Date | string | null;
  location_name: string | null;
};

const SPEED = 0.5;

export function AgendaCarousel({ items }: { items: AgendaItem[] }) {
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
      const state = s.current;
      if (!state.dragging && !state.paused) {
        state.x -= SPEED;
        const half = track.scrollWidth / 2;
        if (state.x < -half) state.x += half;
        track.style.transform = `translateX(${state.x}px)`;
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

  const doubled = [...items, ...items];

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
      onMouseUp={() => endDrag()}
      onTouchStart={(e) => startDrag(e.touches[0].clientX)}
      onTouchMove={(e) => moveDrag(e.touches[0].clientX)}
      onTouchEnd={() => endDrag()}
    >
      <div
        ref={trackRef}
        className="flex select-none gap-6 py-2"
        style={{ width: "max-content" }}
      >
        {doubled.map((a, i) => (
          <AgendaCard key={`${a.id}-${i}`} agenda={a} dragRef={s} />
        ))}
      </div>
    </div>
  );
}

function AgendaCard({
  agenda,
  dragRef,
}: {
  agenda: AgendaItem;
  dragRef: React.RefObject<{ dragging: boolean }>;
}) {
  const start = new Date(agenda.start_datetime);
  const end = agenda.end_datetime ? new Date(agenda.end_datetime) : null;
  const status = getAgendaStatus(start, end);
  const badge = getAgendaBadge(status);
  const countdown = getCountdownLabel(start);
  const done = status === "done";

  return (
    <Link
      href={`/agenda/${agenda.slug}`}
      prefetch={false}
      onClick={(e) => {
        if (dragRef.current.dragging) e.preventDefault();
      }}
      className="group flex w-80 shrink-0 flex-col overflow-hidden rounded-3xl border bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
    >
      {/* Flyer */}
      <div className="relative aspect-[4/5] overflow-hidden bg-emerald-950">
        {agenda.flyer_url && (
          <Image
            src={agenda.flyer_url}
            alt={agenda.title}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            sizes="320px"
          />
        )}
        <span
          className={`absolute right-3 top-3 rounded-full px-3 py-1 text-xs font-semibold ${
            done ? "bg-muted text-muted-foreground" : "bg-primary text-primary-foreground"
          }`}
        >
          {badge}
        </span>
      </div>

      {/* Body */}
      <div className="flex flex-1 flex-col p-5">
        <h3 className="text-lg font-bold leading-snug text-foreground line-clamp-2">
          {agenda.title}
        </h3>

        <div className="mt-3 space-y-1.5 text-sm text-muted-foreground">
          <p className="flex items-center gap-2">
            <Calendar className="h-4 w-4 shrink-0 text-primary" />
            {formatAgendaDate(start, end)}
          </p>
          {agenda.location_name && (
            <p className="flex items-center gap-2">
              <MapPin className="h-4 w-4 shrink-0 text-primary" />
              <span className="line-clamp-1">{agenda.location_name}</span>
            </p>
          )}
        </div>

        {countdown && (
          <p className="mt-3 inline-flex items-center gap-1.5 text-sm font-semibold text-primary">
            <Clock className="h-4 w-4" />
            {countdown}
          </p>
        )}

        {/* CTA */}
        <span className="mt-5 inline-flex w-full items-center justify-center gap-1.5 rounded-full border border-primary/40 px-4 py-2.5 text-sm font-semibold text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
          {done ? "Lihat Dokumentasi" : "Lihat Detail"}
          <ArrowRight className="h-4 w-4" />
        </span>
      </div>
    </Link>
  );
}
