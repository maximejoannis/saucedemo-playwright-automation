import type { Page } from '@playwright/test';

export class CartPage {
  readonly items;
  readonly names;
  readonly descriptions;
  readonly prices;
  readonly quantities;
  readonly checkoutButton;
  readonly continueShoppingButton;

  constructor(readonly page: Page) {
    this.items = page.locator('[data-test="inventory-item"]');
    this.names = page.locator('[data-test="inventory-item-name"]');
    this.descriptions = page.locator('[data-test="inventory-item-desc"]');
    this.prices = page.locator('[data-test="inventory-item-price"]');
    this.quantities = page.locator('[data-test="item-quantity"]');
    this.checkoutButton = page.locator('[data-test="checkout"]');
    this.continueShoppingButton = page.locator(
      '[data-test="continue-shopping"]',
    );
  }

  async remove(slug: string) {
    await this.page.locator(`[data-test="remove-${slug}"]`).click();
  }
  async checkout() {
    await this.checkoutButton.click();
  }
  async continueShopping() {
    await this.continueShoppingButton.click();
  }
}
