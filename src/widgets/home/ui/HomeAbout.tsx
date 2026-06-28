import { FadeIn } from "@/shared/ui/FadeIn";
import { Section } from "@/shared/ui/Section";
import { SectionHeaderCenter } from "@/shared/ui/SectionHeader";
import { ArrowRight, BookOpen, MapPin, Users } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

type Props = {
  aboutImageUrl?: string | null;
};

const FEATURES = [
  { icon: BookOpen, title: "Kaderisasi terarah" },
  { icon: Users, title: "Jejaring komisariat" },
  { icon: MapPin, title: "Untuk Semarang" },
];

export function HomeAbout({ aboutImageUrl }: Props) {
  return (
    <Section className="bg-emerald-50/60">
      <div className="mx-auto max-w-7xl px-4">
        <SectionHeaderCenter
          eyebrow="Tentang Kami"
          heading="Tentang HMI Cabang Semarang"
          subheading="Kepengurusan cabang HMI yang menaungi komisariat di berbagai perguruan tinggi Kota Semarang."
        />

        {/* Split Cards */}
        <div className="mt-12 grid gap-8 lg:grid-cols-2">
          {/* Left Card */}
          <FadeIn delay={150} className="rounded-3xl border bg-white p-8 shadow-sm sm:p-10">
            <h3 className="text-2xl font-bold text-foreground">
              HMI Cabang Semarang
            </h3>
            <p className="mt-1 text-sm text-muted-foreground">
              Wadah kaderisasi mahasiswa Islam Kota Semarang
            </p>

            <p className="mt-6 text-sm leading-relaxed text-muted-foreground sm:text-base">
              HMI Cabang Semarang merupakan kepengurusan cabang dari Himpunan
              Mahasiswa Islam yang menaungi komisariat-komisariat HMI di
              berbagai perguruan tinggi di Kota Semarang. Berkomitmen membina
              kader yang berlandaskan keislaman, keindonesiaan, dan
              intelektualitas demi terwujudnya masyarakat adil dan makmur yang
              diridai Allah SWT.
            </p>

            {/* Feature mini-cards */}
            <div className="mt-8 grid gap-4 sm:grid-cols-3">
              {FEATURES.map((f) => (
                <div key={f.title} className="rounded-2xl bg-muted/40 p-5">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-100 text-primary">
                    <f.icon className="h-5 w-5" />
                  </div>
                  <p className="mt-4 text-sm font-bold text-foreground">
                    {f.title}
                  </p>
                </div>
              ))}
            </div>

            {/* CTA */}
            <Link
              href="/profil"
              className="mt-8 inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
            >
              Lihat Profil Lengkap <ArrowRight className="h-4 w-4" />
            </Link>

            <p className="mt-6 text-sm text-muted-foreground">
              Menghubungkan ilmu, komunitas, dan pengabdian dalam satu wadah.
            </p>
          </FadeIn>

          {/* Right Card — Featured Image / Visual Preview */}
          <FadeIn delay={300} className="rounded-3xl bg-emerald-50 p-6 sm:p-8">
            {aboutImageUrl ? (
              <div className="relative aspect-[4/3] w-full overflow-hidden rounded-2xl bg-white">
                <Image
                  src={aboutImageUrl}
                  alt="Tentang HMI Cabang Semarang"
                  fill
                  className="object-cover"
                  sizes="(min-width: 1024px) 50vw, 100vw"
                />
              </div>
            ) : (
              <div className="rounded-2xl bg-white p-6 shadow-sm">
                {/* Header row */}
                <div className="flex items-center justify-between">
                  <span className="rounded-full border border-emerald-200 px-4 py-1.5 text-sm font-semibold text-primary">
                    Pratinjau Visual
                  </span>
                  <span className="h-3 w-3 rounded-full bg-primary" />
                </div>

                {/* Skeleton block */}
                <div className="mt-6 rounded-2xl bg-muted/40 p-5">
                  <div className="flex gap-4">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-emerald-100 text-primary">
                      <BookOpen className="h-6 w-6" />
                    </div>
                    <div className="flex-1 space-y-2 pt-1.5">
                      <div className="h-3 w-full rounded-full bg-muted" />
                      <div className="h-3 w-2/3 rounded-full bg-muted" />
                    </div>
                  </div>
                  <div className="mt-5 grid grid-cols-2 gap-4">
                    {[0, 1].map((i) => (
                      <div
                        key={i}
                        className="space-y-2 rounded-xl bg-white p-4"
                      >
                        <div className="h-2.5 w-1/2 rounded-full bg-emerald-200" />
                        <div className="h-2.5 w-full rounded-full bg-muted" />
                        <div className="h-2.5 w-2/3 rounded-full bg-muted" />
                      </div>
                    ))}
                  </div>
                </div>

                {/* Stats */}
                <div className="mt-6 grid grid-cols-2 gap-4">
                  <div className="rounded-2xl bg-emerald-50 p-5">
                    <p className="text-2xl font-bold text-foreground">36+</p>
                    <p className="mt-0.5 text-sm text-muted-foreground">
                      Komisariat
                    </p>
                  </div>
                  <div className="rounded-2xl bg-emerald-50 p-5">
                    <p className="text-2xl font-bold text-foreground">5000+</p>
                    <p className="mt-0.5 text-sm text-muted-foreground">
                      Kader
                    </p>
                  </div>
                </div>
              </div>
            )}
          </FadeIn>
        </div>
      </div>
    </Section>
  );
}
