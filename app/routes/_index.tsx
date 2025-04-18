import { json } from "@remix-run/node";
import { Link } from "@remix-run/react";

export const meta = () => {
  return [
    { title: "Inventory Management System" },
    { name: "description", content: "Enterprise Inventory Management System" },
  ];
};

export default function Index() {
  return (
    <div className="min-h-screen bg-gray-100">
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-8">
            Inventory Management System
          </h1>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Link
              to="/products"
              className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition"
            >
              <h2 className="text-xl font-semibold text-gray-900 mb-2">Products</h2>
              <p className="text-gray-600">Manage your product inventory</p>
            </Link>

            <Link
              to="/transactions"
              className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition"
            >
              <h2 className="text-xl font-semibold text-gray-900 mb-2">Transactions</h2>
              <p className="text-gray-600">Track inventory movements</p>
            </Link>

            <Link
              to="/dashboard"
              className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition"
            >
              <h2 className="text-xl font-semibold text-gray-900 mb-2">Dashboard</h2>
              <p className="text-gray-600">View inventory analytics</p>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
