import { Section } from "@/shared/ui/Section";
import { FadeIn } from "@/shared/ui/FadeIn";
import { SectionHeaderLeft } from "@/shared/ui/SectionHeader";
import { AgendaCarousel, type AgendaItem } from "./AgendaCarousel";
import { getUpcomingAgendas } from "../api/queries";

export const AGENDA_FALLBACK: AgendaItem[] = [
  {
    id: "ag1",
    title: "Latihan Kader II (Intermediate Training)",
    slug: "lk2-intermediate-training",
    flyer_url: "https://images.unsplash.com/photo-1511578314322-379afb476865?w=800&q=80",
    start_datetime: new Date("2026-07-01"),
    end_datetime: new Date("2026-07-07"),
    location_name: "Asrama Haji Semarang",
  },
  {
    id: "ag2",
    title: "Diskusi Publik: Arah Baru Gerakan Mahasiswa",
    slug: "diskusi-publik-gerakan-mahasiswa",
    flyer_url: "https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=800&q=80",
    start_datetime: new Date("2026-07-20"),
    end_datetime: null,
    location_name: "Gedung KNPI Jateng",
  },
  {
    id: "ag3",
    title: "Malam Puncak Dies Natalis HMI ke-79",
    slug: "dies-natalis-hmi-79",
    flyer_url: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&q=80",
    start_datetime: new Date("2026-02-05"),
    end_datetime: null,
    location_name: "Hotel Grasia Semarang",
  },
  {
    id: "ag4",
    title: "Sekolah Pemikiran Islam & Keindonesiaan",
    slug: "sekolah-pemikiran-islam",
    flyer_url: "https://images.unsplash.com/photo-1517486808906-6ca8b3f04846?w=800&q=80",
    start_datetime: new Date("2026-08-12"),
    end_datetime: new Date("2026-08-14"),
    location_name: "Sekretariat HMI Cabang Semarang",
  },
  {
    id: "ag5",
    title: "Pelantikan Pengurus HMI Cabang Semarang",
    slug: "pelantikan-pengurus-cabang",
    flyer_url: "https://images.unsplash.com/photo-1531482615713-2afd69097998?w=800&q=80",
    start_datetime: new Date("2026-09-01"),
    end_datetime: null,
    location_name: "Auditorium Kampus",
  },
  {
    id: "ag6",
    title: "Bakti Sosial & Donor Darah",
    slug: "bakti-sosial-donor-darah",
    flyer_url: "https://images.unsplash.com/photo-1544928147-79a2dbc1f389?w=800&q=80",
    start_datetime: new Date("2026-06-10"),
    end_datetime: null,
    location_name: "Balai Kota Semarang",
  },
  {
    id: "ag7",
    title: "Seminar Nasional Kepemimpinan Mahasiswa",
    slug: "seminar-nasional-kepemimpinan",
    flyer_url: "https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&q=80",
    start_datetime: new Date("2026-05-18"),
    end_datetime: null,
    location_name: "Gedung Prof. Soedarto",
  },
  {
    id: "ag8",
    title: "Follow Up Latihan Kader I",
    slug: "follow-up-lk1",
    flyer_url: "https://images.unsplash.com/photo-1475721027785-f74eccf877e2?w=800&q=80",
    start_datetime: new Date("2026-04-22"),
    end_datetime: new Date("2026-04-24"),
    location_name: "Wisma Diklat",
  },
];

export async function HomeAgenda() {
  const data = (await getUpcomingAgendas()) as AgendaItem[];
  const slugs = new Set(data.map((a) => a.slug));
  const supplemental = AGENDA_FALLBACK.filter((f) => !slugs.has(f.slug));
  const agendas = [...data, ...supplemental];
  if (agendas.length === 0) return null;

  return (
    <Section className="bg-gradient-to-br from-emerald-800 to-emerald-950">
      <div className="mx-auto max-w-7xl px-4">
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
