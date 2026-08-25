import { test, expect } from '../../fixtures/test.fixture';
import { products } from '../../test-data/products';
import { users } from '../../test-data/users';
import { validCustomer } from '../../test-data/checkout';
import { reachOverview } from '../helpers/checkout.helpers';

test.describe(
  'US-008 — Informations client',
  { annotation: { type: 'user-story', description: 'US-008' } },
  () => {
    test.beforeEach(
      async ({
        authenticatedPage: _authenticatedPage,
        inventoryPage,
        cartPage,
      }) => {
        await inventoryPage.add(products.backpack.slug);
        await inventoryPage.openCart();
        await cartPage.checkout();
      },
    );

    test('TC-025 Coordonnées valides @p0', async ({ page, checkoutPage }) => {
      await checkoutPage.fillCustomer(validCustomer);
      await checkoutPage.continue();
      await expect(page).toHaveURL(/checkout-step-two/);
    });

    for (const scenario of [
      {
        id: 'TC-026',
        label: 'Prénom',
        data: { lastName: 'Lovelace', postalCode: '75001' },
        error: 'First Name',
      },
      {
        id: 'TC-027',
        label: 'Nom',
        data: { firstName: 'Ada', postalCode: '75001' },
        error: 'Last Name',
      },
      {
        id: 'TC-028',
        label: 'Code postal',
        data: { firstName: 'Ada', lastName: 'Lovelace' },
        error: 'Postal Code',
      },
    ])
      test(`${scenario.id} ${scenario.label} requis @p0`, async ({
        page,
        checkoutPage,
      }) => {
        await checkoutPage.fillCustomer(scenario.data);
        await checkoutPage.continue();
        await expect(checkoutPage.error).toContainText(
          `${scenario.error} is required`,
        );
        await expect(page).toHaveURL(/checkout-step-one/);
      });
  },
);

test.describe(
  'US-009 — Récapitulatif',
  { annotation: { type: 'user-story', description: 'US-009' } },
  () => {
    test.beforeEach(async ({ authenticatedPage: _authenticatedPage }) => {});

    test('TC-032 Deux articles exacts @p0', async ({
      inventoryPage,
      cartPage,
      checkoutPage,
    }) => {
      const selected = [products.backpack, products.bikeLight];
      await reachOverview(inventoryPage, cartPage, checkoutPage, selected);
      await expect(checkoutPage.items).toHaveCount(2);
      await expect(checkoutPage.quantities).toHaveText(['1', '1']);
      await expect(checkoutPage.names).toHaveText(selected.map((p) => p.name));
      await expect(checkoutPage.prices).toHaveText(['$29.99', '$9.99']);
    });

    test('TC-033 Calcul Backpack @p0', async ({
      inventoryPage,
      cartPage,
      checkoutPage,
    }) => {
      await reachOverview(inventoryPage, cartPage, checkoutPage, [
        products.backpack,
      ]);
      await expect(checkoutPage.subtotal).toHaveText('Item total: $29.99');
      await expect(checkoutPage.tax).toHaveText('Tax: $2.40');
      await expect(checkoutPage.total).toHaveText('Total: $32.39');
    });

    test('TC-034 Calcul multi-articles @p0', async ({
      inventoryPage,
      cartPage,
      checkoutPage,
    }) => {
      await reachOverview(inventoryPage, cartPage, checkoutPage, [
        products.onesie,
        products.fleeceJacket,
      ]);
      const subtotal = await checkoutPage.amount(checkoutPage.subtotal);
      const tax = await checkoutPage.amount(checkoutPage.tax);
      const total = await checkoutPage.amount(checkoutPage.total);
      expect(subtotal).toBe(57.98);
      expect(tax).toBe(Number((subtotal * 0.08).toFixed(2)));
      expect(total).toBe(Number((subtotal + tax).toFixed(2)));
    });

    test('TC-035 Paiement et livraison @p1', async ({
      inventoryPage,
      cartPage,
      checkoutPage,
    }) => {
      await reachOverview(inventoryPage, cartPage, checkoutPage, [
        products.backpack,
      ]);
      await expect(checkoutPage.paymentInfo).not.toBeEmpty();
      await expect(checkoutPage.shippingInfo).not.toBeEmpty();
    });
  },
);

test.describe(
  'US-010 — Finaliser',
  { annotation: { type: 'user-story', description: 'US-010' } },
  () => {
    test.beforeEach(async ({ authenticatedPage: _authenticatedPage }) => {});

    test('TC-036 Finish @p0 @smoke', async ({
      page,
      inventoryPage,
      cartPage,
      checkoutPage,
    }) => {
      await reachOverview(inventoryPage, cartPage, checkoutPage, [
        products.backpack,
      ]);
      await checkoutPage.finish();
      await expect(page).toHaveURL(/checkout-complete/);
      await expect(checkoutPage.completeHeader).toHaveText(
        'Thank you for your order!',
      );
    });

    test('TC-037 Back Home et panier vide @p0', async ({
      inventoryPage,
      cartPage,
      checkoutPage,
    }) => {
      await reachOverview(inventoryPage, cartPage, checkoutPage, [
        products.backpack,
      ]);
      await checkoutPage.finish();
      await checkoutPage.backHome();
      await expect(inventoryPage.title).toBeVisible();
      await expect(inventoryPage.cartBadge).toHaveCount(0);
    });

    test('TC-038 Profil error sans faux succès @p1', async ({
      page,
      loginPage,
      inventoryPage,
      cartPage,
      checkoutPage,
    }) => {
      await inventoryPage.logout();
      await loginPage.login(users.error.username, users.error.password);
      await reachOverview(inventoryPage, cartPage, checkoutPage, [
        products.backpack,
      ]);
      await checkoutPage.finish();
      await expect(page).not.toHaveURL(/checkout-complete/);
      await expect(checkoutPage.completeHeader).toHaveCount(0);
    });
  },
);

test.describe(
  'US-011 — Annuler',
  { annotation: { type: 'user-story', description: 'US-011' } },
  () => {
    test.beforeEach(async ({ authenticatedPage: _authenticatedPage }) => {});

    test('TC-039 Cancel informations conserve le panier @p1', async ({
      page,
      inventoryPage,
      cartPage,
    }) => {
      await inventoryPage.add(products.backpack.slug);
      await inventoryPage.openCart();
      await cartPage.checkout();
      await page.locator('[data-test="cancel"]').click();
      await expect(page).toHaveURL(/cart/);
      await expect(cartPage.names).toHaveText([products.backpack.name]);
    });

    test('TC-040 Cancel overview sans confirmation @p1', async ({
      page,
      inventoryPage,
      cartPage,
      checkoutPage,
    }) => {
      await reachOverview(inventoryPage, cartPage, checkoutPage, [
        products.backpack,
      ]);
      await checkoutPage.cancel();
      await expect(page).toHaveURL(/inventory/);
      await expect(checkoutPage.completeHeader).toHaveCount(0);
      await expect(inventoryPage.cartBadge).toHaveText('1');
    });
  },
);
