import type { Locator, Page } from '@playwright/test';

export type Customer = {
  firstName?: string;
  lastName?: string;
  postalCode?: string;
};

export class CheckoutPage {
  readonly firstName;
  readonly lastName;
  readonly postalCode;
  readonly continueButton;
  readonly cancelButton;
  readonly error;
  readonly items;
  readonly names;
  readonly prices;
  readonly quantities;
  readonly paymentInfo;
  readonly shippingInfo;
  readonly subtotal;
  readonly tax;
  readonly total;
  readonly finishButton;
  readonly completeHeader;
  readonly completeText;
  readonly backHomeButton;

  constructor(readonly page: Page) {
    this.firstName = page.locator('[data-test="firstName"]');
    this.lastName = page.locator('[data-test="lastName"]');
    this.postalCode = page.locator('[data-test="postalCode"]');
    this.continueButton = page.locator('[data-test="continue"]');
    this.cancelButton = page.locator('[data-test="cancel"]');
    this.error = page.locator('[data-test="error"]');
    this.items = page.locator('[data-test="inventory-item"]');
    this.names = page.locator('[data-test="inventory-item-name"]');
    this.prices = page.locator('[data-test="inventory-item-price"]');
    this.quantities = page.locator('[data-test="item-quantity"]');
    this.paymentInfo = page.locator('[data-test="payment-info-value"]');
    this.shippingInfo = page.locator('[data-test="shipping-info-value"]');
    this.subtotal = page.locator('[data-test="subtotal-label"]');
    this.tax = page.locator('[data-test="tax-label"]');
    this.total = page.locator('[data-test="total-label"]');
    this.finishButton = page.locator('[data-test="finish"]');
    this.completeHeader = page.locator('[data-test="complete-header"]');
    this.completeText = page.locator('[data-test="complete-text"]');
    this.backHomeButton = page.locator('[data-test="back-to-products"]');
  }

  async fillCustomer(customer: Customer) {
    await this.firstName.fill(customer.firstName ?? '');
    await this.lastName.fill(customer.lastName ?? '');
    await this.postalCode.fill(customer.postalCode ?? '');
  }
  async continue() {
    await this.continueButton.click();
  }
  async cancel() {
    await this.cancelButton.click();
  }
  async finish() {
    await this.finishButton.click();
  }
  async backHome() {
    await this.backHomeButton.click();
  }
  async amount(locator: Locator) {
    const match = (await locator.textContent())?.match(
      /\$([0-9]+(?:\.[0-9]{2})?)/,
    );
    if (!match) throw new Error('Montant introuvable');
    return Number(match[1]);
  }
}
