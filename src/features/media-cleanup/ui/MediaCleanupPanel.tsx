'use client'

import { useState, useTransition } from 'react'
import Image from 'next/image'
import { ScanSearch, Loader2, AlertTriangle, CheckCircle2, Info } from 'lucide-react'
import { Button } from '@/shared/ui/Button'
import { toast } from 'sonner'
import { scanOrphanMediaAction, type OrphanReport } from '../api/actions'

function fmtBytes(b: number) {
  if (!b) return '0 B'
  const k = 1024
  const s = ['B', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(b) / Math.log(k))
  return `${parseFloat((b / Math.pow(k, i)).toFixed(1))} ${s[i]}`
}

export function MediaCleanupPanel() {
  const [report, setReport] = useState<OrphanReport | null>(null)
  const [pending, start] = useTransition()

  const scan = () =>
    start(async () => {
      const r = await scanOrphanMediaAction()
      if (!r.ok) toast.error(r.message ?? 'Scan gagal.')
      setReport(r)
    })

  return (
    <div className="space-y-6">
      {/* Info read-only */}
      <div className="flex items-start gap-3 rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800 dark:border-amber-900 dark:bg-amber-950/30 dark:text-amber-300">
        <Info className="mt-0.5 h-4 w-4 shrink-0" />
        <p>
          Mode <strong>read-only</strong>: panel ini hanya <strong>mendeteksi</strong> media Cloudinary yang tidak
          lagi direferensikan data (yatim). Tombol hapus sengaja belum diaktifkan demi keamanan — verifikasi
          manual dulu. Aset yang lebih baru dari 7 hari otomatis dilewati.
        </p>
      </div>

      <Button onClick={scan} disabled={pending}>
        {pending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <ScanSearch className="mr-2 h-4 w-4" />}
        {pending ? 'Memindai…' : 'Mulai Scan'}
      </Button>

      {report?.ok && (
        <div className="space-y-4">
          {/* Ringkasan */}
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
            {[
              { label: 'Total Aset', value: report.totalAssets },
              { label: 'Terpakai', value: report.referenced },
              { label: 'Yatim', value: report.orphans.length },
              { label: 'Bisa Dihemat', value: fmtBytes(report.orphanBytes) },
            ].map((s) => (
              <div key={s.label} className="rounded-xl border bg-card p-4">
                <p className="text-xs text-muted-foreground">{s.label}</p>
                <p className="mt-1 text-xl font-bold text-foreground">{s.value}</p>
              </div>
            ))}
          </div>

          {report.skippedRecent > 0 && (
            <p className="text-xs text-muted-foreground">
              {report.skippedRecent} aset dilewati karena diunggah &lt; 7 hari.
            </p>
          )}

          {report.orphans.length === 0 ? (
            <div className="flex items-center gap-2 rounded-xl border border-green-200 bg-green-50 p-4 text-sm text-green-800 dark:border-green-900 dark:bg-green-950/30 dark:text-green-400">
              <CheckCircle2 className="h-4 w-4 shrink-0" /> Tidak ada media yatim. Bersih! 🎉
            </div>
          ) : (
            <>
              <div className="flex items-center gap-2 text-sm font-medium text-amber-700">
                <AlertTriangle className="h-4 w-4" /> {report.orphans.length} media yatim terdeteksi
              </div>
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
                {report.orphans.map((o) => (
                  <div key={o.public_id} className="overflow-hidden rounded-xl border">
                    <div className="relative aspect-square bg-muted">
                      <Image src={o.secure_url} alt={o.public_id} fill className="object-cover" sizes="200px" unoptimized />
                    </div>
                    <div className="p-2">
                      <p className="truncate text-xs font-medium text-foreground" title={o.public_id}>{o.public_id}</p>
                      <p className="text-[11px] text-muted-foreground">{fmtBytes(o.bytes)}</p>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      )}
    </div>
  )
}
