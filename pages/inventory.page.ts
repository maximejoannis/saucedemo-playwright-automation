import type { Page } from '@playwright/test';

export class InventoryPage {
  readonly title;
  readonly items;
  readonly names;
  readonly descriptions;
  readonly prices;
  readonly images;
  readonly cartLink;
  readonly cartBadge;
  readonly sort;
  readonly detailName;
  readonly detailDescription;
  readonly detailPrice;
  readonly menuButton;
  readonly menu;
  readonly menuClose;
  readonly allItemsLink;
  readonly logoutLink;
  readonly resetLink;

  constructor(readonly page: Page) {
    this.title = page.getByText('Products', { exact: true });
    this.items = page.locator('[data-test="inventory-item"]');
    this.names = page.locator('[data-test="inventory-item-name"]');
    this.descriptions = page.locator('[data-test="inventory-item-desc"]');
    this.prices = page.locator('[data-test="inventory-item-price"]');
    this.images = page.locator('[data-test="inventory-item"] img');
    this.cartLink = page.locator('[data-test="shopping-cart-link"]');
    this.cartBadge = page.locator('[data-test="shopping-cart-badge"]');
    this.sort = page.locator('[data-test="product-sort-container"]');
    this.detailName = page.locator('[data-test="inventory-item-name"]');
    this.detailDescription = page.locator('[data-test="inventory-item-desc"]');
    this.detailPrice = page.locator('[data-test="inventory-item-price"]');
    this.menuButton = page.getByRole('button', { name: 'Open Menu' });
    this.menu = page.locator('.bm-menu-wrap');
    this.menuClose = page.getByRole('button', { name: 'Close Menu' });
    this.allItemsLink = page.locator('[data-test="inventory-sidebar-link"]');
    this.logoutLink = page.locator('[data-test="logout-sidebar-link"]');
    this.resetLink = page.locator('[data-test="reset-sidebar-link"]');
  }

  async goto() {
    await this.page.goto('/inventory.html');
  }
  async add(slug: string) {
    await this.page
      .locator(`[data-test="add-to-cart-${slug}"], [data-test="add-to-cart"]`)
      .click();
  }
  async remove(slug: string) {
    await this.page.locator(`[data-test="remove-${slug}"]`).click();
  }
  addButton(slug: string) {
    return this.page.locator(`[data-test="add-to-cart-${slug}"]`);
  }
  removeButton(slug: string) {
    return this.page.locator(`[data-test="remove-${slug}"]`);
  }
  async openCart() {
    await this.cartLink.click();
  }
  async openProductByName(name: string) {
    await this.names.filter({ hasText: name }).click();
  }
  async openProductByImage(name: string) {
    await this.items
      .filter({ hasText: name })
      .locator('a[id$="_img_link"]')
      .click();
  }
  async selectSort(value: string) {
    await this.sort.selectOption(value);
  }
  async productNames() {
    return this.names.allTextContents();
  }
  async productPrices() {
    return (await this.prices.allTextContents()).map((text) =>
      Number(text.replace('$', '')),
    );
  }
  async openMenu() {
    await this.menuButton.click();
  }
  async logout() {
    await this.openMenu();
    await this.logoutLink.click();
  }
  async reset() {
    await this.openMenu();
    await this.resetLink.click();
  }
}
