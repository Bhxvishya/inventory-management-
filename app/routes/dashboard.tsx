import { useEffect, useState } from "react";
import { getProducts, getTransactions } from "~/utils/localStorage";
import type { Product, InventoryTransaction } from "~/models/types";

export default function Dashboard() {
  const [totalProducts, setTotalProducts] = useState(0);
  const [totalStock, setTotalStock] = useState(0);
  const [lowStockProducts, setLowStockProducts] = useState<Product[]>([]);
  const [recentTransactions, setRecentTransactions] = useState<InventoryTransaction[]>([]);

  useEffect(() => {
    const products = getProducts();
    const transactions = getTransactions();

    setTotalProducts(products.length);
    setTotalStock(products.reduce((sum, product) => sum + product.quantity, 0));
    setLowStockProducts(products.filter(product => product.quantity < 10));
    setRecentTransactions(transactions.slice(-5));
  }, []); // Empty dependency array means this runs once when component mounts

  return (
    <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-lg font-semibold text-gray-900 mb-2">Total Products</h2>
          <p className="text-3xl font-bold text-blue-600">{totalProducts}</p>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-lg font-semibold text-gray-900 mb-2">Total Stock</h2>
          <p className="text-3xl font-bold text-green-600">{totalStock}</p>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-lg font-semibold text-gray-900 mb-2">Low Stock Items</h2>
          <p className="text-3xl font-bold text-red-600">{lowStockProducts.length}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Low Stock Products</h2>
          <div className="divide-y divide-gray-200">
            {lowStockProducts.map(product => (
              <div key={product.id} className="py-3">
                <h3 className="text-sm font-medium text-gray-900">{product.name}</h3>
                <p className="text-sm text-gray-500">Quantity: {product.quantity}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Recent Transactions</h2>
          <div className="divide-y divide-gray-200">
            {recentTransactions.map(transaction => (
              <div key={transaction.id} className="py-3">
                <p className="text-sm text-gray-500">
                  {new Date(transaction.date).toLocaleDateString()} - {transaction.type}
                </p>
                <p className="text-sm font-medium text-gray-900">
                  Quantity: {transaction.quantity}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
