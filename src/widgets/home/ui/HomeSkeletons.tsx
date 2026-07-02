import { Skeleton } from "@/shared/ui/Skeleton";

// Skeleton loading per section — tinggi mendekati komponen asli (cegah CLS).
// Dipakai sebagai fallback <Suspense> untuk section Dynamic.

export function HeroSkeleton() {
  return (
    <section className="relative flex min-h-screen flex-col items-center justify-center bg-emerald-950">
      <div className="flex w-full max-w-3xl flex-col items-center gap-4 px-4 text-center">
        <Skeleton className="h-7 w-64 rounded-full bg-white/10" />
        <Skeleton className="h-12 w-full bg-white/10" />
        <Skeleton className="h-12 w-2/3 bg-white/10" />
        <Skeleton className="mt-2 h-5 w-3/4 bg-white/10" />
        <Skeleton className="mt-6 h-12 w-full max-w-xl rounded-full bg-white/10" />
        <div className="mt-8 flex gap-8">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-12 w-16 bg-white/10" />
          ))}
        </div>
      </div>
      <div className="absolute bottom-6 flex w-full justify-center gap-6 px-4">
        {Array.from({ length: 5 }).map((_, i) => (
          <Skeleton key={i} className="h-12 w-48 bg-white/10" />
        ))}
      </div>
    </section>
  );
}

function HeaderSkeleton({ center }: { center?: boolean }) {
  return (
    <div className={center ? "flex flex-col items-center gap-3 text-center" : "flex flex-col gap-3"}>
      <Skeleton className="h-7 w-28 rounded-full" />
      <Skeleton className="h-9 w-72" />
      <Skeleton className="h-5 w-full max-w-xl" />
    </div>
  );
}

export function AboutSkeleton() {
  return (
    <section className="overflow-hidden bg-gradient-to-br from-emerald-800 to-emerald-950 py-14">
      <div className="mx-auto max-w-7xl px-5">
        <HeaderSkeleton center />
        <div className="mt-12 grid gap-8 lg:grid-cols-2">
          <Skeleton className="h-80 rounded-3xl" />
          <Skeleton className="h-80 rounded-3xl" />
        </div>
      </div>
    </section>
  );
}

export function ArticlesSkeleton() {
  return (
    <section className="overflow-hidden bg-white py-14">
      <div className="mx-auto max-w-7xl px-5">
        <HeaderSkeleton />
        <div className="mt-10 grid gap-6 lg:grid-cols-3">
          <Skeleton className="aspect-[4/3] rounded-3xl lg:col-span-2" />
          <div className="flex flex-col gap-6">
            <Skeleton className="min-h-[18rem] flex-1 rounded-3xl" />
            <Skeleton className="min-h-[18rem] flex-1 rounded-3xl" />
          </div>
        </div>
      </div>
    </section>
  );
}

export function AgendaSkeleton() {
  return (
    <section className="overflow-hidden bg-gradient-to-br from-emerald-800 to-emerald-950 py-14">
      <div className="mx-auto max-w-7xl px-5">
        <HeaderSkeleton />
      </div>
      <div className="mt-10 flex gap-6 overflow-hidden px-4">
        {Array.from({ length: 5 }).map((_, i) => (
          <Skeleton key={i} className="h-[28rem] w-80 shrink-0 rounded-3xl" />
        ))}
      </div>
    </section>
  );
}

export function TestimonialsSkeleton() {
  return (
    <section className="overflow-hidden bg-white py-14 pb-28">
      <div className="mx-auto max-w-7xl px-5">
        <HeaderSkeleton center />
      </div>
      <div className="mt-10 flex gap-6 overflow-hidden px-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} className="h-64 w-80 shrink-0 rounded-3xl sm:w-96" />
        ))}
      </div>
    </section>
  );
}

export function GallerySkeleton() {
  return (
    <section className="overflow-hidden bg-white py-14">
      <div className="mx-auto max-w-7xl px-5">
        <HeaderSkeleton center />
        <div className="mt-8 flex h-[460px] items-center justify-center sm:h-[520px]">
          <Skeleton className="h-[380px] w-[280px] rounded-2xl" />
        </div>
        <div className="mt-8 flex justify-center">
          <Skeleton className="h-12 w-44 rounded-full" />
        </div>
      </div>
    </section>
  );
}
