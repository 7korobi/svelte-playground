import { expect, test } from '@playwright/test';

test('/story page', async ({ page }) => {
	await page.goto('/story');
	await expect(page).toHaveScreenshot();
});


test('/story/Header page', async ({ page }) => {
	await page.goto('/story/Header');
	await expect(page).toHaveScreenshot();
});

test('/story/Counter page', async ({ page }) => {
	await page.goto('/story/Counter');
	await expect(page).toHaveScreenshot();
});
