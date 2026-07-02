import { getOptimizedUrl } from "@/shared/lib/cloudinary-upload";
import { FadeIn } from "@/shared/ui/FadeIn";
import { Section } from "@/shared/ui/Section";
import { SectionHeaderCenter } from "@/shared/ui/SectionHeader";
import { getGalleryAlbums } from "../api/queries";
import { CircularGallery, type GalleryAlbum } from "./CircularGallery";

// Fallback (coverImageUrl "" → placeholder gradien) selama CMS belum cukup album.
const U = (id: string) => `https://images.unsplash.com/photo-${id}?w=800&q=80`;

const FALLBACK: GalleryAlbum[] = [
  { id: "gl1", title: "Latihan Kader & Kaderisasi", slug: "kaderisasi", coverImageUrl: U("1511578314322-379afb476865") },
  { id: "gl2", title: "Diskusi & Kajian Ilmiah", slug: "diskusi", coverImageUrl: U("1523240795612-9a054b0db644") },
  { id: "gl3", title: "Pengabdian Masyarakat", slug: "pengabdian", coverImageUrl: U("1544928147-79a2dbc1f389") },
  { id: "gl4", title: "Aksi & Advokasi", slug: "aksi", coverImageUrl: U("1540575467063-178a50c2df87") },
  { id: "gl5", title: "Milad & Kebersamaan", slug: "milad", coverImageUrl: U("1475721027785-f74eccf877e2") },
  { id: "gl6", title: "Kolaborasi & Kemitraan", slug: "kolaborasi", coverImageUrl: U("1552664730-d307ca884978") },
  { id: "gl7", title: "Seminar & Lokakarya", slug: "seminar", coverImageUrl: U("1517486808906-6ca8b3f04846") },
  { id: "gl8", title: "Bakti Sosial", slug: "bakti-sosial", coverImageUrl: U("1531482615713-2afd69097998") },
  { id: "gl9", title: "Rapat Kerja Cabang", slug: "rapat-kerja", coverImageUrl: U("1486870591958-9b9d0d1dda99") },
  { id: "gl10", title: "Pelantikan Pengurus", slug: "pelantikan", coverImageUrl: U("1507525428034-b723cf961d3e") },
  { id: "gl11", title: "Olahraga & Keakraban", slug: "olahraga", coverImageUrl: U("1441974231531-c6227db76b6e") },
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
