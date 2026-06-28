import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Section } from "@/shared/ui/Section";
import { FadeIn } from "@/shared/ui/FadeIn";
import { SectionHeaderLeft } from "@/shared/ui/SectionHeader";
import { FeaturedCarousel } from "./FeaturedCarousel";
import { getFeaturedArticles } from "../api/queries";

type Article = {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  featured_image_url: string | null;
  published_at: Date | null;
  category: { name: string } | null;
};

const FALLBACK: Article[] = [
  {
    id: "fa1",
    title: "Membumikan Nilai Dasar Perjuangan (NDP) di Era Digital",
    slug: "ndp-era-digital",
    excerpt:
      "Menelaah relevansi teks-teks ideologis HMI dalam menjawab tantangan disrupsi teknologi dan pergeseran paradigma sosial di kalangan generasi Z.",
    featured_image_url: null,
    published_at: new Date("2026-06-15"),
    category: { name: "Kajian NDP" },
  },
  {
    id: "fa2",
    title: "Gagasan Islam Progresif",
    slug: "gagasan-islam-progresif",
    excerpt:
      "Membangun narasi keislaman yang inklusif dan adaptif terhadap kemajuan zaman.",
    featured_image_url: null,
    published_at: new Date("2026-06-10"),
    category: { name: "Kajian" },
  },
  {
    id: "fa3",
    title: "Kaderisasi & Tantangan Zaman",
    slug: "kaderisasi-tantangan-zaman",
    excerpt:
      "Merefleksikan arah pengkaderan HMI di tengah perubahan lanskap sosial dan teknologi.",
    featured_image_url: null,
    published_at: new Date("2026-06-05"),
    category: { name: "Opini" },
  },
  {
    id: "fa4",
    title: "Peran Mahasiswa dalam Advokasi Kebijakan Publik",
    slug: "advokasi-kebijakan-publik",
    excerpt:
      "Menyoroti kontribusi gerakan mahasiswa dalam mengawal kebijakan publik yang berpihak pada rakyat.",
    featured_image_url: null,
    published_at: new Date("2026-05-28"),
    category: { name: "Berita" },
  },
  {
    id: "fa5",
    title: "Refleksi Hari Lahir HMI",
    slug: "refleksi-hari-lahir-hmi",
    excerpt:
      "Meneguhkan kembali komitmen kaderisasi dan pengabdian di momentum milad HMI.",
    featured_image_url: null,
    published_at: new Date("2026-05-20"),
    category: { name: "Opini" },
  },
];

function SecondaryCard({ article }: { article: Article }) {
  const href = `/artikel/${article.slug}`;

  // Image variant
  if (article.featured_image_url) {
    return (
      <Link
        href={href}
        className="group relative flex-1 overflow-hidden rounded-3xl transition-transform duration-300 hover:-translate-y-1"
      >
        <Image
          src={article.featured_image_url}
          alt={article.title}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-105"
          sizes="(min-width: 1024px) 33vw, 100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
        <div className="absolute inset-x-0 bottom-0 p-6">
          <p className="text-lg font-bold leading-snug text-white line-clamp-2">
            {article.title}
          </p>
          <span className="mt-2 inline-flex items-center gap-1.5 text-sm font-semibold text-white">
            Baca Artikel <ArrowRight className="h-4 w-4" />
          </span>
        </div>
      </Link>
    );
  }

  // Solid green variant
  return (
    <Link
      href={href}
      className="group relative flex-1 overflow-hidden rounded-3xl bg-primary p-6 text-primary-foreground transition-all duration-300 hover:-translate-y-1 hover:bg-primary/90"
    >
      <div className="flex h-full flex-col">
        <p className="text-lg font-bold leading-snug line-clamp-2">
          {article.title}
        </p>
        {article.excerpt && (
          <p className="mt-2 text-sm leading-relaxed text-primary-foreground/80 line-clamp-3">
            {article.excerpt}
          </p>
        )}
        <span className="mt-auto inline-flex items-center gap-1.5 pt-4 text-sm font-semibold">
          Baca Artikel <ArrowRight className="h-4 w-4" />
        </span>
      </div>
    </Link>
  );
}

export async function HomeArticles() {
  const data = (await getFeaturedArticles()) as Article[];
  // CMS dulu → lengkapi dengan fallback bila < 5 (slug dedup)
  const slugs = new Set(data.map((a) => a.slug));
  const supplemental = FALLBACK.filter((f) => !slugs.has(f.slug));
  const articles = [...data, ...supplemental].slice(0, 5);

  const carousel = articles.slice(0, 3); // big single-item carousel
  const secondary = articles.slice(3, 5); // 2 stacked cards
  if (carousel.length === 0) return null;

  return (
    <Section className="bg-white">
      <div className="mx-auto max-w-7xl px-4">
        <SectionHeaderLeft
          eyebrow="Artikel"
          heading="Artikel Pilihan"
          subheading="Ikuti berbagai kajian, opini, berita, dan informasi terbaru dari HMI Cabang Semarang."
          cta={{ label: "Jelajahi Artikel", href: "/artikel" }}
        />

        {/* Bento grid */}
        <div className="mt-10 grid gap-6 lg:grid-cols-3">
          {/* Featured single-item carousel */}
          <FadeIn delay={150} className="lg:col-span-2">
            <FeaturedCarousel items={carousel} />
          </FadeIn>

          {/* Secondary stacked */}
          <div className="flex flex-col gap-6">
            {secondary.map((a, i) => (
              <FadeIn key={a.id} delay={300 + i * 150} className="flex flex-1">
                <SecondaryCard article={a} />
              </FadeIn>
            ))}
          </div>
        </div>
      </div>
    </Section>
  );
}
