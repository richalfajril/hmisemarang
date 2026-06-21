import { prisma } from '@/shared/api/prisma/client'
import { PrismaClient } from '@prisma/client'
import { getUserSession } from '@/shared/api/supabase/server'
import { redirect } from 'next/navigation'
import { VerificationForm } from '@/features/cadre-verification/ui/VerificationForm'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/shared/ui/Card'
import { Badge } from '@/shared/ui/Badge'
import { formatDistanceToNow } from 'date-fns'
import { id as idLocale } from 'date-fns/locale'
import { FileSpreadsheet, FileCheck } from 'lucide-react'
import { PageHeader } from '@/shared/ui/PageHeader'

export default async function CadreVerificationPage() {
  const session = await getUserSession()
  
  if (!session) {
    redirect('/login')
  }

  // Hanya Admin Komisariat yang boleh mengakses halaman ini
  if (session.user.role !== 'ADMIN_KOMISARIAT' || !session.user.commissariatId) {
    redirect('/dashboard')
  }

  const commissariatId = session.user.commissariatId

  // Cek apakah ada submission PENDING
  const pendingVerification = await prisma.cadreVerification.findFirst({
    where: { 
      commissariat_id: commissariatId,
      status: 'PENDING'
    }
  })

  // Ambil riwayat verifikasi sebelumnya (APPROVED atau REJECTED)
  const history = await prisma.cadreVerification.findMany({
    where: { 
      commissariat_id: commissariatId,
      status: { in: ['VERIFIED', 'REJECTED'] }
    },
    orderBy: { created_at: 'desc' },
    take: 5
  })

  // Ambil data profil terbaru untuk mengecek jumlah baris/kader saat ini yang disetujui
  // Ini ada di kolom kader komisariat yang nantinya akan di-sync (MVP: row_count di history VERIFIED terbaru)
  const latestVerified = history.find(h => h.status === 'VERIFIED')

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto w-full">
      <PageHeader
        title="Verifikasi Kader"
        description="Unggah pangkalan data anggota terbaru dalam format Excel untuk diproses oleh Cabang. Angka kader tervalidasi akan ditampilkan di profil publik Anda."
        icon={FileCheck}
      />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-6">
          <VerificationForm hasPending={!!pendingVerification} />

          <Card>
            <CardHeader>
              <CardTitle>Riwayat Unggahan Terakhir</CardTitle>
            </CardHeader>
            <CardContent>
              {history.length === 0 ? (
                <p className="text-sm text-muted-foreground italic text-center py-4">Belum ada riwayat verifikasi.</p>
              ) : (
                <div className="space-y-4">
                  {history.map((item) => (
                    <div key={item.id} className="flex items-center justify-between p-4 border rounded-lg bg-card">
                      <div className="flex items-center gap-4">
                        <div className={`p-2 rounded-full ${item.status === 'VERIFIED' ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}>
                          <FileSpreadsheet className="h-4 w-4" />
                        </div>
                        <div>
                          <p className="font-medium text-sm">
                            {formatDistanceToNow(new Date(item.created_at), { addSuffix: true, locale: idLocale })}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {item.status === 'VERIFIED' ? `Divalidasi: ${item.row_count} kader` : (item.note ? `Ditolak: ${item.note}` : 'Ditolak tanpa catatan')}
                          </p>
                        </div>
                      </div>
                      <Badge variant={item.status === 'VERIFIED' ? 'default' : 'destructive'} className={item.status === 'VERIFIED' ? 'bg-green-500' : ''}>
                        {item.status}
                      </Badge>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <div>
          <Card className="bg-primary text-primary-foreground border-none">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Kader Tervalidasi</CardTitle>
              <CardDescription className="text-primary-foreground/80">Angka saat ini</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-5xl font-black">
                {latestVerified?.row_count || 0}
              </div>
              <p className="text-sm text-primary-foreground/70 mt-2">
                Terakhir diupdate: {latestVerified ? new Date(latestVerified.verified_at || latestVerified.created_at).toLocaleDateString('id-ID') : '-'}
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
