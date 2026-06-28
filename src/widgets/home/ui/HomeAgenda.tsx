import { Section } from "@/shared/ui/Section";
import { FadeIn } from "@/shared/ui/FadeIn";
import { SectionHeaderLeft } from "@/shared/ui/SectionHeader";
import { AgendaCarousel, type AgendaItem } from "./AgendaCarousel";
import { getUpcomingAgendas } from "../api/queries";

const FALLBACK: AgendaItem[] = [
  {
    id: "ag1",
    title: "Latihan Kader II (Intermediate Training)",
    slug: "lk2-intermediate-training",
    flyer_url: null,
    start_datetime: new Date("2026-07-01"),
    end_datetime: new Date("2026-07-07"),
    location_name: "Asrama Haji Semarang",
  },
  {
    id: "ag2",
    title: "Diskusi Publik: Arah Baru Gerakan Mahasiswa",
    slug: "diskusi-publik-gerakan-mahasiswa",
    flyer_url: null,
    start_datetime: new Date("2026-07-20"),
    end_datetime: null,
    location_name: "Gedung KNPI Jateng",
  },
  {
    id: "ag3",
    title: "Malam Puncak Dies Natalis HMI ke-79",
    slug: "dies-natalis-hmi-79",
    flyer_url: null,
    start_datetime: new Date("2026-02-05"),
    end_datetime: null,
    location_name: "Hotel Grasia Semarang",
  },
  {
    id: "ag4",
    title: "Sekolah Pemikiran Islam & Keindonesiaan",
    slug: "sekolah-pemikiran-islam",
    flyer_url: null,
    start_datetime: new Date("2026-08-12"),
    end_datetime: new Date("2026-08-14"),
    location_name: "Sekretariat HMI Cabang Semarang",
  },
];

export async function HomeAgenda() {
  const data = (await getUpcomingAgendas()) as AgendaItem[];
  const slugs = new Set(data.map((a) => a.slug));
  const supplemental = FALLBACK.filter((f) => !slugs.has(f.slug));
  const agendas = [...data, ...supplemental];
  if (agendas.length === 0) return null;

  return (
    <Section className="bg-emerald-50/60">
      <div className="mx-auto max-w-7xl px-4">
        <FadeIn>
          <SectionHeaderLeft
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
