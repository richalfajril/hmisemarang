import { NextResponse } from 'next/server'
import { prisma } from '@/shared/api/prisma/client'

// Prisma butuh Node runtime; jangan di-cache.
export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

/**
 * Keep-alive: query ringan ke DB agar proyek Supabase free-tier tidak auto-pause
 * (pause setelah ~7 hari idle). Dipicu Vercel Cron tiap 3 hari (lihat vercel.json).
 */
export async function GET(req: Request) {
  // Bila CRON_SECRET di-set di env, Vercel Cron mengirim header ini otomatis.
  const secret = process.env.CRON_SECRET
  if (secret) {
    const auth = req.headers.get('authorization')
    if (auth !== `Bearer ${secret}`) {
      return NextResponse.json({ ok: false, error: 'Unauthorized' }, { status: 401 })
    }
  }

  try {
    await prisma.$queryRaw`SELECT 1`
    return NextResponse.json({ ok: true, ts: new Date().toISOString() })
  } catch (e) {
    return NextResponse.json({ ok: false, error: (e as Error).message }, { status: 500 })
  }
}
