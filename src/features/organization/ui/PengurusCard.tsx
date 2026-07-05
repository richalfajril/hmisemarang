'use client'

import { useState } from 'react'
import { Button } from '@/shared/ui/Button'
import { Pencil, Trash2, UserRound, MousePointerClick } from 'lucide-react'
import { deleteBoardMemberAction } from '../api/actions'
import { getSocialIcon, FORM_SOCIAL_PLATFORMS, type SocialLink } from './social-config'

// "Ketua Bidang X" → baris 1 "Ketua Bidang", baris 2 "X"
function formatPosition(name: string): React.ReactNode {
  const m = name.match(/^(Ketua Bidang)\s+(.+)$/i)
  if (m) {
    return (
      <>
        {m[1]}
        <br />
        {m[2]}
      </>
    )
  }
  return name
}

export type PengurusCardData = {
  id: string
  full_name: string
  photo_url: string | null
  short_bio: string | null
  social_links: SocialLink[]
  positionName: string
  universityName: string | null
  commissariatName: string | null
}

export function PengurusCard({
  member,
  editable = false,
  onEdit,
}: {
  member: PengurusCardData
  editable?: boolean
  onEdit?: (member: PengurusCardData) => void
}) {
  const [flipped, setFlipped] = useState(false)

  return (
    <div className="group h-full w-full transition-transform duration-300 ease-out [perspective:1000px] hover:-translate-y-2 hover:scale-[1.015]">
      <div
        className={`relative w-full h-full rounded-xl transition-transform duration-500 [transform-style:preserve-3d] ${flipped ? '[transform:rotateY(180deg)]' : ''}`}
      >
        {/* FRONT — alur normal, menentukan tinggi kartu */}
        <div className="relative flex flex-col h-full rounded-[10px] border bg-card p-3.5 shadow-[0_12px_28px_-10px_rgba(6,78,59,0.20)] transition-all duration-300 group-hover:border-primary/50 group-hover:shadow-[0_30px_50px_-14px_rgba(6,78,59,0.32)] [backface-visibility:hidden]">
          <div
            onClick={() => setFlipped(true)}
            className="group/photo relative aspect-square w-full shrink-0 cursor-pointer overflow-hidden rounded-md bg-muted ring-1 ring-inset ring-black/5 dark:ring-white/10"
          >
            {member.photo_url ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={member.photo_url} alt={`${member.full_name} — ${member.positionName}`} className="h-full w-full object-cover" />
            ) : (
              <div className="flex h-full w-full items-center justify-center text-muted-foreground">
                <UserRound className="h-12 w-12" />
              </div>
            )}

            {editable && (
              <div className="absolute right-2 top-2 z-20 flex gap-1">
                <Button
                  type="button"
                  size="icon"
                  variant="secondary"
                  className="h-7 w-7 shadow"
                  onClick={(e) => { e.stopPropagation(); onEdit?.(member) }}
                >
                  <Pencil className="h-3.5 w-3.5" />
                </Button>
                <form action={async (formData) => { await deleteBoardMemberAction(null, formData) }}>
                  <input type="hidden" name="id" value={member.id} />
                  <Button
                    type="submit"
                    size="icon"
                    variant="destructive"
                    className="h-7 w-7 shadow"
                    onClick={(e) => { e.stopPropagation(); if (!confirm(`Hapus pengurus "${member.full_name}"?`)) e.preventDefault() }}
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </Button>
                </form>
              </div>
            )}

            {/* Hint flip — hanya di area gambar */}
            <div className="pointer-events-none absolute inset-0 z-10 flex items-center justify-center bg-emerald-900/80 opacity-0 transition-opacity duration-300 group-hover/photo:opacity-100">
              <span className="flex items-center gap-1.5 text-sm font-medium text-white">
                <MousePointerClick className="h-4 w-4" />
                Lihat biodata
              </span>
            </div>
          </div>

          <div className="flex flex-1 flex-col items-center pt-[21px] pb-[21px] text-center">
            <p className="font-semibold text-base leading-tight text-primary dark:text-emerald-400 line-clamp-1" title={member.full_name}>
              {member.full_name}
            </p>
            <div className="mt-1 flex justify-center">
              <p className="min-h-[4.125em] font-semibold text-sm leading-snug text-foreground/80 line-clamp-3">
                {formatPosition(member.positionName)}
              </p>
            </div>
            <div className="mt-[21px] flex min-h-9 items-center justify-center gap-2.5">
              {FORM_SOCIAL_PLATFORMS.map(({ value }) => {
                const Icon = getSocialIcon(value)
                const url = member.social_links.find((s) => s.platform === value)?.url
                // Selalu tampil 4 ikon; yang tanpa link jadi non-aktif (muted).
                return url ? (
                  <a
                    key={value}
                    href={url}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={(e) => e.stopPropagation()}
                    className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/10 text-primary transition-colors hover:bg-primary hover:text-primary-foreground"
                  >
                    <Icon className="h-4 w-4" />
                  </a>
                ) : (
                  <span
                    key={value}
                    aria-disabled="true"
                    className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/10 text-primary opacity-50"
                  >
                    <Icon className="h-4 w-4" />
                  </span>
                )
              })}
            </div>
          </div>

        </div>

        {/* BACK — klik di mana saja untuk balik ke depan */}
        <div
          onClick={() => setFlipped(false)}
          className="absolute inset-0 flex cursor-pointer flex-col justify-center gap-3 overflow-y-auto rounded-[10px] border bg-card p-3.5 text-center shadow-[0_12px_28px_-10px_rgba(6,78,59,0.20)] transition-all duration-300 group-hover:border-primary/50 group-hover:shadow-[0_30px_50px_-14px_rgba(6,78,59,0.32)] [backface-visibility:hidden] [transform:rotateY(180deg)]"
        >
          <p className="font-bold text-primary">{member.full_name}</p>
          {member.short_bio ? (
            <p className="text-xs text-muted-foreground italic">&ldquo;{member.short_bio}&rdquo;</p>
          ) : (
            <p className="text-xs text-muted-foreground/60 italic">Belum ada bio.</p>
          )}
          <div className="space-y-1 border-t pt-3 text-xs">
            <p><span className="text-muted-foreground">Kampus:</span> {member.universityName || '-'}</p>
            <p><span className="text-muted-foreground">Komisariat:</span> {member.commissariatName || '-'}</p>
          </div>
        </div>
      </div>
    </div>
  )
}
