// Self-check helper import pengurus. Jalankan: npx tsx src/features/organization/api/import-helpers.check.ts
import assert from 'node:assert'
import { normHeader, pickField, buildSocialLinks } from './import-helpers'

// Header apa adanya dari template user (ada spasi/underscore/titik).
const row = {
  'No.': 1,
  'Foto_URL': 'https://x/y.jpg',
  'Nama_Lengkap ': 'Budi Santoso',
  'Jabatan': 'Ketua Umum',
  'Asal_Komisariat': 'Komisariat UNDIP',
  'Asal_Kampus': 'Universitas Diponegoro',
  'Bio': 'Kader aktif',
  'URL_Instagram': ' https://ig/budi ',
  'URL_TikTok': '',
  'URL_X': 'https://x.com/budi',
  'URL_Linkedin': '',
}

assert.equal(normHeader('Nama_Lengkap '), 'namalengkap')
assert.equal(normHeader('No.'), 'no')
assert.equal(normHeader('URL_Instagram'), 'urlinstagram')

// pickField: cocok lintas variasi header + trim.
assert.equal(pickField(row, 'nama_lengkap', 'nama'), 'Budi Santoso')
assert.equal(pickField(row, 'jabatan'), 'Ketua Umum')
assert.equal(pickField(row, 'foto_url'), 'https://x/y.jpg')
assert.equal(pickField(row, 'asal_kampus'), 'Universitas Diponegoro')
assert.equal(pickField(row, 'tidak_ada'), '') // kolom hilang → ''

// buildSocialLinks: hanya yang terisi, X→twitter, trim URL.
const links = buildSocialLinks(row)
assert.deepEqual(links, [
  { platform: 'instagram', url: 'https://ig/budi' },
  { platform: 'twitter', url: 'https://x.com/budi' },
])

console.log('import-helpers.check: OK')
