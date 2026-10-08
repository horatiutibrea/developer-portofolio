import { expect, test } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

test('404 page is accessible', async ({ page }) => {
  await page.goto('/not-found');
  await expect(page.getByRole('heading', { name: /pagina nu a fost găsită/i })).toBeVisible();

  const results = await new AxeBuilder({ page })
    .withTags(['wcag2a', 'wcag2aa'])
    .analyze();
  expect(results.violations.filter((violation) =>
    violation.impact === 'critical' || violation.impact === 'serious')).toEqual([]);
});
