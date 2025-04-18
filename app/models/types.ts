export interface Product {
  id: string;
  name: string;
  description: string;
  sku: string;
  quantity: number;
  price: number;
  category: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Category {
  id: string;
  name: string;
  description: string;
}

export interface InventoryTransaction {
  id: string;
  productId: string;
  type: 'IN' | 'OUT';
  quantity: number;
  date: Date;
  notes: string;
}
