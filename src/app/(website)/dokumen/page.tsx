import { Suspense } from "react";
import { prisma } from "@/shared/api/prisma/client";
import { PageHero } from "@/shared/ui/PageHero";
import { FadeIn } from "@/shared/ui/FadeIn";
import { DocumentSearchBox } from "@/features/documents/ui/DocumentSearchBox";
import {
  PublicDocumentTable,
  type PublicDocument,
} from "@/features/documents/ui/PublicDocumentTable";

export const metadata = { title: "Dokumen", description: "Repositori dokumen resmi HMI Cabang Semarang (HMI Semarang) — surat, berkas administrasi, dan arsip." };
export const revalidate = 300;

async function getPublicDocuments(): Promise<PublicDocument[]> {
  try {
    const docs = await prisma.document.findMany({
      where: { status: "PUBLISHED", deleted_at: null },
      orderBy: { published_at: "desc" },
      select: {
        id: true,
        title: true,
        description: true,
        published_at: true,
        category: { select: { name: true } },
      },
    });
    return docs.map((d) => ({
      id: d.id,
      title: d.title,
      description: d.description,
      published_at: d.published_at,
      categoryName: d.category?.name ?? "Lainnya",
    }));
  } catch {
    return [];
  }
}

export default async function Page() {
  const documents = await getPublicDocuments();
  const categories = [...new Set(documents.map((d) => d.categoryName))].sort();

  return (
    <div className="min-h-screen bg-white">
      <PageHero
        breadcrumb={[{ label: "Beranda", href: "/" }, { label: "Dokumen" }]}
        eyebrow="Dokumen"
        heading="Repositori Dokumen"
        subheading="Akses dokumen administrasi, surat, dan berkas resmi HMI Cabang Semarang dalam satu tempat."
        align="left"
        action={
          <Suspense fallback={null}>
            <DocumentSearchBox />
          </Suspense>
        }
      />

      <div className="mx-auto max-w-7xl px-5 pb-16 pt-14">
        <FadeIn>
          <Suspense fallback={null}>
            <PublicDocumentTable documents={documents} categories={categories} />
          </Suspense>
        </FadeIn>
      </div>
    </div>
  );
}
