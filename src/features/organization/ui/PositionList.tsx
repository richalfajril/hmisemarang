'use client'

import { useActionState, useState } from 'react'
import { createPositionAction, createBoardMemberAction, deletePositionAction, deleteBoardMemberAction } from '../api/actions'
import { initialActionState } from '@/shared/lib/action-state'
import { Button } from '@/shared/ui/Button'
import { Input } from '@/shared/ui/Input'
import { Card, CardHeader, CardTitle, CardContent } from '@/shared/ui/Card'
import { Separator } from '@/shared/ui/Separator'
import { PlusCircle, Trash2, UserPlus, Loader2 } from 'lucide-react'

// Sederhanakan Tipe
type Member = { id: string, full_name: string, photo_url: string | null, short_bio: string | null }
type Position = { id: string, name: string, sort_order: number, layout_type: string | null, members: Member[] }

export function PositionList({ periodId, positions }: { periodId: string, positions: Position[] }) {
  const [posState, posFormAction, isPosPending] = useActionState(createPositionAction, initialActionState)
  const [memState, memFormAction, isMemPending] = useActionState(createBoardMemberAction, initialActionState)
  
  return (
    <div className="space-y-8">
      {/* Form Tambah Jabatan */}
      <Card className="bg-muted/30">
        <CardContent className="pt-6">
          <form action={posFormAction} className="flex flex-col sm:flex-row gap-4 items-end">
            <input type="hidden" name="period_id" value={periodId} />
            <div className="flex-1 space-y-2 w-full">
              <label htmlFor="name" className="text-sm font-medium">Nama Jabatan Baru</label>
              <Input id="name" name="name" placeholder="Cth: Ketua Umum, Sekretaris Jenderal" required disabled={isPosPending} />
            </div>
            <div className="w-full sm:w-32 space-y-2">
              <label htmlFor="sort_order" className="text-sm font-medium">No. Urut</label>
              <Input id="sort_order" name="sort_order" type="number" defaultValue={positions.length + 1} required disabled={isPosPending} />
            </div>
            <Button type="submit" disabled={isPosPending} className="w-full sm:w-auto">
              {isPosPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <PlusCircle className="mr-2 h-4 w-4" />}
              Tambah Jabatan
            </Button>
          </form>
          {posState?.message && !posState.success && (
            <p className="text-sm text-destructive mt-2">{posState.message}</p>
          )}
        </CardContent>
      </Card>

      {/* Daftar Jabatan */}
      <div className="space-y-6">
        {positions.map(pos => (
          <Card key={pos.id}>
            <CardHeader className="flex flex-row items-center justify-between py-4 bg-muted/10">
              <CardTitle className="text-lg flex items-center gap-2">
                <span className="bg-primary/10 text-primary text-xs w-6 h-6 rounded-full flex items-center justify-center">{pos.sort_order}</span>
                {pos.name}
              </CardTitle>
              <form action={async (formData) => { await deletePositionAction(null, formData); }}>
                <input type="hidden" name="id" value={pos.id} />
                <Button variant="ghost" size="icon" type="submit" className="text-destructive hover:bg-destructive/10"><Trash2 className="h-4 w-4" /></Button>
              </form>
            </CardHeader>
            <Separator />
            <CardContent className="pt-6">
              {/* Form Tambah Anggota */}
              <form action={memFormAction} className="flex gap-4 mb-6">
                <input type="hidden" name="period_id" value={periodId} />
                <input type="hidden" name="position_id" value={pos.id} />
                <Input name="full_name" placeholder="Nama Anggota..." required className="flex-1" />
                <Button type="submit" variant="secondary" size="sm">
                  <UserPlus className="h-4 w-4 mr-2" /> Sisipkan Anggota
                </Button>
              </form>

              {/* Anggota */}
              {pos.members.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {pos.members.map(member => (
                    <div key={member.id} className="flex items-center justify-between p-3 border rounded-md">
                      <div className="flex flex-col">
                        <span className="font-medium text-sm">{member.full_name}</span>
                      </div>
                      <form action={async (formData) => { await deleteBoardMemberAction(null, formData); }}>
                        <input type="hidden" name="id" value={member.id} />
                        <Button variant="ghost" size="icon" type="submit" className="h-8 w-8 text-destructive"><Trash2 className="h-3 w-3" /></Button>
                      </form>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground italic text-center py-4">Belum ada anggota di jabatan ini.</p>
              )}
            </CardContent>
          </Card>
        ))}
        {positions.length === 0 && (
          <p className="text-center text-muted-foreground py-8 border rounded-lg border-dashed">Belum ada jabatan struktural. Silakan tambah jabatan di atas.</p>
        )}
      </div>
    </div>
  )
}
