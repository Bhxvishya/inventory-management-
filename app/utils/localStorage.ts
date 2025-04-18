import { Product, InventoryTransaction } from '~/models/types';

const PRODUCTS_KEY = 'inventory_products';
const TRANSACTIONS_KEY = 'inventory_transactions';

export const getProducts = (): Product[] => {
  if (typeof window === 'undefined') return [];
  const data = localStorage.getItem(PRODUCTS_KEY);
  return data ? JSON.parse(data) : [];
};

export const saveProduct = (product: Product) => {
  const products = getProducts();
  const existingIndex = products.findIndex(p => p.id === product.id);
  
  if (existingIndex >= 0) {
    products[existingIndex] = product;
  } else {
    products.push(product);
  }
  
  localStorage.setItem(PRODUCTS_KEY, JSON.stringify(products));
};

export const deleteProduct = (id: string) => {
  const products = getProducts().filter(p => p.id !== id);
  localStorage.setItem(PRODUCTS_KEY, JSON.stringify(products));
};

export const getTransactions = (): InventoryTransaction[] => {
  if (typeof window === 'undefined') return [];
  const data = localStorage.getItem(TRANSACTIONS_KEY);
  return data ? JSON.parse(data) : [];
};

export const saveTransaction = (transaction: InventoryTransaction) => {
  const transactions = getTransactions();
  transactions.push(transaction);
  localStorage.setItem(TRANSACTIONS_KEY, JSON.stringify(transactions));
  
  // Update product quantity
  const products = getProducts();
  const product = products.find(p => p.id === transaction.productId);
  if (product) {
    product.quantity += transaction.type === 'IN' ? transaction.quantity : -transaction.quantity;
    saveProduct(product);
  }
};
