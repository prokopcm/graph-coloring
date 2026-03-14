import { expect, test } from '@nuxt/test-utils/playwright'

test('smoke: load the page', async ({ page, goto }) => {
  await goto('/', { waitUntil: 'hydration' })
  await expect(page.getByTestId('project-title')).toHaveText('Coloring, Creative Math, and Computers')
})

test('smoke: basic operations', async ({ page, goto }) => {
  await goto('/', { waitUntil: 'hydration' })
  await expect(page).toHaveScreenshot()
  await page.getByText('Alabama').click()
  await expect(page).toHaveScreenshot()
  await page.locator('.color').first().click()
  await expect(page).toHaveScreenshot()
  await page.locator('#MS').click()
  await expect(page).toHaveScreenshot()
  await page.locator('.color-picker > div:nth-child(2)').click()
  await expect(page).toHaveScreenshot()
  await page.locator('#MS').click()
  await page.locator('.color').first().click()
  await expect(page).toHaveScreenshot()
  await page.getByText('Alabama and Mississippi are').click()
  await expect(page).toHaveScreenshot()
  await page.locator('.color-picker > div:nth-child(2)').click()
  await page.getByRole('button', { name: 'Auto-Color' }).click()
  await expect(page).toHaveScreenshot()
  await page.getByText('Reset').first().click()
  await expect(page).toHaveScreenshot()
})
