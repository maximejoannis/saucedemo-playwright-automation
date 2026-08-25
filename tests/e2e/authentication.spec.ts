import { test, expect } from '../../fixtures/test.fixture';
import { users } from '../../test-data/users';

test.use({ storageState: { cookies: [], origins: [] } });

test.describe(
  'US-001 — Se connecter',
  { annotation: { type: 'user-story', description: 'US-001' } },
  () => {
    test('TC-001 Login standard @p0 @smoke', async ({
      page,
      loginPage,
      inventoryPage,
    }) => {
      await loginPage.goto();
      await loginPage.login(users.standard.username, users.standard.password);
      await expect(page).toHaveURL(/\/inventory\.html$/);
      await expect(inventoryPage.title).toBeVisible();
    });

    test('TC-002 Username vide @p0', async ({ page, loginPage }) => {
      await loginPage.goto();
      await loginPage.password.fill(users.standard.password);
      await loginPage.loginButton.click();
      await expect(loginPage.error).toContainText('Username is required');
      await expect(page).toHaveURL(/\/$/);
    });

    test('TC-003 Password vide @p0', async ({ page, loginPage }) => {
      await loginPage.goto();
      await loginPage.username.fill(users.standard.username);
      await loginPage.loginButton.click();
      await expect(loginPage.error).toContainText('Password is required');
      await expect(page).toHaveURL(/\/$/);
    });

    test('TC-004 Identifiants faux @p0', async ({ page, loginPage }) => {
      await loginPage.goto();
      await loginPage.login('bad', 'bad');
      await expect(loginPage.error).toContainText(
        'Username and password do not match',
      );
      await expect(page).toHaveURL(/\/$/);
    });

    test('TC-005 Compte verrouillé @p0', async ({ loginPage }) => {
      await loginPage.goto();
      await loginPage.login(users.locked.username, users.locked.password);
      await expect(loginPage.error).toContainText('locked out');
    });
  },
);
