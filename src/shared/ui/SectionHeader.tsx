import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { cn } from "@/shared/lib/utils";

const EYEBROW =
  "inline-flex items-center rounded-full bg-emerald-100 px-4 py-1.5 text-sm font-semibold text-primary";
const HEADING =
  "text-3xl font-bold tracking-tight text-foreground sm:text-4xl";
const SUBHEADING = "text-base leading-relaxed text-muted-foreground sm:text-lg";

type BaseProps = {
  eyebrow: string;
  heading: string;
  subheading?: string;
  className?: string;
};

/** Centered section header (eyebrow → heading → subheading). */
export function SectionHeaderCenter({
  eyebrow,
  heading,
  subheading,
  className,
}: BaseProps) {
  return (
    <div className={cn("text-center", className)}>
      <span className={EYEBROW}>{eyebrow}</span>
      <h2 className={cn("mt-5", HEADING)}>{heading}</h2>
      {subheading && (
        <p className={cn("mx-auto mt-4 max-w-2xl", SUBHEADING)}>{subheading}</p>
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
}: LeftProps) {
  return (
    <div
      className={cn(
        "flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between",
        className
      )}
    >
      <div>
        <span className={EYEBROW}>{eyebrow}</span>
        <h2 className={cn("mt-5", HEADING)}>{heading}</h2>
        {subheading && (
          <p className={cn("mt-4 max-w-xl", SUBHEADING)}>{subheading}</p>
        )}
      </div>
      {cta && (
        <Link
          href={cta.href}
          className="inline-flex shrink-0 items-center gap-1.5 text-sm font-semibold text-primary hover:underline"
        >
          {cta.label} <ArrowRight className="h-4 w-4" />
        </Link>
      )}
    </div>
  );
}
