'use client'

import { useEffect } from 'react'
import { AlertCircle } from 'lucide-react'
import { EmptyState } from '@/shared/ui/EmptyState'
import { Button } from '@/shared/ui/Button'

export default function ErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    // Log the error
    console.error('App Fatal Error:', error)
  }, [error])

  return (
    <div className="flex h-[100vh] w-full items-center justify-center p-4 bg-background">
      <EmptyState
        icon={<AlertCircle className="h-12 w-12 text-destructive" />}
        title="Terjadi Kesalahan Sistem (500)"
        description="Sistem kami menghadapi gangguan teknis yang tidak terduga. Harap muat ulang halaman ini dalam beberapa saat."
        action={
          <Button onClick={() => reset()} variant="default">
            Coba Muat Ulang
          </Button>
        }
      />
    </div>
  )
}
