import { test, expect } from '../../fixtures/test.fixture';
import { products } from '../../test-data/products';

test.describe(
  'US-012 — Gérer la session',
  { annotation: { type: 'user-story', description: 'US-012' } },
  () => {
    test.beforeEach(async ({ authenticatedPage: _authenticatedPage }) => {});

    test('TC-041 Logout @p0', async ({ page, inventoryPage, loginPage }) => {
      await inventoryPage.logout();
      await expect(page).toHaveURL(/\/$/);
      await expect(loginPage.loginButton).toBeVisible();
    });

    test('TC-042 Route privée après logout @p0', async ({
      page,
      inventoryPage,
      loginPage,
    }) => {
      await inventoryPage.logout();
      await page.goto('/inventory.html');
      await expect(page).toHaveURL(/\/$/);
      await expect(loginPage.error).toContainText(
        "You can only access '/inventory.html' when you are logged in",
      );
    });

    test('TC-043 Refresh avec panier @p1', async ({ page, inventoryPage }) => {
      await inventoryPage.add(products.backpack.slug);
      await page.reload();
      await expect(inventoryPage.title).toBeVisible();
      await expect(inventoryPage.cartBadge).toHaveText('1');
      await expect(
        inventoryPage.removeButton(products.backpack.slug),
      ).toBeVisible();
    });

    test('TC-047 Back navigateur après logout @p0', async ({
      page,
      inventoryPage,
      loginPage,
    }) => {
      await inventoryPage.logout();
      await page.goBack();
      await expect(page).toHaveURL(/\/$/);
      await expect(loginPage.loginButton).toBeVisible();
      await expect(inventoryPage.title).toHaveCount(0);
    });
  },
);

test.describe(
  'US-013 — Réinitialiser',
  { annotation: { type: 'user-story', description: 'US-013' } },
  () => {
    test.beforeEach(async ({ authenticatedPage: _authenticatedPage }) => {});

    test('TC-044 Reset App State @p1', async ({ inventoryPage }) => {
      await inventoryPage.add(products.backpack.slug);
      await inventoryPage.add(products.bikeLight.slug);
      await inventoryPage.reset();

      // Ces comportements fonctionnent et doivent toujours être vérifiés.
      await expect(inventoryPage.cartBadge).toHaveCount(0);
      await expect(inventoryPage.title).toBeVisible();

      const defect =
        'SauceDemo vide le panier mais ne restaure pas immédiatement les boutons Add to cart sans rechargement.';

      test.info().annotations.push({
        type: 'defect',
        description: defect,
      });

      // Le défaut connu commence précisément à partir de ces assertions.
      test.fail(true, defect);

      await expect
        .soft(inventoryPage.addButton(products.backpack.slug))
        .toBeVisible();

      await expect
        .soft(inventoryPage.addButton(products.bikeLight.slug))
        .toBeVisible();
    });
  },
);

test.describe(
  'US-014 — Utiliser le menu',
  { annotation: { type: 'user-story', description: 'US-014' } },
  () => {
    test.beforeEach(async ({ authenticatedPage: _authenticatedPage }) => {});

    test('TC-045 Contenu du menu @p2', async ({ page, inventoryPage }) => {
      await inventoryPage.openMenu();
      for (const id of [
        'inventory-sidebar-link',
        'about-sidebar-link',
        'logout-sidebar-link',
        'reset-sidebar-link',
      ])
        await expect(page.locator(`[data-test="${id}"]`)).toBeVisible();
    });

    test('TC-046 Fermer puis All Items @p2', async ({
      page,
      inventoryPage,
    }) => {
      await inventoryPage.openMenu();
      await inventoryPage.menuClose.click();
      await expect(inventoryPage.menu).toHaveAttribute('aria-hidden', 'true');
      await inventoryPage.openProductByName(products.backpack.name);
      await inventoryPage.openMenu();
      await inventoryPage.allItemsLink.click();
      await expect(page).toHaveURL(/\/inventory\.html$/);
      await expect(inventoryPage.title).toBeVisible();
    });
  },
);
