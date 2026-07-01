'use client'

import { useState } from 'react'
import { Button } from '@/shared/ui/Button'
import { UserPlus } from 'lucide-react'
import { TambahPengurusModal } from './TambahPengurusModal'

type Option = { value: string; label: string }

export function TambahPengurusAction({
  positions,
  universities,
  commissariats,
  disabled,
}: {
  positions: Option[]
  universities: Option[]
  commissariats: Option[]
  disabled?: boolean
}) {
  const [open, setOpen] = useState(false)

  return (
    <>
      <Button
        onClick={() => setOpen(true)}
        disabled={disabled}
        title={disabled ? 'Tambahkan jabatan dulu' : undefined}
      >
        <UserPlus className="mr-2 h-4 w-4" />
        Tambah Pengurus
      </Button>

      {open && (
        <TambahPengurusModal
          open={open}
          onOpenChange={setOpen}
          positions={positions}
          universities={universities}
          commissariats={commissariats}
        />
      )}
    </>
  )
}
