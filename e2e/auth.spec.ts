import { test, expect } from '@playwright/test'

const user = process.env.E2E_ADMIN_USER
const pass = process.env.E2E_ADMIN_PASS

test('akses /dashboard tanpa login → redirect /login', async ({ page }) => {
  await page.goto('/dashboard')
  await expect(page).toHaveURL(/\/login/)
})

test('login valid → masuk dashboard', async ({ page }) => {
  test.skip(!user || !pass, 'E2E_ADMIN_USER / E2E_ADMIN_PASS belum di-set di .env')
  await page.goto('/login')
  await page.fill('#username', user!)
  await page.fill('#password', pass!)
  await page.getByRole('button', { name: /masuk/i }).click()
  await expect(page).toHaveURL(/\/dashboard/, { timeout: 15_000 })
})

test('login salah → tetap di /login + pesan error', async ({ page }) => {
  await page.goto('/login')
  await page.fill('#username', 'user-tidak-ada-xyz')
  await page.fill('#password', 'salah-banget')
  await page.getByRole('button', { name: /masuk/i }).click()
  await expect(page).toHaveURL(/\/login/)
})
