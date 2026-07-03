import { test, expect } from '@playwright/test'

// Smoke: tiap halaman publik harus 200, punya <h1>, tanpa error 500.
const routes = [
  '/',
  '/profil',
  '/struktur-organisasi',
  '/artikel',
  '/agenda',
  '/komisariat',
  '/galeri',
  '/dokumen',
  '/kontak',
]

for (const route of routes) {
  test(`publik ${route} termuat`, async ({ page }) => {
    const res = await page.goto(route, { waitUntil: 'domcontentloaded' })
    expect(res, `no response ${route}`).not.toBeNull()
    expect(res!.status(), `status ${route}`).toBeLessThan(400)
    await expect(page.locator('h1').first()).toBeVisible()
  })
}

test('detail artikel yang tidak ada → 404', async ({ page }) => {
  const res = await page.goto('/artikel/slug-yang-pasti-tidak-ada-12345', {
    waitUntil: 'domcontentloaded',
  })
  expect(res!.status()).toBe(404)
})
