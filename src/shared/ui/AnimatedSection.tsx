import { Section } from "@/shared/ui/Section";
import { cn } from "@/shared/lib/utils";

type Props = {
  /** Kelas untuk elemen <section> (mis. background/tint). */
  className?: string;
  /** Kelas untuk container dalam (default `mx-auto max-w-7xl px-5`). */
  containerClassName?: string;
  /** Matikan diamond pattern Section bila perlu. */
  pattern?: boolean;
  children: React.ReactNode;
};

/**
 * Shell section homepage: `Section` (bg + diamond pattern) + container standar.
 * Animasi masuk dipakai per-komponen di dalamnya via `FadeIn` (stagger delay),
 * sehingga setiap section memakai animasi yang sama & komponen muncul satu per satu.
 */
export function AnimatedSection({
  className,
  containerClassName,
  pattern,
  children,
}: Props) {
  return (
    <Section className={className} pattern={pattern}>
      <div className={cn("mx-auto max-w-7xl px-5", containerClassName)}>
        {children}
      </div>
    </Section>
  );
}
