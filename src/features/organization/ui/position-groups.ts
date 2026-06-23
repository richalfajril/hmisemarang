export const POSITION_GROUPS = ['KSB', 'KETUA_BIDANG', 'LAINNYA'] as const
export type PositionGroup = (typeof POSITION_GROUPS)[number]

export const GROUP_LABELS: Record<PositionGroup, string> = {
  KSB: 'KSB (Inti)',
  KETUA_BIDANG: 'Ketua Bidang',
  LAINNYA: 'Lainnya',
}

export function normalizeGroup(value: string | null | undefined): PositionGroup {
  return (POSITION_GROUPS as readonly string[]).includes(value ?? '') ? (value as PositionGroup) : 'KETUA_BIDANG'
}
