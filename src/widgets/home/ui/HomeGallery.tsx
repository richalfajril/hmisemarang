import { getOptimizedUrl } from "@/shared/lib/cloudinary-upload";
import { FadeIn } from "@/shared/ui/FadeIn";
import { Section } from "@/shared/ui/Section";
import { SectionHeaderCenter } from "@/shared/ui/SectionHeader";
import { getGalleryAlbums } from "../api/queries";
import { CircularGallery, type GalleryAlbum } from "./CircularGallery";

// Fallback (coverImageUrl "" → placeholder gradien) selama CMS belum cukup album.
const FALLBACK: GalleryAlbum[] = [
  {
    id: "gl1",
    title: "Latihan Kader & Kaderisasi",
    slug: "kaderisasi",
    coverImageUrl: "",
  },
  {
    id: "gl2",
    title: "Diskusi & Kajian Ilmiah",
    slug: "diskusi",
    coverImageUrl: "",
  },
  {
    id: "gl3",
    title: "Pengabdian Masyarakat",
    slug: "pengabdian",
    coverImageUrl: "",
  },
  { id: "gl4", title: "Aksi & Advokasi", slug: "aksi", coverImageUrl: "" },
  { id: "gl5", title: "Milad & Kebersamaan", slug: "milad", coverImageUrl: "" },
  {
    id: "gl6",
    title: "Kolaborasi & Kemitraan",
    slug: "kolaborasi",
    coverImageUrl: "",
  },
  {
    id: "gl7",
    title: "Seminar & Lokakarya",
    slug: "seminar",
    coverImageUrl: "",
  },
  { id: "gl8", title: "Bakti Sosial", slug: "bakti-sosial", coverImageUrl: "" },
  {
    id: "gl9",
    title: "Rapat Kerja Cabang",
    slug: "rapat-kerja",
    coverImageUrl: "",
  },
  {
    id: "gl10",
    title: "Pelantikan Pengurus",
    slug: "pelantikan",
    coverImageUrl: "",
  },
  {
    id: "gl11",
    title: "Olahraga & Keakraban",
    slug: "olahraga",
    coverImageUrl: "",
  },
];

const MIN_ALBUMS = 11; // banyak card → jarak antar card lebih rapat di lingkaran

export async function HomeGallery() {
  const data = await getGalleryAlbums();
  const cmsAlbums: GalleryAlbum[] = data.map((a) => ({
    id: a.id,
    title: a.title,
    slug: a.slug,
    coverImageUrl: a.cover_image_url ? getOptimizedUrl(a.cover_image_url) : "",
  }));

  const slugs = new Set(cmsAlbums.map((a) => a.slug));
  const supplemental = FALLBACK.filter((f) => !slugs.has(f.slug));
  const albums =
    cmsAlbums.length >= MIN_ALBUMS
      ? cmsAlbums
      : [...cmsAlbums, ...supplemental].slice(
          0,
          Math.max(MIN_ALBUMS, cmsAlbums.length),
        );

  return (
    <Section className="bg-white" pattern={false}>
      <div className="mx-auto max-w-7xl px-4">
        <FadeIn>
          <SectionHeaderCenter
            eyebrow="Galeri"
            heading="Dokumentasi Kegiatan"
            subheading="Lihat berbagai dokumentasi kegiatan HMI Cabang Semarang yang mencerminkan semangat kaderisasi, pengabdian, kolaborasi, dan perjalanan organisasi."
          />
        </FadeIn>

        {/* Circular Gallery 3D */}
        <FadeIn delay={150} className="mt-8 h-[460px] sm:h-[520px]">
          <CircularGallery albums={albums} href="/galeri" />
        </FadeIn>
      </div>
    </Section>
  );
}
