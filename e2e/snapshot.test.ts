import { expect, test } from '@playwright/test';

test('/ page', async ({ page }) => {
	await page.goto('/');
	await expect(page).toHaveScreenshot();
});

test('/about page', async ({ page }) => {
	await page.goto('/about');
	await expect(page).toHaveScreenshot();
});

test('/sverdle page', async ({ page }) => {
	await page.goto('/sverdle');
	await expect(page).toHaveScreenshot();
});

test('/how-to-play page', async ({ page }) => {
	await page.goto('/sverdle/how-to-play');
	await expect(page).toHaveScreenshot();
});
