import type { CartPage } from '../../pages/cart.page';
import type { CheckoutPage } from '../../pages/checkout.page';
import type { InventoryPage } from '../../pages/inventory.page';
import type { Product } from '../../test-data/products';

import { validCustomer } from '../../test-data/checkout';
import { addProducts } from './cart.helpers';

export async function reachOverview(
  inventoryPage: InventoryPage,
  cartPage: CartPage,
  checkoutPage: CheckoutPage,
  selectedProducts: Product[],
) {
  await addProducts(inventoryPage, selectedProducts);
  await inventoryPage.openCart();
  await cartPage.checkout();
  await checkoutPage.fillCustomer(validCustomer);
  await checkoutPage.continue();
}
