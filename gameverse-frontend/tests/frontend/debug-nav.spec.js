import { test, expect } from '@playwright/test';

test('Test navigation from schedule', async ({ page }) => {
  // Login with mock
  await page.addInitScript(() => {
    window.localStorage.setItem('riftora-auth', JSON.stringify({
      state: {
        token: "mock-token",
        user: { 
          id: 1, 
          username: "testorg", 
          email: "test@example.com",
          onboarding_completed: true,
          roles: ["ORGANIZER"]
        },
        isAuthenticated: true
      },
      version: 0
    }));
  });

  await page.route(new RegExp('/tournaments/test-123'), async route => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({
        data: {
          id: "test-123",
          name: "Test Tournament",
          status: "DRAFT",
          formatType: "BATTLE_ROYALE",
          gameName: "BGMI",
          slug: "test-tournament-123",
          maxTeamSize: 4,
          totalTeamSlots: 16
        }
      })
    });
  });

  await page.route(new RegExp('/admin/tournaments/test-123/matches'), async route => {
    await route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify({ data: [] }) });
  });

  await page.goto('http://localhost:5173/manage/test-123/rules');
  
  await page.waitForTimeout(2000);
  
  console.log("Current URL:", page.url());
  
  // Take a screenshot to see if the ErrorBoundary rendered
  await page.screenshot({ path: 'tests/frontend/rules-crash.png', fullPage: true });
  
  // Try to read the error from the screen
  const errorText = await page.locator('body').textContent();
  console.log("Body text:", errorText);
});
