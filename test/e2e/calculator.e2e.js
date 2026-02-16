import { test, expect } from '@playwright/test';

test('page loads with display and buttons', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('.display')).toBeVisible();
  const buttons = await page.locator('button').count();
  expect(buttons).toBeGreaterThan(30);
});

test('5 ENTER 3 + equals 8', async ({ page }) => {
  await page.goto('/');
  await page.click('button[data-value="5"]');
  await page.click('button[data-action="enter"]');
  await page.click('button[data-value="3"]');
  await page.click('button[data-action="add"]');

  const xValue = await page.locator('#stack-x .value').textContent();
  expect(xValue.trim()).toBe('8');
});

test('history entry created after calculation', async ({ page }) => {
  await page.goto('/');
  await page.click('button[data-value="5"]');
  await page.click('button[data-action="enter"]');
  await page.click('button[data-value="3"]');
  await page.click('button[data-action="add"]');

  await page.waitForTimeout(300);
  const entries = await page.locator('#history-list .history-entry').count();
  expect(entries).toBeGreaterThan(0);

  const text = await page.locator('#history-list .history-entry').first().textContent();
  expect(text).toContain('8');
});

test('clicking history entry pushes value onto stack', async ({ page }) => {
  await page.goto('/');
  await page.click('button[data-value="5"]');
  await page.click('button[data-action="enter"]');
  await page.click('button[data-value="3"]');
  await page.click('button[data-action="add"]');

  await page.waitForTimeout(300);
  await page.locator('#history-list .history-entry').first().click();
  await page.waitForTimeout(200);

  const xValue = await page.locator('#stack-x .value').textContent();
  expect(xValue.trim()).toBe('8');
});

test('keyboard: p for pi, s for sin(pi) approximately 0', async ({ page }) => {
  await page.goto('/');
  await page.waitForSelector('.button-grid');
  await page.waitForTimeout(300);
  await page.keyboard.press('Escape');
  await page.waitForTimeout(100);
  await page.keyboard.press('p');
  await page.waitForTimeout(300);

  const piValue = await page.locator('#stack-x .value').textContent();
  expect(parseFloat(piValue)).toBeCloseTo(Math.PI, 5);

  await page.keyboard.press('s');
  await page.waitForTimeout(200);

  const sinValue = await page.locator('#stack-x .value').textContent();
  expect(Math.abs(parseFloat(sinValue))).toBeLessThan(0.01);
});
