import { test, expect } from '../../fixtures/test.fixture';
import { allProducts, products } from '../../test-data/products';
import { users } from '../../test-data/users';

const expectedNames = allProducts.map((product) => product.name).sort();
const expectedPrices = allProducts
  .map((product) => product.price)
  .sort((a, b) => a - b);

test.describe(
  'US-002 — Consulter le catalogue',
  { annotation: { type: 'user-story', description: 'US-002' } },
  () => {
    test.beforeEach(async ({ authenticatedPage: _authenticatedPage }) => {});

    test('TC-006 Catalogue complet @p0 @smoke', async ({ inventoryPage }) => {
      await expect(inventoryPage.items).toHaveCount(6);
      await expect(inventoryPage.names).toHaveText(
        allProducts.map((p) => p.name),
      );
      for (let i = 0; i < 6; i += 1) {
        await expect(inventoryPage.descriptions.nth(i)).not.toBeEmpty();
        await expect(inventoryPage.prices.nth(i)).toHaveText(/^\$\d+\.\d{2}$/);
        await expect(inventoryPage.images.nth(i)).toBeVisible();
        await expect(inventoryPage.images.nth(i)).toHaveAttribute('src', /.+/);
      }
    });

    test('TC-007 Écart problem_user détecté @p1', async ({
      page,
      loginPage,
      inventoryPage,
    }) => {
      await inventoryPage.logout();
      await loginPage.login(users.problem.username, users.problem.password);
      const sources = await inventoryPage.images.evaluateAll((images) =>
        images.map((image) => (image as HTMLImageElement).src),
      );
      expect(new Set(sources).size).toBeLessThan(allProducts.length);
      await expect(page).toHaveURL(/\/inventory\.html$/);
    });
  },
);

test.describe(
  'US-003 — Trier le catalogue',
  { annotation: { type: 'user-story', description: 'US-003' } },
  () => {
    test.beforeEach(async ({ authenticatedPage: _authenticatedPage }) => {});

    test('TC-008 Tri A-Z @p1', async ({ inventoryPage }) => {
      await inventoryPage.selectSort('az');
      expect(await inventoryPage.productNames()).toEqual(expectedNames);
    });

    test('TC-009 Tri Z-A @p1', async ({ inventoryPage }) => {
      await inventoryPage.selectSort('za');
      expect(await inventoryPage.productNames()).toEqual(
        [...expectedNames].reverse(),
      );
    });

    test('TC-010 Prix ascendant @p1', async ({ inventoryPage }) => {
      await inventoryPage.selectSort('lohi');
      expect(await inventoryPage.productPrices()).toEqual(expectedPrices);
    });

    test('TC-011 Prix descendant @p1', async ({ inventoryPage }) => {
      await inventoryPage.selectSort('hilo');
      expect(await inventoryPage.productPrices()).toEqual(
        [...expectedPrices].reverse(),
      );
    });

    test('TC-012 Intégrité après les quatre tris @p1', async ({
      inventoryPage,
    }) => {
      for (const option of ['az', 'za', 'lohi', 'hilo']) {
        await inventoryPage.selectSort(option);
        expect((await inventoryPage.productNames()).sort()).toEqual(
          expectedNames,
        );
      }
    });
  },
);

test.describe(
  'US-004 — Consulter un produit',
  { annotation: { type: 'user-story', description: 'US-004' } },
  () => {
    test.beforeEach(async ({ authenticatedPage: _authenticatedPage }) => {});

    test('TC-013 Ouvrir Backpack par nom @p1', async ({
      page,
      inventoryPage,
    }) => {
      await inventoryPage.openProductByName(products.backpack.name);
      await expect(page).toHaveURL(/inventory-item\.html/);
      await expect(inventoryPage.detailName).toHaveText(products.backpack.name);
      await expect(inventoryPage.detailDescription).toContainText(
        products.backpack.description,
      );
      await expect(inventoryPage.detailPrice).toHaveText('$29.99');
    });

    test('TC-014 Ouvrir Bike Light par image @p1', async ({
      page,
      inventoryPage,
    }) => {
      await inventoryPage.openProductByImage(products.bikeLight.name);
      await expect(page).toHaveURL(/inventory-item\.html/);
      await expect(inventoryPage.detailName).toHaveText(
        products.bikeLight.name,
      );
      await expect(inventoryPage.detailPrice).toHaveText('$9.99');
    });

    test('TC-015 Retour fiche @p1', async ({ page, inventoryPage }) => {
      await inventoryPage.openProductByName(products.backpack.name);
      await page.locator('[data-test="back-to-products"]').click();
      await expect(page).toHaveURL(/\/inventory\.html$/);
      await expect(inventoryPage.sort).toBeEnabled();
    });
  },
);
