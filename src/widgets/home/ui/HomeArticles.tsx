import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { AnimatedSection } from "@/shared/ui/AnimatedSection";
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

const dateFmt = new Intl.DateTimeFormat("id-ID", {
  day: "numeric",
  month: "long",
  year: "numeric",
});

function formatMeta(a: Article) {
  const parts: string[] = [];
  if (a.category?.name) parts.push(a.category.name);
  if (a.published_at) parts.push(dateFmt.format(a.published_at));
  return parts.join(" • ");
}

/**
 * Secondary article card: image background. `tinted` adds an emerald layer over
 * the image (top card); otherwise a dark gradient (bottom card). Content
 * (metadata, title, excerpt, CTA) sits in a glassmorphism panel at the bottom.
 */
function SecondaryCard({
  article,
  tinted,
}: {
  article: Article;
  tinted?: boolean;
}) {
  return (
    <Link
      href={`/artikel/${article.slug}`}
      className="group relative min-h-[18rem] flex-1 overflow-hidden rounded-3xl bg-emerald-900 transition-transform duration-300 hover:-translate-y-1"
    >
      {article.featured_image_url && (
        <Image
          src={article.featured_image_url}
          alt={article.title}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-105"
          sizes="(min-width: 1024px) 33vw, 100vw"
        />
      )}

      {/* Overlay: green layer (tinted) atau gradient gelap */}
      {tinted ? (
        <div className="absolute inset-0 bg-primary/80" />
      ) : (
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
      )}

      {/* Content — glassmorphism panel di bawah */}
      <div className="absolute inset-x-0 bottom-0 p-4">
        <div className="rounded-2xl border border-white/20 bg-white/10 p-5 shadow-2xl backdrop-blur-md">
          <p className="text-[11px] font-semibold uppercase tracking-widest text-emerald-200">
            {formatMeta(article)}
          </p>
          <p className="mt-2 text-lg font-bold leading-snug text-white line-clamp-1">
            {article.title}
          </p>
          {article.excerpt && (
            <p className="mt-1.5 text-sm leading-relaxed text-white/85 line-clamp-2">
              {article.excerpt}
            </p>
          )}
          <span className="mt-3 inline-flex items-center gap-1.5 text-sm font-semibold text-white">
            Baca Artikel <ArrowRight className="h-4 w-4" />
          </span>
        </div>
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
    <AnimatedSection className="bg-white" pattern={false}>
      <FadeIn>
        <SectionHeaderLeft
          eyebrow="Artikel"
          heading="Artikel Pilihan"
          subheading="Ikuti berbagai kajian, opini, berita, dan informasi terbaru dari HMI Cabang Semarang."
          cta={{ label: "Jelajahi Artikel", href: "/artikel" }}
        />
      </FadeIn>

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
              <SecondaryCard article={a} tinted={i === 0} />
            </FadeIn>
          ))}
        </div>
      </div>
    </AnimatedSection>
  );
}
