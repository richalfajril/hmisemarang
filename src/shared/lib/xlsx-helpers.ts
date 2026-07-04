// Helper murni untuk parsing baris Excel (dipakai import komisariat/pengurus/universitas).

/** Normalisasi nama header: lowercase, buang spasi/underscore/titik. */
export function normHeader(s: string): string {
  return s.toLowerCase().replace(/[\s_.]+/g, '')
}

/** Ambil nilai kolom pertama yang cocok (header dinormalisasi). '' bila kosong. */
export function pickField(row: Record<string, unknown>, ...keys: string[]): string {
  const map = new Map(Object.keys(row).map((k) => [normHeader(k), row[k]]))
  for (const k of keys) {
    const v = map.get(normHeader(k))
    if (v != null && String(v).trim()) return String(v).trim()
  }
  return ''
}
