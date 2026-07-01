'use client'

import { useState } from 'react'

import { PengurusCard, type PengurusCardData } from './PengurusCard'
import { TambahPengurusModal, type PengurusInitial } from './TambahPengurusModal'

export type MemberItem = PengurusCardData & {
  position_id: string
  university_id: string | null
  commissariat_id: string | null
}

type Option = { value: string; label: string }

function toInitial(m: MemberItem): PengurusInitial {
  return {
    id: m.id,
    full_name: m.full_name,
    photo_url: m.photo_url,
    short_bio: m.short_bio,
    social_links: m.social_links,
    position_id: m.position_id,
    university_id: m.university_id,
    commissariat_id: m.commissariat_id,
  }
}

export function SusunanKepengurusan({
  ksb,
  kabid,
  lainnya,
  positionOptions,
  universityOptions,
  commissariatOptions,
}: {
  ksb: MemberItem[]
  kabid: MemberItem[]
  lainnya: MemberItem[]
  positionOptions: Option[]
  universityOptions: Option[]
  commissariatOptions: Option[]
}) {
  const [editItem, setEditItem] = useState<MemberItem | null>(null)

  const hasAny = ksb.length + kabid.length + lainnya.length > 0

  return (
    <div className="space-y-4">
      {!hasAny ? (
        <p className="rounded-lg border border-dashed py-10 text-center text-sm text-muted-foreground">
          Belum ada pengurus. Klik &ldquo;Tambah Pengurus&rdquo; untuk mengisi susunan.
        </p>
      ) : (
        <div className="space-y-6">
          {ksb.length > 0 && (
            <section className="space-y-2">
              <h3 className="text-sm font-semibold text-muted-foreground">Ketua, Sekretaris &amp; Bendahara</h3>
              <div className="flex flex-wrap justify-center gap-5">
                {ksb.map((m) => (
                  <div key={m.id} className="w-full max-w-[380px] sm:max-w-none sm:w-[47%] lg:w-[23%]">
                    <PengurusCard member={m} editable onEdit={() => setEditItem(m)} />
                  </div>
                ))}
              </div>
            </section>
          )}

          {kabid.length > 0 && (
            <section className="space-y-2">
              <h3 className="text-sm font-semibold text-muted-foreground">Ketua Bidang</h3>
              <div className="flex flex-wrap justify-center gap-5">
                {kabid.map((m) => (
                  <div key={m.id} className="w-full max-w-[380px] sm:max-w-none sm:w-[47%] lg:w-[23%]">
                    <PengurusCard member={m} editable onEdit={() => setEditItem(m)} />
                  </div>
                ))}
              </div>
            </section>
          )}

          {lainnya.length > 0 && (
            <section className="space-y-2">
              <h3 className="text-sm font-semibold text-muted-foreground">Lainnya</h3>
              <div className="flex flex-wrap justify-center gap-5">
                {lainnya.map((m) => (
                  <div key={m.id} className="w-full max-w-[380px] sm:max-w-none sm:w-[47%] lg:w-[23%]">
                    <PengurusCard member={m} editable onEdit={() => setEditItem(m)} />
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>
      )}


      {editItem && (
        <TambahPengurusModal
          key={editItem.id}
          open={true}
          onOpenChange={(o) => { if (!o) setEditItem(null) }}
          positions={positionOptions}
          universities={universityOptions}
          commissariats={commissariatOptions}
          initial={toInitial(editItem)}
        />
      )}
    </div>
  )
}
