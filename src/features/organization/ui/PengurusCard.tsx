'use client'

import { useState } from 'react'
import { Button } from '@/shared/ui/Button'
import { Pencil, Trash2, UserRound, MousePointerClick } from 'lucide-react'
import { deleteBoardMemberAction } from '../api/actions'
import { getSocialIcon, type SocialLink } from './social-config'

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
    <div className="group [perspective:1000px] w-full h-full">
      <div
        onClick={() => setFlipped((f) => !f)}
        className={`relative w-full h-full cursor-pointer rounded-xl transition-transform duration-500 [transform-style:preserve-3d] ${flipped ? '[transform:rotateY(180deg)]' : ''}`}
      >
        {/* FRONT — alur normal, menentukan tinggi kartu */}
        <div className="relative flex flex-col h-full rounded-[10px] border bg-card p-3.5 shadow-sm transition-all duration-300 group-hover:border-primary/50 group-hover:shadow-lg [backface-visibility:hidden]">
          <div className="relative aspect-square w-full shrink-0 overflow-hidden rounded-md bg-muted ring-1 ring-inset ring-black/5 dark:ring-white/10">
            {member.photo_url ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={member.photo_url} alt={member.full_name} className="h-full w-full object-cover" />
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
          </div>

          <div className="flex flex-1 flex-col items-center pt-[21px] pb-[21px] text-center">
            <p className="font-bold text-xl leading-tight text-primary dark:text-emerald-400 line-clamp-1" title={member.full_name}>
              {member.full_name}
            </p>
            <div className="mt-1 flex justify-center">
              <p className="font-semibold text-base leading-snug text-foreground/80 line-clamp-2">
                {formatPosition(member.positionName)}
              </p>
            </div>
            <div className="mt-[21px] flex min-h-9 items-center justify-center gap-2.5">
              {member.social_links.map((s, i) => {
                const Icon = getSocialIcon(s.platform)
                return (
                  <a
                    key={i}
                    href={s.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={(e) => e.stopPropagation()}
                    className="flex h-9 w-9 items-center justify-center rounded-full bg-primary text-primary-foreground transition-opacity hover:opacity-80"
                  >
                    <Icon className="h-4 w-4" />
                  </a>
                )
              })}
            </div>
          </div>

          {/* Overlay hover */}
          <div className="pointer-events-none absolute inset-0 z-10 flex items-center justify-center rounded-[10px] bg-emerald-900/80 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
            <span className="flex items-center gap-1.5 text-sm font-medium text-white">
              <MousePointerClick className="h-4 w-4" />
              Klik untuk melihat biodata
            </span>
          </div>
        </div>

        {/* BACK — overlay menutupi tinggi front */}
        <div className="absolute inset-0 flex flex-col justify-center gap-3 overflow-hidden rounded-[10px] border bg-card p-3.5 text-center shadow-sm transition-all duration-300 group-hover:border-primary/50 group-hover:shadow-lg [backface-visibility:hidden] [transform:rotateY(180deg)]">
          <p className="font-bold text-primary">{member.full_name}</p>
          {member.short_bio ? (
            <p className="text-xs text-muted-foreground italic line-clamp-4">&ldquo;{member.short_bio}&rdquo;</p>
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
