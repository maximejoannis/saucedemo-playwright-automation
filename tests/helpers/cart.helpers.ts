import type { InventoryPage } from '../../pages/inventory.page';
import type { Product } from '../../test-data/products';

export async function addProducts(
  inventoryPage: InventoryPage,
  selectedProducts: Product[],
) {
  for (const product of selectedProducts) {
    await inventoryPage.add(product.slug);
  }
}
