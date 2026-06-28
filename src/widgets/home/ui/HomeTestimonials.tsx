import { Section } from "@/shared/ui/Section";
import { FadeIn } from "@/shared/ui/FadeIn";
import { SectionHeaderCenter } from "@/shared/ui/SectionHeader";
import { getOptimizedUrl } from "@/shared/lib/cloudinary-upload";
import { TestimonialCarousel, type Testimonial } from "./TestimonialCarousel";
import { getTestimonials } from "../api/queries";

// Fallback selama modul CMS "Testimoni" + model `Testimonial` belum tersedia.
const FALLBACK: Testimonial[] = [
  {
    id: "ts1",
    photoUrl: null,
    quote:
      "Tujuan HMI adalah mempertahankan Negara Republik Indonesia dan mempertinggi derajat rakyat Indonesia, serta menegakkan dan mengembangkan ajaran agama Islam.",
    name: "Prof. Drs. H. Lafran Pane",
    title: "Pemrakarsa Berdirinya HMI / Pahlawan Nasional",
  },
  {
    id: "ts2",
    photoUrl: null,
    quote:
      "HMI harus senantiasa menjadi rahim yang melahirkan intelektual-intelektual muslim yang memiliki wawasan kebangsaan yang utuh.",
    name: "Nurcholish Madjid",
    title: "Tokoh Pemikir Islam / Alumni HMI",
  },
  {
    id: "ts3",
    photoUrl: null,
    quote:
      "HMI bukan sekadar organisasi, melainkan laboratorium kepemimpinan dan kebangsaan bagi mahasiswa Islam.",
    name: "Alumni HMI",
    title: "Cendekiawan",
  },
  {
    id: "ts4",
    photoUrl: null,
    quote:
      "Yakin, Usaha, Sampai — semangat itu yang menempa kader HMI menjadi pribadi yang tangguh dan berintegritas.",
    name: "Pengurus Cabang",
    title: "HMI Cabang Semarang",
  },
];

export async function HomeTestimonials() {
  const data = await getTestimonials();
  const testimonials: Testimonial[] =
    data.length > 0
      ? data.map((t) => ({
          ...t,
          photoUrl: t.photoUrl ? getOptimizedUrl(t.photoUrl) : null,
        }))
      : FALLBACK;

  return (
    <Section className="bg-emerald-50/60">
      <div className="mx-auto max-w-7xl px-4">
        <FadeIn>
          <SectionHeaderCenter
            eyebrow="Kata Mereka"
            heading="Apa Kata Mereka Tentang HMI?"
            subheading="Pandangan, pengalaman, dan inspirasi dari berbagai tokoh mengenai HMI sebagai organisasi kader, intelektual, dan pengabdian."
          />
        </FadeIn>
      </div>

      <FadeIn delay={150} className="mt-10">
        <TestimonialCarousel testimonials={testimonials} />
      </FadeIn>
    </Section>
  );
}
