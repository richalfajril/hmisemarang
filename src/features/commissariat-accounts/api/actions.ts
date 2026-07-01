'use server'

import * as XLSX from 'xlsx'
import { prisma } from '@/shared/api/prisma/client'
import { createClient } from '@/shared/api/supabase/server'
import { supabaseAdmin } from '@/shared/api/supabase/admin'
import { ActionState } from '@/shared/lib/action-state'
import { revalidatePath } from 'next/cache'

const DEFAULT_PASSWORD = '123456'
const SYNTHETIC_DOMAIN = 'hmisemarang.local'

type ImportResult = {
  created: number
  skipped: { row: number; username: string; reason: string }[]
}

async function authorize() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return null
  const currentUser = await prisma.user.findUnique({ where: { email: user.email } })
  if (!currentUser || (currentUser.role !== 'SYSTEM_ADMIN' && currentUser.role !== 'ADMIN_CABANG')) {
    return null
  }
  return currentUser
}

/** Normalisasi header (lowercase, buang spasi/underscore) → cari nilai kolom. */
function pick(row: Record<string, unknown>, ...keys: string[]): string {
  const norm = (s: string) => s.toLowerCase().replace(/[\s_]+/g, '')
  const map = new Map(Object.keys(row).map((k) => [norm(k), row[k]]))
  for (const k of keys) {
    const v = map.get(norm(k))
    if (v != null && String(v).trim()) return String(v).trim()
  }
  return ''
}

export async function importCommissariatAccountsAction(
  prevState: ActionState | null,
  formData: FormData
): Promise<ActionState<ImportResult>> {
  const actor = await authorize()
  if (!actor) return { success: false, message: 'Akses ditolak.', errorCode: 'UNAUTHORIZED' }

  const file = formData.get('file') as File | null
  if (!file || file.size === 0) {
    return { success: false, message: 'Berkas Excel wajib diunggah.', errorCode: 'VALIDATION_ERROR' }
  }

  let rows: Record<string, unknown>[]
  try {
    const buf = Buffer.from(await file.arrayBuffer())
    const wb = XLSX.read(buf, { type: 'buffer' })
    const sheet = wb.Sheets[wb.SheetNames[0]]
    rows = XLSX.utils.sheet_to_json<Record<string, unknown>>(sheet, { defval: '' })
  } catch {
    return { success: false, message: 'Gagal membaca berkas Excel. Pastikan format .xlsx/.xls valid.', errorCode: 'SERVER_ERROR' }
  }

  if (rows.length === 0) {
    return { success: false, message: 'Berkas kosong / tidak ada baris data.', errorCode: 'VALIDATION_ERROR' }
  }

  // Preload untuk dedup & pencocokan komisariat
  const existingUsernames = new Set(
    (await prisma.user.findMany({ where: { username: { not: null } }, select: { username: true } }))
      .map((u) => (u.username as string).toLowerCase())
  )
  const commissariats = await prisma.commissariat.findMany({ select: { id: true, name: true } })
  const commByName = new Map(commissariats.map((c) => [c.name.trim().toLowerCase(), c.id]))

  const result: ImportResult = { created: 0, skipped: [] }
  const seenInBatch = new Set<string>()

  for (let i = 0; i < rows.length; i++) {
    const rowNo = i + 2 // header di baris 1
    const username = pick(rows[i], 'username').toLowerCase()
    const name = pick(rows[i], 'nama_komisariat', 'namakomisariat', 'nama')

    if (!username) {
      result.skipped.push({ row: rowNo, username: '-', reason: 'Username kosong' })
      continue
    }
    if (!/^[a-z0-9._-]+$/.test(username)) {
      result.skipped.push({ row: rowNo, username, reason: 'Username mengandung karakter tidak valid' })
      continue
    }
    if (existingUsernames.has(username) || seenInBatch.has(username)) {
      result.skipped.push({ row: rowNo, username, reason: 'Username sudah dipakai' })
      continue
    }

    const email = `${username}@${SYNTHETIC_DOMAIN}`
    const commissariat_id = name ? commByName.get(name.trim().toLowerCase()) ?? null : null

    try {
      const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
        email,
        password: DEFAULT_PASSWORD,
        email_confirm: true,
      })
      if (authError || !authData.user) {
        result.skipped.push({ row: rowNo, username, reason: `Auth gagal: ${authError?.message ?? 'tidak diketahui'}` })
        continue
      }
      await prisma.user.create({
        data: {
          id: authData.user.id,
          email,
          username,
          name: name || null,
          role: 'ADMIN_KOMISARIAT',
          commissariat_id,
        },
      })
      seenInBatch.add(username)
      result.created++
    } catch {
      result.skipped.push({ row: rowNo, username, reason: 'Gagal menyimpan ke database' })
    }
  }

  revalidatePath('/dashboard/commissariat-accounts')

  const msg =
    `${result.created} akun dibuat` +
    (result.skipped.length ? `, ${result.skipped.length} dilewati.` : '.')
  return { success: true, message: msg, data: result }
}

/** Tambah satu akun komisariat/LPP manual. Password default 123456. */
export async function createCommissariatAccountAction(
  prevState: ActionState | null,
  formData: FormData
): Promise<ActionState> {
  const actor = await authorize()
  if (!actor) return { success: false, message: 'Akses ditolak.', errorCode: 'UNAUTHORIZED' }

  const name = String(formData.get('name') ?? '').trim()
  const username = String(formData.get('username') ?? '').trim().toLowerCase()
  const commissariat_id = String(formData.get('commissariat_id') ?? '').trim() || null

  if (!name) {
    return { success: false, message: 'Nama wajib diisi.', fieldErrors: { name: ['Wajib diisi'] }, errorCode: 'VALIDATION_ERROR' }
  }
  if (!/^[a-z0-9._-]{3,50}$/.test(username)) {
    return { success: false, message: 'Username tidak valid (3-50, huruf/angka/._-).', fieldErrors: { username: ['Format tidak valid'] }, errorCode: 'VALIDATION_ERROR' }
  }

  const taken = await prisma.user.findUnique({ where: { username } })
  if (taken) {
    return { success: false, message: 'Username sudah dipakai.', fieldErrors: { username: ['Sudah dipakai'] }, errorCode: 'VALIDATION_ERROR' }
  }

  const email = `${username}@${SYNTHETIC_DOMAIN}`
  try {
    const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
      email,
      password: DEFAULT_PASSWORD,
      email_confirm: true,
    })
    if (authError || !authData.user) {
      return { success: false, message: `Auth gagal: ${authError?.message ?? 'tidak diketahui'}`, errorCode: 'SERVER_ERROR' }
    }
    await prisma.user.create({
      data: {
        id: authData.user.id,
        email,
        username,
        name,
        role: 'ADMIN_KOMISARIAT',
        commissariat_id,
      },
    })
    revalidatePath('/dashboard/commissariat-accounts')
    return { success: true, message: `Akun "${username}" dibuat (password: ${DEFAULT_PASSWORD}).` }
  } catch {
    return { success: false, message: 'Gagal menyimpan akun ke database.', errorCode: 'SERVER_ERROR' }
  }
}

/** Reset password akun komisariat/LPP kembali ke default (123456). */
export async function resetCommissariatPasswordAction(
  prevState: ActionState | null,
  formData: FormData
): Promise<ActionState> {
  const actor = await authorize()
  if (!actor) return { success: false, message: 'Akses ditolak.', errorCode: 'UNAUTHORIZED' }

  const id = formData.get('id') as string
  if (!id) return { success: false, message: 'ID tidak valid.', errorCode: 'VALIDATION_ERROR' }

  const target = await prisma.user.findUnique({ where: { id }, select: { role: true } })
  if (!target || target.role !== 'ADMIN_KOMISARIAT') {
    return { success: false, message: 'Akun tidak ditemukan / bukan akun komisariat.', errorCode: 'VALIDATION_ERROR' }
  }

  const { error } = await supabaseAdmin.auth.admin.updateUserById(id, { password: DEFAULT_PASSWORD })
  if (error) return { success: false, message: `Gagal reset: ${error.message}`, errorCode: 'SERVER_ERROR' }
  return { success: true, message: `Password direset ke default (${DEFAULT_PASSWORD}).` }
}

/** Hapus akun komisariat/LPP (Supabase Auth + Prisma). */
export async function deleteCommissariatAccountAction(
  prevState: ActionState | null,
  formData: FormData
): Promise<ActionState> {
  const actor = await authorize()
  if (!actor) return { success: false, message: 'Akses ditolak.', errorCode: 'UNAUTHORIZED' }

  const id = formData.get('id') as string
  if (!id) return { success: false, message: 'ID tidak valid.', errorCode: 'VALIDATION_ERROR' }

  const target = await prisma.user.findUnique({ where: { id }, select: { role: true } })
  if (!target || target.role !== 'ADMIN_KOMISARIAT') {
    return { success: false, message: 'Akun tidak ditemukan / bukan akun komisariat.', errorCode: 'VALIDATION_ERROR' }
  }

  try {
    await supabaseAdmin.auth.admin.deleteUser(id)
    await prisma.user.delete({ where: { id } })
    revalidatePath('/dashboard/commissariat-accounts')
    return { success: true, message: 'Akun berhasil dihapus.' }
  } catch {
    return { success: false, message: 'Gagal menghapus akun.', errorCode: 'SERVER_ERROR' }
  }
}
