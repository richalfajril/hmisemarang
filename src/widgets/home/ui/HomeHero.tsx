import Image from "next/image";
import { HeroSearchBar } from "./HeroSearchBar";

type Props = {
  heroImageUrl?: string | null;
};

const METRICS = [
  { value: "36+", label: "Komisariat" },
  { value: "3", label: "Korkom" },
  { value: "16+", label: "Universitas" },
  { value: "5000+", label: "Kader" },
];

export function HomeHero({ heroImageUrl }: Props) {
  return (
    <section className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden">
      {/* Layer 0: Background image */}
      {heroImageUrl && (
        <div className="absolute inset-0 z-0">
          <Image
            src={heroImageUrl}
            alt="Hero background"
            fill
            className="object-cover object-center"
            priority
          />
        </div>
      )}

      {/* Layer 1: Emerald gradient overlay */}
      <div
        aria-hidden="true"
        className={`absolute inset-0 z-10 bg-gradient-to-b ${
          heroImageUrl
            ? "from-emerald-950/70 via-emerald-900/60 to-emerald-950/80"
            : "from-emerald-950 via-emerald-800 to-emerald-900"
        }`}
      />

      {/* Layer 2: Islamic geometric pattern */}
      <svg
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-10 h-full w-full opacity-[0.04]"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <pattern
            id="hero-geo"
            x="0"
            y="0"
            width="60"
            height="60"
            patternUnits="userSpaceOnUse"
          >
            <path
              d="M30 3 L57 30 L30 57 L3 30 Z"
              fill="none"
              stroke="white"
              strokeWidth="0.8"
            />
            <path
              d="M30 15 L45 30 L30 45 L15 30 Z"
              fill="none"
              stroke="white"
              strokeWidth="0.6"
            />
            <circle
              cx="30"
              cy="30"
              r="2"
              fill="none"
              stroke="white"
              strokeWidth="0.5"
            />
            <circle cx="0" cy="0" r="1.5" fill="white" fillOpacity="0.7" />
            <circle cx="60" cy="0" r="1.5" fill="white" fillOpacity="0.7" />
            <circle cx="0" cy="60" r="1.5" fill="white" fillOpacity="0.7" />
            <circle cx="60" cy="60" r="1.5" fill="white" fillOpacity="0.7" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#hero-geo)" />
      </svg>

      {/* Layer 3: Content */}
      <div className="relative z-20 container mx-auto flex flex-col items-center px-4 pt-20 pb-16 text-center">
        {/* Eyebrow — pill badge */}
        <span className="inline-flex items-center rounded-full border border-white/25 bg-white/10 px-4 py-1 text-xs font-medium text-white backdrop-blur-sm sm:px-5 sm:py-1.5 sm:text-sm">
          HMI Cabang Semarang
        </span>

        {/* Heading */}
        <h1 className="mt-4 max-w-3xl text-[clamp(1.75rem,5vw,3.75rem)] font-bold leading-tight text-white">
          Membangun Kader Umat & Bangsa dari Semarang
        </h1>

        {/* Subheading */}
        <p className="mx-auto mt-4 max-w-2xl text-sm leading-relaxed text-white/75 sm:text-base md:text-lg">
          HMI Cabang Semarang menjadi ruang kaderisasi, gagasan, dan pengabdian
          bagi mahasiswa Islam untuk berkontribusi nyata bagi agama dan negara.
        </p>

        {/* CTA — Search bar */}
        <div className="mt-8 w-full max-w-xl">
          <HeroSearchBar />
        </div>

        {/* Inline Metrics — 2×2 on mobile, 1 row on sm+ */}
        <div className="mt-10 grid grid-cols-2 gap-x-0 gap-y-4 sm:flex sm:gap-0 sm:divide-x sm:divide-white/20">
          {METRICS.map((m) => (
            <div
              key={m.label}
              className="px-4 text-center sm:px-6 sm:first:pl-0 sm:last:pr-0"
            >
              <p className="text-2xl font-bold text-white sm:text-3xl">
                {m.value}
              </p>
              <p className="mt-0.5 text-[10px] font-medium uppercase tracking-widest text-white/60 sm:text-xs">
                {m.label}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
