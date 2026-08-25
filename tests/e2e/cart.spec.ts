import { test, expect } from '../../fixtures/test.fixture';
import { products } from '../../test-data/products';
import { addProducts } from '../helpers/cart.helpers';

const three = [products.backpack, products.bikeLight, products.boltTShirt];

test.describe(
  'US-005 — Ajouter au panier',
  { annotation: { type: 'user-story', description: 'US-005' } },
  () => {
    test.beforeEach(async ({ authenticatedPage: _authenticatedPage }) => {});

    test('TC-016 Ajouter un produit @p0 @smoke', async ({ inventoryPage }) => {
      await inventoryPage.add(products.backpack.slug);
      await expect(inventoryPage.cartBadge).toHaveText('1');
      await expect(
        inventoryPage.removeButton(products.backpack.slug),
      ).toBeVisible();
    });

    test('TC-017 Ajouter trois produits @p0', async ({
      inventoryPage,
      cartPage,
    }) => {
      await addProducts(inventoryPage, three);
      await expect(inventoryPage.cartBadge).toHaveText('3');
      await inventoryPage.openCart();
      await expect(cartPage.items).toHaveCount(3);
      await expect(cartPage.names).toHaveText(three.map((p) => p.name));
    });

    test('TC-018 Double ajout impossible @p1', async ({
      inventoryPage,
      cartPage,
    }) => {
      await inventoryPage.add(products.backpack.slug);
      await expect(inventoryPage.addButton(products.backpack.slug)).toHaveCount(
        0,
      );
      await inventoryPage.openCart();
      await expect(cartPage.quantities).toHaveText(['1']);
      await expect(cartPage.items).toHaveCount(1);
    });

    test('TC-019 Ajout depuis une fiche @p1', async ({
      inventoryPage,
      cartPage,
    }) => {
      await inventoryPage.openProductByName(products.bikeLight.name);
      await inventoryPage.add(products.bikeLight.slug);
      await expect(inventoryPage.cartBadge).toHaveText('1');
      await inventoryPage.openCart();
      await expect(cartPage.names).toHaveText([products.bikeLight.name]);
    });
  },
);

test.describe(
  'US-006 — Retirer du panier',
  { annotation: { type: 'user-story', description: 'US-006' } },
  () => {
    test.beforeEach(async ({ authenticatedPage: _authenticatedPage }) => {});

    test('TC-020 Retirer parmi plusieurs @p0', async ({
      inventoryPage,
      cartPage,
    }) => {
      await addProducts(inventoryPage, three);
      await inventoryPage.openCart();
      await cartPage.remove(products.bikeLight.slug);
      await expect(inventoryPage.cartBadge).toHaveText('2');
      await expect(cartPage.names).toHaveText([
        products.backpack.name,
        products.boltTShirt.name,
      ]);
    });

    test('TC-021 Retirer le dernier @p0', async ({
      inventoryPage,
      cartPage,
    }) => {
      await inventoryPage.add(products.backpack.slug);
      await inventoryPage.openCart();
      await cartPage.remove(products.backpack.slug);
      await expect(inventoryPage.cartBadge).toHaveCount(0);
      await expect(cartPage.items).toHaveCount(0);
    });
  },
);

test.describe(
  'US-007 — Consulter le panier',
  { annotation: { type: 'user-story', description: 'US-007' } },
  () => {
    test.beforeEach(async ({ authenticatedPage: _authenticatedPage }) => {});

    test('TC-022 Exactitude panier @p0', async ({
      inventoryPage,
      cartPage,
    }) => {
      await inventoryPage.add(products.backpack.slug);
      await inventoryPage.openCart();
      await expect(cartPage.quantities).toHaveText(['1']);
      await expect(cartPage.names).toHaveText([products.backpack.name]);
      await expect(cartPage.descriptions).toContainText(
        products.backpack.description,
      );
      await expect(cartPage.prices).toHaveText(['$29.99']);
    });

    test('TC-023 Continuer shopping @p1', async ({
      page,
      inventoryPage,
      cartPage,
    }) => {
      await inventoryPage.add(products.backpack.slug);
      await inventoryPage.openCart();
      await cartPage.continueShopping();
      await expect(page).toHaveURL(/\/inventory\.html$/);
      await expect(inventoryPage.cartBadge).toHaveText('1');
    });

    test('TC-024 Panier vide @p1', async ({ inventoryPage, cartPage }) => {
      await inventoryPage.openCart();
      await expect(cartPage.items).toHaveCount(0);
      await expect(inventoryPage.cartBadge).toHaveCount(0);
    });
  },
);
