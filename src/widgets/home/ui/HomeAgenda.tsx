import { Section } from "@/shared/ui/Section";
import { FadeIn } from "@/shared/ui/FadeIn";
import { SectionHeaderLeft } from "@/shared/ui/SectionHeader";
import { AgendaCarousel, type AgendaItem } from "./AgendaCarousel";
import { getUpcomingAgendas, AGENDA_FALLBACK } from "../api/queries";

export async function HomeAgenda() {
  const data = (await getUpcomingAgendas()) as AgendaItem[];
  const slugs = new Set(data.map((a) => a.slug));
  const supplemental = AGENDA_FALLBACK.filter((f) => !slugs.has(f.slug));
  const agendas = [...data, ...supplemental];
  if (agendas.length === 0) return null;

  return (
    <Section className="bg-gradient-to-br from-emerald-800 to-emerald-950">
      <div className="mx-auto max-w-7xl px-5">
        <FadeIn>
          <SectionHeaderLeft
            inverted
            eyebrow="Agenda"
            heading="Agenda Mendatang"
            subheading="Ikuti berbagai kegiatan, diskusi, pelatihan, dan agenda HMI Cabang Semarang yang dapat diikuti oleh kader maupun masyarakat."
            cta={{ label: "Agenda Lainnya", href: "/agenda" }}
          />
        </FadeIn>
      </div>

      {/* Carousel full-bleed: lebar penuh */}
      <FadeIn delay={150} className="mt-10">
        <AgendaCarousel items={agendas} />
      </FadeIn>
    </Section>
  );
}
