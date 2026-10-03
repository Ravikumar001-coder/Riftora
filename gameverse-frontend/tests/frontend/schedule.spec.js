import { test, expect } from '@playwright/test';

test.describe('Tournament Schedule Builder', () => {
  const TOURNAMENT_ID = 'test-tournament-123';
  const ORG_SLUG = 'test-org';

  test.beforeEach(async ({ page }) => {
    page.on('response', response => {
      console.log('Network Response:', response.status(), response.url());
    });
    
    // Intercept tournament details
    await page.route(new RegExp(`/tournaments/${TOURNAMENT_ID}$`), async route => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          data: {
            id: TOURNAMENT_ID,
            name: 'Riftora Championship 2026',
            formatType: 'BATTLE_ROYALE',
            gameName: 'BGMI',
            maxTeamSize: 4,
            totalTeamSlots: 48,
            status: 'DRAFT'
          }
        })
      });
    });

    // Intercept matches list (initially empty)
    await page.route(new RegExp(`/admin/tournaments/${TOURNAMENT_ID}/matches$`), async route => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ data: [] })
      });
    });

    // Intercept generate matches
    await page.route(new RegExp(`/admin/tournaments/${TOURNAMENT_ID}/matches/generate$`), async route => {
      // Upon generation, mock that it succeeds and we then update the matches route to return generated matches
      await page.route(new RegExp(`/admin/tournaments/${TOURNAMENT_ID}/matches$`), async innerRoute => {
        await innerRoute.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({
            data: [
              {
                matchId: 'match-1',
                matchNumber: 1,
                roundNumber: 1,
                matchLabel: 'Custom Room #01',
                scheduledStart: new Date(Date.now() + 86400000).toISOString(),
                status: 'DRAFT',
                slots: []
              },
              {
                matchId: 'match-2',
                matchNumber: 2,
                roundNumber: 1,
                matchLabel: 'Custom Room #02',
                scheduledStart: new Date(Date.now() + 86400000).toISOString(),
                status: 'DRAFT',
                slots: []
              }
            ]
          })
        });
      });
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ data: [] })
      });
    });

    // Intercept organization details
    await page.route(new RegExp(`/organizations/${ORG_SLUG}$`), async route => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          data: {
            id: 'test-org-123',
            name: 'Test Org',
            slug: ORG_SLUG
          }
        })
      });
    });

    // Intercept auth details
    await page.route(new RegExp(`/auth/me$`), async route => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          data: {
            id: 'admin-1',
            email: 'admin@test.com',
            roles: ['ORG_ADMIN']
          }
        })
      });
    });

    // Inject Zustand local storage state before the page loads
    await page.addInitScript(() => {
      window.localStorage.setItem('riftora-auth', JSON.stringify({
        state: {
          accessToken: 'mock-token',
          isAuthenticated: true,
          user: {
            id: 'admin-1',
            email: 'admin@test.com',
            username: 'testadmin',
            roles: ['ORG_ADMIN'],
            orgRoles: [{ org_slug: ORG_SLUG, org_role: 'org_admin' }],
            onboarding_completed: true,
            onboarding_path: 'organizer'
          }
        },
        version: 0
      }));
    });

    await page.goto(`/manage/${TOURNAMENT_ID}/schedule`);
  });

  test('Auto Generate Schedule Workflow', async ({ page }) => {
    // Wait for the main page to load
    await expect(page.locator('h1').filter({ hasText: 'Schedule Builder' })).toBeVisible();

    // Verify initially no matches
    await expect(page.locator('text=No matches scheduled for this day.')).not.toBeVisible();
    await expect(page.locator('text=Day 1 — Qualifiers')).not.toBeVisible();

    // Click Auto Generate
    await page.click('button:has-text("Auto Generate Schedule")');

    // Verify modal opens
    const modal = page.locator('h2').filter({ hasText: 'Auto Generate Schedule' });
    await expect(modal).toBeVisible();

    // Fill form
    await page.fill('input[type="number"] >> nth=0', '16'); // Teams per match
    await page.fill('input[type="number"] >> nth=1', '1');  // Rounds
    await page.fill('input[type="number"] >> nth=2', '2');  // Matches per round
    
    // Submit Generate
    await page.locator('button', { hasText: /^Generate$/ }).click();

    // Should close modal and display matches
    await expect(modal).not.toBeVisible();
    
    // Verify Days are populated
    await expect(page.locator('h4', { hasText: 'Day 1' })).toBeVisible();
    await expect(page.locator('text=MATCH 1')).toBeVisible();
    await expect(page.locator('text=MATCH 2')).toBeVisible();
  });
});
