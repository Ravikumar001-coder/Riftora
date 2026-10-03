import { test, expect } from '@playwright/test';

test('Test navigation with real API', async ({ page }) => {
  // Login with mock token (will cause 401s, but we want to see if it freezes)
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

  await page.route(new RegExp('/tournaments/e49b6e99-316a-4c41-bdce-7b2a41b85397'), async route => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({
        data: {
          id: "e49b6e99-316a-4c41-bdce-7b2a41b85397",
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

  await page.route(new RegExp('/tournaments/e49b6e99-316a-4c41-bdce-7b2a41b85397/matches'), async route => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({
        data: [
          {
            matchId: "m1",
            matchNumber: 1,
            roundNumber: 1,
            scheduledStart: new Date().toISOString(),
            status: "DRAFT",
            slots: []
          }
        ]
      })
    });
  });

  await page.goto('http://localhost:5173/manage/e49b6e99-316a-4c41-bdce-7b2a41b85397/overview');
  
  await page.waitForTimeout(2000);
  
  // Click Schedule
  const scheduleLink = page.locator('aside nav a', { hasText: 'Schedule' }).first();
  await expect(scheduleLink).toBeVisible();
  await scheduleLink.click({ timeout: 2000 });
  
  await page.waitForTimeout(2000);
  
  // Now click Registrations
  const link = page.locator('aside nav a', { hasText: 'Registrations' }).first();
  await expect(link).toBeVisible();
  await link.click({ timeout: 2000 });
  
  console.log("Current URL:", page.url());
  
  await expect(page.locator('h1').filter({ hasText: 'Registrations' })).toBeVisible({ timeout: 5000 }).catch(e => console.log("H1 text did not change!"));
  
  const h1 = page.locator('h1');
  console.log("Final H1 text:", await h1.textContent().catch(()=>'none'));
});
