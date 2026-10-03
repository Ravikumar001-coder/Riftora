import { test, expect } from '@playwright/test';

test.describe('Backend Games API', () => {
  test('should return a list of active games', async ({ request }) => {
    // Uses the baseURL defined in playwright.config.js for the 'backend' project
    const response = await request.get('/v1/games');
    
    // Assert status code
    expect(response.ok()).toBeTruthy();
    expect(response.status()).toBe(200);

    const body = await response.json();
    
    // Assert response structure (Riftora API structure: { success: true, data: [...] })
    expect(body.success).toBe(true);
    expect(Array.isArray(body.data)).toBe(true);
    
    // Assert specific properties in the array items
    if (body.data.length > 0) {
      expect(body.data[0]).toHaveProperty('game_id');
      expect(body.data[0]).toHaveProperty('game_name');
    }
  });

  test('should return public organizations', async ({ request }) => {
    const response = await request.get('/v1/public/organizations');
    expect(response.ok()).toBeTruthy();
    expect(response.status()).toBe(200);

    const body = await response.json();
    expect(body.success).toBe(true);
  });
});
