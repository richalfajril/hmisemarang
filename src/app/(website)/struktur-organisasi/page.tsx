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
  PeriodSelect,
  PeriodArrow,
} from "@/features/organization/ui/PeriodSwitcher";
import { PageHero } from "@/shared/ui/PageHero";
import { FadeIn } from "@/shared/ui/FadeIn";

export const metadata = { title: "Struktur Organisasi", description: "Susunan pengurus HMI Cabang Semarang (HMI Semarang) — pengemban amanah kepemimpinan dan kaderisasi." };

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
    <div className="min-h-screen bg-white">
      <PageHero
        breadcrumb={[{ label: "Beranda", href: "/" }, { label: "Struktur Organisasi" }]}
        eyebrow="Struktur Organisasi"
        heading={
          period
            ? `HMI Cabang Semarang Periode ${period.start_year}-${period.end_year}`
            : "HMI Cabang Semarang"
        }
        subheading="Pengemban amanah kepemimpinan dan kaderisasi cabang."
      >
        {selectedId && periods.length > 0 && (
          <div className="flex items-center gap-3">
            <PeriodArrow targetId={olderId} direction="prev" />
            <PeriodSelect periods={periods} selectedId={selectedId} />
            <PeriodArrow targetId={newerId} direction="next" />
          </div>
        )}
      </PageHero>

      <div className="mx-auto max-w-7xl px-5 py-14">
        {!hasAny ? (
          <p className="rounded-lg border border-dashed py-16 text-center text-sm text-muted-foreground">
            Belum ada data kepengurusan.
          </p>
        ) : (
          <div className="space-y-12">
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
