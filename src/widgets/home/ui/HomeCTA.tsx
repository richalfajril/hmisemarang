import Link from "next/link";
import { FadeIn } from "@/shared/ui/FadeIn";

// Static section (copywriting hardcoded) — render langsung, tanpa Loading/Error
// (DESIGN.md §16).

export function HomeCTA() {
  return (
    <section className="overflow-hidden py-14">
      <div className="mx-auto max-w-7xl px-5">
        <FadeIn>
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-emerald-700 to-emerald-900 px-6 py-16 text-center sm:px-12">
            {/* Decorative pattern (kiri-atas & kanan-bawah) */}
            <svg
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 h-full w-full text-white opacity-[0.06]"
              xmlns="http://www.w3.org/2000/svg"
            >
              <defs>
                <pattern
                  id="cta-geo"
                  x="0"
                  y="0"
                  width="64"
                  height="64"
                  patternUnits="userSpaceOnUse"
                >
                  <path
                    d="M32 4 L60 32 L32 60 L4 32 Z"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.2"
                  />
                  <path d="M0 0 A32 32 0 0 1 32 32 L0 32 Z" fill="currentColor" fillOpacity="0.4" />
                </pattern>
                <radialGradient id="cta-fade" cx="50%" cy="50%" r="75%">
                  <stop offset="35%" stopColor="black" />
                  <stop offset="100%" stopColor="white" />
                </radialGradient>
                <mask id="cta-mask">
                  <rect width="100%" height="100%" fill="url(#cta-fade)" />
                </mask>
              </defs>
              <rect width="100%" height="100%" fill="url(#cta-geo)" mask="url(#cta-mask)" />
            </svg>

            {/* Content */}
            <div className="relative z-10">
              <h2 className="text-2xl font-bold text-white sm:text-3xl md:text-4xl">
                Cari Tahu Tentang Kami Lebih Banyak
              </h2>
              <p className="mx-auto mt-4 max-w-2xl text-base leading-relaxed text-white/80 sm:text-lg">
                Lihat galeri kegiatan kami atau hubungi kontak untuk informasi
                lebih lanjut mengenai program dan kolaborasi.
              </p>

              <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
                <Link
                  href="/galeri"
                  className="inline-flex w-full items-center justify-center rounded-full bg-white px-7 py-3 text-sm font-semibold text-primary shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-lg sm:w-auto"
                >
                  Lihat Galeri
                </Link>
                <Link
                  href="/kontak"
                  className="inline-flex w-full items-center justify-center rounded-full border border-white/70 px-7 py-3 text-sm font-semibold text-white transition-colors hover:bg-white/10 sm:w-auto"
                >
                  Hubungi Kami
                </Link>
              </div>
            </div>
          </div>
        </FadeIn>
      </div>
    </section>
  );
}
