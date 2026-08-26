import { test as setup, expect } from '@playwright/test';
import { LoginPage } from '../pages/login.page';
import { InventoryPage } from '../pages/inventory.page';
import { users } from '../test-data/users';

const authFile = 'playwright/.auth/standard-user.json';

setup('authenticate standard user', async ({ page }) => {
  const loginPage = new LoginPage(page);
  const inventoryPage = new InventoryPage(page);

  await loginPage.goto();
  await loginPage.login(users.standard.username, users.standard.password);

  await expect(page).toHaveURL(/\/inventory\.html$/);
  await expect(inventoryPage.title).toBeVisible();

  await page.context().storageState({ path: authFile });
});
