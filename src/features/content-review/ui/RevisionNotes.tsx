import { prisma } from '@/shared/api/prisma/client'
import { AlertTriangle } from 'lucide-react'
import { Card, CardContent } from '@/shared/ui/Card'
import { PrismaClient } from '@prisma/client'



interface RevisionNotesProps {
  entityId: string
  entityType: 'ARTICLE' | 'AGENDA' | 'COMMISSARIAT_PROFILE' | 'CADRE_VERIFICATION'
}

export async function RevisionNotes({ entityId, entityType }: RevisionNotesProps) {
  // Ambil riwayat review terakhir yang meminta revisi atau menolak
  const lastReview = await prisma.reviewHistory.findFirst({
    where: {
      entity_id: entityId,
      entity_type: entityType,
      action: {
        in: ['REVISION_REQUESTED', 'REJECTED']
      }
    },
    orderBy: {
      created_at: 'desc'
    }
  })

  if (!lastReview || !lastReview.note) {
    return null
  }

  const isRejected = lastReview.action === 'REJECTED'

  return (
    <Card className={`border-l-4 ${isRejected ? 'border-l-destructive bg-destructive/5' : 'border-l-amber-500 bg-amber-50 dark:bg-amber-950/30'}`}>
      <CardContent className="p-4 flex gap-4">
        <AlertTriangle className={`h-6 w-6 shrink-0 mt-0.5 ${isRejected ? 'text-destructive' : 'text-amber-500'}`} />
        <div className="space-y-1">
          <h4 className={`font-semibold ${isRejected ? 'text-destructive' : 'text-amber-700 dark:text-amber-400'}`}>
            {isRejected ? 'Draf Ditolak' : 'Catatan Revisi dari Cabang'}
          </h4>
          <p className="text-sm text-muted-foreground whitespace-pre-wrap leading-relaxed">
            {lastReview.note}
          </p>
        </div>
      </CardContent>
    </Card>
  )
}
