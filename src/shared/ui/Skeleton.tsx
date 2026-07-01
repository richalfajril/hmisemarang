import { cn } from "@/shared/lib/utils";

/** Placeholder loading. Pakai pada Suspense fallback komponen Dynamic. */
export function Skeleton({ className }: { className?: string }) {
  return <div className={cn("animate-pulse rounded-md bg-muted", className)} />;
}
