import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { cn } from "@/shared/lib/utils";

const EYEBROW =
  "inline-flex items-center rounded-full px-4 py-1.5 text-sm font-semibold";
const HEADING = "text-3xl font-bold tracking-tight sm:text-4xl";
const SUBHEADING = "text-base leading-relaxed sm:text-lg";

// Warna teks: default (di bg terang) vs inverted (di bg gelap → putih).
function tone(inverted?: boolean) {
  return {
    eyebrow: inverted ? "bg-white/15 text-white" : "bg-emerald-100 text-primary",
    heading: inverted ? "text-white" : "text-foreground",
    subheading: inverted ? "text-white/80" : "text-muted-foreground",
    cta: inverted
      ? "text-white hover:text-white/80"
      : "text-primary hover:underline",
  };
}

type BaseProps = {
  eyebrow: string;
  heading: string;
  subheading?: string;
  className?: string;
  /** Untuk section ber-bg gelap: teks header menjadi putih. */
  inverted?: boolean;
};

/** Centered section header (eyebrow → heading → subheading). */
export function SectionHeaderCenter({
  eyebrow,
  heading,
  subheading,
  className,
  inverted,
}: BaseProps) {
  const t = tone(inverted);
  return (
    <div className={cn("text-center", className)}>
      <span className={cn(EYEBROW, t.eyebrow)}>{eyebrow}</span>
      <h2 className={cn("mt-5", HEADING, t.heading)}>{heading}</h2>
      {subheading && (
        <p className={cn("mx-auto mt-4 max-w-2xl", SUBHEADING, t.subheading)}>
          {subheading}
        </p>
      )}
    </div>
  );
}

type LeftProps = BaseProps & {
  cta?: { label: string; href: string };
};

/** Left-aligned section header with optional CTA on the right (desktop). */
export function SectionHeaderLeft({
  eyebrow,
  heading,
  subheading,
  cta,
  className,
  inverted,
}: LeftProps) {
  const t = tone(inverted);
  return (
    <div
      className={cn(
        "flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between",
        className
      )}
    >
      <div>
        <span className={cn(EYEBROW, t.eyebrow)}>{eyebrow}</span>
        <h2 className={cn("mt-5", HEADING, t.heading)}>{heading}</h2>
        {subheading && (
          <p className={cn("mt-4 max-w-xl", SUBHEADING, t.subheading)}>
            {subheading}
          </p>
        )}
      </div>
      {cta && (
        <Link
          href={cta.href}
          className={cn(
            "inline-flex shrink-0 items-center gap-1.5 text-sm font-semibold",
            t.cta
          )}
        >
          {cta.label} <ArrowRight className="h-4 w-4" />
        </Link>
      )}
    </div>
  );
}
