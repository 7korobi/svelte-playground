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

test('/story/Counter click up', async ({ page }) => {
	await page.goto('/story/Counter');

	await page.click('.counter > button:nth-of-type(1)');
	const el = await page.waitForSelector('.counter-viewport');
	const text = await el.innerText();
	expect(text).toBe('0\n-1');
});

test('/story/Counter click down', async ({ page }) => {
	await page.goto('/story/Counter');

	await page.click('.counter > button:nth-of-type(2)');
	const el = await page.waitForSelector('.counter-viewport');
	const text = await el.innerText();
	expect(text).toBe('1\n0');
});
