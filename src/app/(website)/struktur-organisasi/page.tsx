import {
  PengurusCard,
  type PengurusCardData,
} from "@/features/organization/ui/PengurusCard";
import {
  normalizeGroup,
  type PositionGroup,
} from "@/features/organization/ui/position-groups";
import type { SocialLink } from "@/features/organization/ui/social-config";
import { prisma } from "@/shared/api/prisma/client";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/shared/ui/Breadcrumb";
import {
  PeriodSelect,
  PeriodArrow,
} from "@/features/organization/ui/PeriodSwitcher";
import { SectionHeaderCenter } from "@/shared/ui/SectionHeader";
import { FadeIn } from "@/shared/ui/FadeIn";
import Link from "next/link";

export const metadata = { title: "Struktur Organisasi" };

function toSocialLinks(value: unknown): SocialLink[] {
  if (!Array.isArray(value)) return [];
  return value
    .filter(
      (s): s is { platform?: unknown; url?: unknown } =>
        !!s && typeof s === "object",
    )
    .filter(
      (s) => typeof s.url === "string" && (s.url as string).trim().length > 0,
    )
    .map((s) => ({
      platform: String(s.platform ?? "website"),
      url: String(s.url),
    }));
}

const GROUP_TITLES: Record<PositionGroup, string> = {
  KSB: "Ketua, Sekretaris & Bendahara",
  KETUA_BIDANG: "Ketua Bidang",
  LAINNYA: "Pengurus Lainnya",
};

async function getAllPeriods() {
  try {
    return await prisma.period.findMany({
      orderBy: { start_year: "desc" },
      select: { id: true, start_year: true, end_year: true, is_active: true },
    });
  } catch {
    return [];
  }
}

async function getOrganizationByPeriod(id: string) {
  try {
    return await prisma.period.findUnique({
      where: { id },
      include: {
        positions: {
          orderBy: { sort_order: "asc" },
          include: {
            members: {
              orderBy: { created_at: "desc" },
              include: { university: true, commissariat: true },
            },
          },
        },
      },
    });
  } catch {
    return null;
  }
}

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ period?: string }>;
}) {
  const { period: periodParam } = await searchParams;
  const periods = await getAllPeriods();
  const selectedId =
    (periodParam && periods.some((p) => p.id === periodParam)
      ? periodParam
      : null) ??
    periods.find((p) => p.is_active)?.id ??
    periods[0]?.id ??
    null;

  const period = selectedId
    ? await getOrganizationByPeriod(selectedId)
    : null;

  const idx = periods.findIndex((p) => p.id === selectedId);
  const olderId = idx >= 0 && idx < periods.length - 1 ? periods[idx + 1].id : null;
  const newerId = idx > 0 ? periods[idx - 1].id : null;

  const groups: Record<PositionGroup, PengurusCardData[]> = {
    KSB: [],
    KETUA_BIDANG: [],
    LAINNYA: [],
  };

  for (const pos of period?.positions ?? []) {
    const group = normalizeGroup(pos.layout_type);
    for (const m of pos.members) {
      groups[group].push({
        id: m.id,
        full_name: m.full_name,
        photo_url: m.photo_url,
        short_bio: m.short_bio,
        social_links: toSocialLinks(m.social_links),
        positionName: pos.name,
        universityName: m.university?.name ?? null,
        commissariatName: m.commissariat?.name ?? null,
      });
    }
  }

  const hasAny =
    groups.KSB.length + groups.KETUA_BIDANG.length + groups.LAINNYA.length > 0;

  return (
    <div className="relative min-h-screen overflow-hidden bg-white">
      <svg
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 h-full w-full text-emerald-900 opacity-[0.035]"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <pattern
            id="struktur-geo"
            x="0"
            y="0"
            width="60"
            height="60"
            patternUnits="userSpaceOnUse"
          >
            <path d="M30 3 L57 30 L30 57 L3 30 Z" fill="none" stroke="currentColor" strokeWidth="1.2" />
            <path d="M30 15 L45 30 L30 45 L15 30 Z" fill="none" stroke="currentColor" strokeWidth="1" />
            <circle cx="0" cy="0" r="1.5" fill="currentColor" />
            <circle cx="60" cy="0" r="1.5" fill="currentColor" />
            <circle cx="0" cy="60" r="1.5" fill="currentColor" />
            <circle cx="60" cy="60" r="1.5" fill="currentColor" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#struktur-geo)" />
      </svg>
      <div className="relative z-10 mx-auto max-w-7xl px-4 pb-14 pt-24 sm:pt-28">
        <div className="flex items-center justify-between gap-4">
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink asChild>
                  <Link href="/">Beranda</Link>
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage className="font-medium text-primary">Struktur Organisasi</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>

          {selectedId && periods.length > 0 && (
            <PeriodSelect periods={periods} selectedId={selectedId} />
          )}
        </div>

        <div className="mt-8 flex items-center justify-center gap-3 sm:gap-6">
          <PeriodArrow targetId={olderId} direction="prev" />
          <SectionHeaderCenter
            className="flex-1"
            eyebrow="Struktur Organisasi"
            heading={
              period
                ? `HMI Cabang Semarang Periode ${period.start_year}-${period.end_year}`
                : "HMI Cabang Semarang"
            }
            subheading="Pengemban amanah kepemimpinan dan kaderisasi cabang."
          />
          <PeriodArrow targetId={newerId} direction="next" />
        </div>

        {!hasAny ? (
          <p className="mt-12 mb-12 rounded-lg border border-dashed py-16 text-center text-sm text-muted-foreground">
            Belum ada data kepengurusan.
          </p>
        ) : (
          <div className="mt-12 mb-12 space-y-12">
            {(Object.keys(groups) as PositionGroup[]).map((g) =>
              groups[g].length === 0 ? null : (
                <section key={g} className="space-y-6">
                  <h3 className="text-center text-lg font-bold text-foreground sm:text-xl">
                    {GROUP_TITLES[g]}
                  </h3>
                  <div className="flex flex-wrap justify-center gap-5">
                    {groups[g].map((m, i) => (
                      <FadeIn
                        key={m.id}
                        delay={Math.floor(i / 4) * 120}
                        className="w-full max-w-[380px] sm:w-[47%] sm:max-w-none lg:w-[23%]"
                      >
                        <PengurusCard member={m} />
                      </FadeIn>
                    ))}
                  </div>
                </section>
              ),
            )}
          </div>
        )}
      </div>
    </div>
  );
}
