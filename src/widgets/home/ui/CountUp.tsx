"use client";

import { useEffect, useRef, useState } from "react";

const DURATION = 1500;

/**
 * Counts up to the numeric portion of `value` when scrolled into view,
 * preserving any non-numeric suffix (e.g. "5000+", "16+").
 */
export function CountUp({
  value,
  className,
  delay = 0,
}: {
  value: string;
  className?: string;
  delay?: number;
}) {
  const match = value.match(/^(\d+)(.*)$/);
  const target = match ? parseInt(match[1], 10) : 0;
  const suffix = match ? match[2] : value;

  const [n, setN] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || target === 0) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        observer.disconnect();
        const run = () => {
          const start = performance.now();
          const tick = (t: number) => {
            const p = Math.min((t - start) / DURATION, 1);
            const eased = 1 - Math.pow(1 - p, 3);
            setN(Math.round(target * eased));
            if (p < 1) requestAnimationFrame(tick);
          };
          requestAnimationFrame(tick);
        };
        if (delay > 0) setTimeout(run, delay);
        else run();
      },
      { threshold: 0.5 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [target, delay]);

  return (
    <span ref={ref} className={className}>
      {target === 0 ? value : `${n}${suffix}`}
    </span>
  );
}
