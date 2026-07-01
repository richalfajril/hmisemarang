import Link from "next/link";
import { prisma } from "@/shared/api/prisma/client";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/shared/ui/Breadcrumb";
import { FadeIn } from "@/shared/ui/FadeIn";
import {
  PublicDocumentTable,
  type PublicDocument,
} from "@/features/documents/ui/PublicDocumentTable";

export const metadata = { title: "Dokumen" };
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
      <div className="mx-auto max-w-7xl px-4 pb-16 pt-24 sm:pt-28">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link href="/">Beranda</Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage className="font-medium text-primary">Dokumen</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        <FadeIn className="mt-8">
          <PublicDocumentTable
            documents={documents}
            categories={categories}
            title="Repositori Dokumen"
            description="Akses dokumen administrasi, surat, dan berkas resmi HMI Cabang Semarang dalam satu tempat."
          />
        </FadeIn>
      </div>
    </div>
  );
}
