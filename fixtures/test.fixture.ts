import { test as base, expect } from '@playwright/test';
import * as allure from 'allure-js-commons';
import { LoginPage } from '../pages/login.page';
import { InventoryPage } from '../pages/inventory.page';
import { CartPage } from '../pages/cart.page';
import { CheckoutPage } from '../pages/checkout.page';
import { users } from '../test-data/users';

type Fixtures = {
  loginPage: LoginPage;
  inventoryPage: InventoryPage;
  cartPage: CartPage;
  checkoutPage: CheckoutPage;
  authenticatedPage: void;
  allureMetadata: void;
};

export const test = base.extend<Fixtures>({
  allureMetadata: [
    async ({ browserName }, use, testInfo) => {
      const id = testInfo.title.match(/\bTC-\d{3}\b/)?.[0];
      if (id) await allure.label('testCaseId', id);
      await allure.label('playwrightProject', testInfo.project.name);
      await allure.label('browserName', browserName);
      const priority = testInfo.tags.find((tag) => /^@p[0-2]$/.test(tag));
      if (priority)
        await allure.label('priority', priority.slice(1).toUpperCase());
      for (const annotation of testInfo.annotations) {
        if (annotation.type === 'user-story' && annotation.description)
          await allure.story(annotation.description);
        if (annotation.type === 'requirement' && annotation.description)
          await allure.label('requirement', annotation.description);
      }
      await use();
    },
    { auto: true },
  ],
  loginPage: async ({ page }, use) => {
    await use(new LoginPage(page));
  },
  inventoryPage: async ({ page }, use) => {
    await use(new InventoryPage(page));
  },
  cartPage: async ({ page }, use) => {
    await use(new CartPage(page));
  },
  checkoutPage: async ({ page }, use) => {
    await use(new CheckoutPage(page));
  },
  authenticatedPage: async ({ page }, use) => {
    const login = new LoginPage(page);
    await login.goto();
    await login.login(users.standard.username, users.standard.password);
    await expect(page).toHaveURL(/\/inventory\.html$/);
    await use();
  },
});

export { expect };
