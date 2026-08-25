export type Product = {
  slug: string;
  name: string;
  description: string;
  price: number;
};

export const products: Record<string, Product> = {
  backpack: {
    slug: 'sauce-labs-backpack',
    name: 'Sauce Labs Backpack',
    description: 'carry.allTheThings()',
    price: 29.99,
  },
  bikeLight: {
    slug: 'sauce-labs-bike-light',
    name: 'Sauce Labs Bike Light',
    description: 'A red light',
    price: 9.99,
  },
  boltTShirt: {
    slug: 'sauce-labs-bolt-t-shirt',
    name: 'Sauce Labs Bolt T-Shirt',
    description: 'Get your testing superhero',
    price: 15.99,
  },
  fleeceJacket: {
    slug: 'sauce-labs-fleece-jacket',
    name: 'Sauce Labs Fleece Jacket',
    description: "It's not every day",
    price: 49.99,
  },
  onesie: {
    slug: 'sauce-labs-onesie',
    name: 'Sauce Labs Onesie',
    description: 'Rib snap infant onesie',
    price: 7.99,
  },
  redTShirt: {
    slug: 'test.allthethings()-t-shirt-(red)',
    name: 'Test.allTheThings() T-Shirt (Red)',
    description: 'This classic Sauce Labs t-shirt',
    price: 15.99,
  },
};

export const allProducts = Object.values(products);
