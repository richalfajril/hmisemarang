import { AnimatedSection } from "@/shared/ui/AnimatedSection";
import { FadeIn } from "@/shared/ui/FadeIn";
import { SectionHeaderCenter } from "@/shared/ui/SectionHeader";
import { Logo3D } from "./Logo3D";
import { ArrowRight, BookOpen, MapPin, Users } from "lucide-react";
import Link from "next/link";

const FEATURES = [
  { icon: BookOpen, title: "Kaderisasi terarah" },
  { icon: Users, title: "Jejaring komisariat" },
  { icon: MapPin, title: "Untuk Semarang" },
];

export function HomeAbout() {
  return (
    <AnimatedSection className="bg-gradient-to-br from-emerald-800 to-emerald-950">
      <FadeIn>
        <SectionHeaderCenter
          inverted
          eyebrow="Tentang Kami"
          heading="Tentang HMI Cabang Semarang"
          subheading="Kepengurusan cabang HMI yang menaungi komisariat di berbagai perguruan tinggi Kota Semarang."
        />
      </FadeIn>

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
                <div
                  key={f.title}
                  className="flex items-center gap-4 rounded-2xl bg-muted/40 p-5 sm:block sm:py-7"
                >
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-100 text-primary">
                    <f.icon className="h-5 w-5" />
                  </div>
                  <p className="text-sm font-bold text-foreground sm:mt-4">
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

          {/* Right Card — Logo 3D */}
          <FadeIn
            delay={300}
            className="order-first rounded-3xl bg-white p-2 shadow-xl sm:p-3 lg:order-none"
          >
            <div className="aspect-square w-full">
              <Logo3D />
            </div>
          </FadeIn>
        </div>
    </AnimatedSection>
  );
}
