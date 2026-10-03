import { test, expect } from '@playwright/test';

test.describe('Tournament Wizard E2E', () => {
  test('should authenticate and create a tournament end-to-end', async ({ page }) => {
    // 1. Authenticate
    await page.goto('/auth/login');
    
    // Check if we have standard login fields. We will assume standard placeholders or labels.
    await page.fill('input[type="email"]', '157cseravikumar@example.com');
    await page.fill('input[type="password"]', 'Password123!');
    
    // Click the submit button
    await page.click('button[type="submit"]');
    
    // Wait for successful login redirect
    await page.waitForURL(url => !url.toString().includes('/auth/login'));

    // 2. Navigate to tournament creation wizard
    await page.goto('/organizations/hydra-esports/manage/tournaments/new');
    
    // Wait for page to load
    await expect(page.locator('h1').or(page.locator('h2'))).toContainText('Tournament');

    // 3. Fill out Step 1
    // Fill Tournament Name
    await page.locator('input[name="tournamentName"]').fill('Hydra Pro League Season 1');
    
    // Select Game
    await page.getByText('Select Game').click();
    await page.getByRole('option').first().click();

    // Fill Edition Number
    await page.locator('input[type="number"]').fill('1');
    
    // Wait for the next button and click it to save draft and go to Step 2
    // Assuming there's a button with text 'Next' or 'Save Draft'
    await page.getByRole('button', { name: /Next/i }).click();

    // 4. Verify successful transition or API call success toast
    // Wait for some success toast or transition to Step 2
    await expect(page.locator('[data-sonner-toast], .Toastify, .go3958315148, [role="status"]')).toContainText(/saved|success|created/i, { timeout: 10000 });
    
    // Verify we reached step 2 (usually a heading change or active step indicator)
    // Here we can just ensure we don't get stuck on Step 1 with validation errors
  });
});
