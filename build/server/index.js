import { jsx, jsxs } from "react/jsx-runtime";
import { PassThrough } from "stream";
import { RemixServer, Link, Meta, Links, Outlet, ScrollRestoration, Scripts, useNavigate, Form } from "@remix-run/react";
import * as isbot from "isbot";
import { renderToPipeableStream } from "react-dom/server";
import { createReadableStreamFromReadable } from "@remix-run/node";
import { useState, useEffect } from "react";
const ABORT_DELAY = 5e3;
function handleRequest(request, responseStatusCode, responseHeaders, remixContext) {
  const userAgent = request.headers.get("user-agent");
  return isbot.isbot(userAgent || "") ? handleBotRequest(
    request,
    responseStatusCode,
    responseHeaders,
    remixContext
  ) : handleBrowserRequest(
    request,
    responseStatusCode,
    responseHeaders,
    remixContext
  );
}
function handleBotRequest(request, responseStatusCode, responseHeaders, remixContext) {
  return new Promise((resolve, reject) => {
    const { pipe, abort } = renderToPipeableStream(
      /* @__PURE__ */ jsx(
        RemixServer,
        {
          context: remixContext,
          url: request.url,
          abortDelay: ABORT_DELAY
        }
      ),
      {
        onAllReady() {
          const body = new PassThrough();
          const stream = createReadableStreamFromReadable(body);
          responseHeaders.set("Content-Type", "text/html");
          resolve(
            new Response(stream, {
              headers: responseHeaders,
              status: responseStatusCode
            })
          );
          pipe(body);
        },
        onShellError(error) {
          reject(error);
        },
        onError(error) {
          responseStatusCode = 500;
          console.error(error);
        }
      }
    );
    setTimeout(abort, ABORT_DELAY);
  });
}
function handleBrowserRequest(request, responseStatusCode, responseHeaders, remixContext) {
  return new Promise((resolve, reject) => {
    const { pipe, abort } = renderToPipeableStream(
      /* @__PURE__ */ jsx(
        RemixServer,
        {
          context: remixContext,
          url: request.url,
          abortDelay: ABORT_DELAY
        }
      ),
      {
        onShellReady() {
          const body = new PassThrough();
          const stream = createReadableStreamFromReadable(body);
          responseHeaders.set("Content-Type", "text/html");
          resolve(
            new Response(stream, {
              headers: responseHeaders,
              status: responseStatusCode
            })
          );
          pipe(body);
        },
        onShellError(error) {
          reject(error);
        },
        onError(error) {
          console.error(error);
          responseStatusCode = 500;
        }
      }
    );
    setTimeout(abort, ABORT_DELAY);
  });
}
const entryServer = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: handleRequest
}, Symbol.toStringTag, { value: "Module" }));
function Header() {
  return /* @__PURE__ */ jsx("header", { className: "bg-white shadow", children: /* @__PURE__ */ jsx("nav", { className: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8", children: /* @__PURE__ */ jsx("div", { className: "flex justify-between h-16", children: /* @__PURE__ */ jsxs("div", { className: "flex", children: [
    /* @__PURE__ */ jsx(Link, { to: "/", className: "flex items-center", children: /* @__PURE__ */ jsx("span", { className: "text-xl font-bold text-gray-900", children: "IMS" }) }),
    /* @__PURE__ */ jsxs("div", { className: "hidden sm:ml-6 sm:flex sm:space-x-8", children: [
      /* @__PURE__ */ jsx(
        Link,
        {
          to: "/products",
          className: "inline-flex items-center px-1 pt-1 text-sm font-medium text-gray-900",
          children: "Products"
        }
      ),
      /* @__PURE__ */ jsx(
        Link,
        {
          to: "/transactions",
          className: "inline-flex items-center px-1 pt-1 text-sm font-medium text-gray-900",
          children: "Transactions"
        }
      ),
      /* @__PURE__ */ jsx(
        Link,
        {
          to: "/dashboard",
          className: "inline-flex items-center px-1 pt-1 text-sm font-medium text-gray-900",
          children: "Dashboard"
        }
      )
    ] })
  ] }) }) }) });
}
function headers() {
  return {
    "Content-Security-Policy": [
      "default-src 'self'",
      "script-src 'self' 'unsafe-inline' 'unsafe-eval'",
      "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
      "img-src 'self' data: https:",
      "font-src 'self' https://fonts.gstatic.com",
      "connect-src 'self'",
      "frame-ancestors 'none'"
    ].join("; ")
  };
}
const links = () => [
  { rel: "preconnect", href: "https://fonts.googleapis.com" },
  {
    rel: "preconnect",
    href: "https://fonts.gstatic.com",
    crossOrigin: "anonymous"
  },
  {
    rel: "stylesheet",
    href: "https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap"
  }
];
function App() {
  return /* @__PURE__ */ jsxs("html", { lang: "en", className: "h-full bg-gray-100", children: [
    /* @__PURE__ */ jsxs("head", { children: [
      /* @__PURE__ */ jsx("meta", { charSet: "utf-8" }),
      /* @__PURE__ */ jsx("meta", { name: "viewport", content: "width=device-width, initial-scale=1" }),
      /* @__PURE__ */ jsx(Meta, {}),
      /* @__PURE__ */ jsx(Links, {})
    ] }),
    /* @__PURE__ */ jsxs("body", { className: "h-full", children: [
      /* @__PURE__ */ jsx(Header, {}),
      /* @__PURE__ */ jsx(Outlet, {}),
      /* @__PURE__ */ jsx(ScrollRestoration, {}),
      /* @__PURE__ */ jsx(Scripts, {})
    ] })
  ] });
}
const route0 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: App,
  headers,
  links
}, Symbol.toStringTag, { value: "Module" }));
const PRODUCTS_KEY = "inventory_products";
const TRANSACTIONS_KEY = "inventory_transactions";
const getProducts = () => {
  if (typeof window === "undefined") return [];
  const data = localStorage.getItem(PRODUCTS_KEY);
  return data ? JSON.parse(data) : [];
};
const saveProduct = (product) => {
  const products = getProducts();
  const existingIndex = products.findIndex((p) => p.id === product.id);
  if (existingIndex >= 0) {
    products[existingIndex] = product;
  } else {
    products.push(product);
  }
  localStorage.setItem(PRODUCTS_KEY, JSON.stringify(products));
};
const getTransactions = () => {
  if (typeof window === "undefined") return [];
  const data = localStorage.getItem(TRANSACTIONS_KEY);
  return data ? JSON.parse(data) : [];
};
const saveTransaction = (transaction) => {
  const transactions = getTransactions();
  transactions.push(transaction);
  localStorage.setItem(TRANSACTIONS_KEY, JSON.stringify(transactions));
  const products = getProducts();
  const product = products.find((p) => p.id === transaction.productId);
  if (product) {
    product.quantity += transaction.type === "IN" ? transaction.quantity : -transaction.quantity;
    saveProduct(product);
  }
};
function Transactions() {
  const [transactions, setTransactions] = useState([]);
  const [products, setProducts] = useState([]);
  useNavigate();
  useEffect(() => {
    setTransactions(getTransactions());
    setProducts(getProducts());
  }, []);
  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const transaction = {
      id: crypto.randomUUID(),
      productId: formData.get("productId"),
      type: formData.get("type"),
      quantity: parseInt(formData.get("quantity"), 10),
      date: /* @__PURE__ */ new Date(),
      notes: formData.get("notes")
    };
    saveTransaction(transaction);
    setTransactions([...transactions, transaction]);
    e.currentTarget.reset();
  };
  return /* @__PURE__ */ jsxs("div", { className: "max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8", children: [
    /* @__PURE__ */ jsx("h1", { className: "text-3xl font-bold text-gray-900 mb-6", children: "Inventory Transactions" }),
    /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 lg:grid-cols-2 gap-6", children: [
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx("h2", { className: "text-xl font-semibold text-gray-900 mb-4", children: "New Transaction" }),
        /* @__PURE__ */ jsxs(Form, { method: "post", onSubmit: handleSubmit, className: "space-y-4", children: [
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("label", { htmlFor: "productId", className: "block text-sm font-medium text-gray-700", children: "Product" }),
            /* @__PURE__ */ jsxs(
              "select",
              {
                name: "productId",
                id: "productId",
                required: true,
                className: "mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500",
                children: [
                  /* @__PURE__ */ jsx("option", { value: "", children: "Select a product" }),
                  products.map((product) => /* @__PURE__ */ jsx("option", { value: product.id, children: product.name }, product.id))
                ]
              }
            )
          ] }),
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("label", { htmlFor: "type", className: "block text-sm font-medium text-gray-700", children: "Type" }),
            /* @__PURE__ */ jsxs(
              "select",
              {
                name: "type",
                id: "type",
                required: true,
                className: "mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500",
                children: [
                  /* @__PURE__ */ jsx("option", { value: "IN", children: "Stock In" }),
                  /* @__PURE__ */ jsx("option", { value: "OUT", children: "Stock Out" })
                ]
              }
            )
          ] }),
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("label", { htmlFor: "quantity", className: "block text-sm font-medium text-gray-700", children: "Quantity" }),
            /* @__PURE__ */ jsx(
              "input",
              {
                type: "number",
                name: "quantity",
                id: "quantity",
                min: "1",
                required: true,
                className: "mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              }
            )
          ] }),
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("label", { htmlFor: "notes", className: "block text-sm font-medium text-gray-700", children: "Notes" }),
            /* @__PURE__ */ jsx(
              "textarea",
              {
                name: "notes",
                id: "notes",
                rows: 3,
                className: "mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              }
            )
          ] }),
          /* @__PURE__ */ jsx(
            "button",
            {
              type: "submit",
              className: "w-full px-4 py-2 text-sm font-medium text-white bg-blue-500 border border-transparent rounded-md shadow-sm hover:bg-blue-600",
              children: "Add Transaction"
            }
          )
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx("h2", { className: "text-xl font-semibold text-gray-900 mb-4", children: "Recent Transactions" }),
        /* @__PURE__ */ jsx("div", { className: "bg-white shadow-sm rounded-lg overflow-hidden", children: /* @__PURE__ */ jsxs("table", { className: "min-w-full divide-y divide-gray-200", children: [
          /* @__PURE__ */ jsx("thead", { className: "bg-gray-50", children: /* @__PURE__ */ jsxs("tr", { children: [
            /* @__PURE__ */ jsx("th", { className: "px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider", children: "Date" }),
            /* @__PURE__ */ jsx("th", { className: "px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider", children: "Product" }),
            /* @__PURE__ */ jsx("th", { className: "px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider", children: "Type" }),
            /* @__PURE__ */ jsx("th", { className: "px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider", children: "Quantity" })
          ] }) }),
          /* @__PURE__ */ jsx("tbody", { className: "bg-white divide-y divide-gray-200", children: transactions.map((transaction) => {
            const product = products.find((p) => p.id === transaction.productId);
            return /* @__PURE__ */ jsxs("tr", { children: [
              /* @__PURE__ */ jsx("td", { className: "px-6 py-4 whitespace-nowrap text-sm text-gray-500", children: new Date(transaction.date).toLocaleDateString() }),
              /* @__PURE__ */ jsx("td", { className: "px-6 py-4 whitespace-nowrap text-sm text-gray-900", children: product == null ? void 0 : product.name }),
              /* @__PURE__ */ jsx("td", { className: "px-6 py-4 whitespace-nowrap text-sm text-gray-500", children: transaction.type }),
              /* @__PURE__ */ jsx("td", { className: "px-6 py-4 whitespace-nowrap text-sm text-gray-500", children: transaction.quantity })
            ] }, transaction.id);
          }) })
        ] }) })
      ] })
    ] })
  ] });
}
const route1 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: Transactions
}, Symbol.toStringTag, { value: "Module" }));
function Products() {
  const [products, setProducts] = useState([]);
  useEffect(() => {
    setProducts(getProducts());
  }, []);
  return /* @__PURE__ */ jsxs("div", { className: "max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8", children: [
    /* @__PURE__ */ jsxs("div", { className: "flex justify-between items-center mb-6", children: [
      /* @__PURE__ */ jsx("h1", { className: "text-3xl font-bold text-gray-900", children: "Products" }),
      /* @__PURE__ */ jsx(
        Link,
        {
          to: "/products/new",
          className: "bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600",
          children: "Add Product"
        }
      )
    ] }),
    /* @__PURE__ */ jsx("div", { className: "bg-white shadow-sm rounded-lg overflow-hidden", children: /* @__PURE__ */ jsxs("table", { className: "min-w-full divide-y divide-gray-200", children: [
      /* @__PURE__ */ jsx("thead", { className: "bg-gray-50", children: /* @__PURE__ */ jsxs("tr", { children: [
        /* @__PURE__ */ jsx("th", { className: "px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider", children: "Name" }),
        /* @__PURE__ */ jsx("th", { className: "px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider", children: "SKU" }),
        /* @__PURE__ */ jsx("th", { className: "px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider", children: "Quantity" }),
        /* @__PURE__ */ jsx("th", { className: "px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider", children: "Price" }),
        /* @__PURE__ */ jsx("th", { className: "px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider", children: "Category" }),
        /* @__PURE__ */ jsx("th", { className: "px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider", children: "Actions" })
      ] }) }),
      /* @__PURE__ */ jsx("tbody", { className: "bg-white divide-y divide-gray-200", children: products.map((product) => /* @__PURE__ */ jsxs("tr", { children: [
        /* @__PURE__ */ jsx("td", { className: "px-6 py-4 whitespace-nowrap text-sm text-gray-900", children: product.name }),
        /* @__PURE__ */ jsx("td", { className: "px-6 py-4 whitespace-nowrap text-sm text-gray-500", children: product.sku }),
        /* @__PURE__ */ jsx("td", { className: "px-6 py-4 whitespace-nowrap text-sm text-gray-500", children: product.quantity }),
        /* @__PURE__ */ jsxs("td", { className: "px-6 py-4 whitespace-nowrap text-sm text-gray-500", children: [
          "$",
          product.price.toFixed(2)
        ] }),
        /* @__PURE__ */ jsx("td", { className: "px-6 py-4 whitespace-nowrap text-sm text-gray-500", children: product.category }),
        /* @__PURE__ */ jsxs("td", { className: "px-6 py-4 whitespace-nowrap text-right text-sm font-medium", children: [
          /* @__PURE__ */ jsx(
            Link,
            {
              to: `/products/${product.id}`,
              className: "text-blue-600 hover:text-blue-900 mr-4",
              children: "Edit"
            }
          ),
          /* @__PURE__ */ jsx(
            "button",
            {
              onClick: () => {
                if (confirm("Are you sure you want to delete this product?")) ;
              },
              className: "text-red-600 hover:text-red-900",
              children: "Delete"
            }
          )
        ] })
      ] }, product.id)) })
    ] }) })
  ] });
}
const route2 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: Products
}, Symbol.toStringTag, { value: "Module" }));
function NewProduct() {
  const navigate = useNavigate();
  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const product = {
      id: crypto.randomUUID(),
      name: formData.get("name"),
      description: formData.get("description"),
      sku: formData.get("sku"),
      quantity: parseInt(formData.get("quantity"), 10),
      price: parseFloat(formData.get("price")),
      category: formData.get("category"),
      createdAt: /* @__PURE__ */ new Date(),
      updatedAt: /* @__PURE__ */ new Date()
    };
    saveProduct(product);
    navigate("/products");
  };
  return /* @__PURE__ */ jsxs("div", { className: "max-w-2xl mx-auto py-6 px-4 sm:px-6 lg:px-8", children: [
    /* @__PURE__ */ jsx("h1", { className: "text-3xl font-bold text-gray-900 mb-6", children: "Add New Product" }),
    /* @__PURE__ */ jsxs(Form, { method: "post", onSubmit: handleSubmit, className: "space-y-6", children: [
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx("label", { htmlFor: "name", className: "block text-sm font-medium text-gray-700", children: "Name" }),
        /* @__PURE__ */ jsx(
          "input",
          {
            type: "text",
            name: "name",
            id: "name",
            required: true,
            className: "mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          }
        )
      ] }),
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx("label", { htmlFor: "description", className: "block text-sm font-medium text-gray-700", children: "Description" }),
        /* @__PURE__ */ jsx(
          "textarea",
          {
            name: "description",
            id: "description",
            rows: 3,
            className: "mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          }
        )
      ] }),
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx("label", { htmlFor: "sku", className: "block text-sm font-medium text-gray-700", children: "SKU" }),
        /* @__PURE__ */ jsx(
          "input",
          {
            type: "text",
            name: "sku",
            id: "sku",
            required: true,
            className: "mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          }
        )
      ] }),
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx("label", { htmlFor: "quantity", className: "block text-sm font-medium text-gray-700", children: "Quantity" }),
        /* @__PURE__ */ jsx(
          "input",
          {
            type: "number",
            name: "quantity",
            id: "quantity",
            min: "0",
            required: true,
            className: "mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          }
        )
      ] }),
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx("label", { htmlFor: "price", className: "block text-sm font-medium text-gray-700", children: "Price" }),
        /* @__PURE__ */ jsx(
          "input",
          {
            type: "number",
            name: "price",
            id: "price",
            min: "0",
            step: "0.01",
            required: true,
            className: "mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          }
        )
      ] }),
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx("label", { htmlFor: "category", className: "block text-sm font-medium text-gray-700", children: "Category" }),
        /* @__PURE__ */ jsx(
          "input",
          {
            type: "text",
            name: "category",
            id: "category",
            required: true,
            className: "mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          }
        )
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "flex justify-end space-x-4", children: [
        /* @__PURE__ */ jsx(
          "button",
          {
            type: "button",
            onClick: () => navigate("/products"),
            className: "px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50",
            children: "Cancel"
          }
        ),
        /* @__PURE__ */ jsx(
          "button",
          {
            type: "submit",
            className: "px-4 py-2 text-sm font-medium text-white bg-blue-500 border border-transparent rounded-md shadow-sm hover:bg-blue-600",
            children: "Save Product"
          }
        )
      ] })
    ] })
  ] });
}
const route3 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: NewProduct
}, Symbol.toStringTag, { value: "Module" }));
function Dashboard() {
  const [totalProducts, setTotalProducts] = useState(0);
  const [totalStock, setTotalStock] = useState(0);
  const [lowStockProducts, setLowStockProducts] = useState([]);
  const [recentTransactions, setRecentTransactions] = useState([]);
  useEffect(() => {
    const products = getProducts();
    const transactions = getTransactions();
    setTotalProducts(products.length);
    setTotalStock(products.reduce((sum, product) => sum + product.quantity, 0));
    setLowStockProducts(products.filter((product) => product.quantity < 10));
    setRecentTransactions(transactions.slice(-5));
  }, []);
  return /* @__PURE__ */ jsxs("div", { className: "max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8", children: [
    /* @__PURE__ */ jsx("h1", { className: "text-3xl font-bold text-gray-900 mb-6", children: "Dashboard" }),
    /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8", children: [
      /* @__PURE__ */ jsxs("div", { className: "bg-white p-6 rounded-lg shadow", children: [
        /* @__PURE__ */ jsx("h2", { className: "text-lg font-semibold text-gray-900 mb-2", children: "Total Products" }),
        /* @__PURE__ */ jsx("p", { className: "text-3xl font-bold text-blue-600", children: totalProducts })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "bg-white p-6 rounded-lg shadow", children: [
        /* @__PURE__ */ jsx("h2", { className: "text-lg font-semibold text-gray-900 mb-2", children: "Total Stock" }),
        /* @__PURE__ */ jsx("p", { className: "text-3xl font-bold text-green-600", children: totalStock })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "bg-white p-6 rounded-lg shadow", children: [
        /* @__PURE__ */ jsx("h2", { className: "text-lg font-semibold text-gray-900 mb-2", children: "Low Stock Items" }),
        /* @__PURE__ */ jsx("p", { className: "text-3xl font-bold text-red-600", children: lowStockProducts.length })
      ] })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 lg:grid-cols-2 gap-6", children: [
      /* @__PURE__ */ jsxs("div", { className: "bg-white p-6 rounded-lg shadow", children: [
        /* @__PURE__ */ jsx("h2", { className: "text-xl font-semibold text-gray-900 mb-4", children: "Low Stock Products" }),
        /* @__PURE__ */ jsx("div", { className: "divide-y divide-gray-200", children: lowStockProducts.map((product) => /* @__PURE__ */ jsxs("div", { className: "py-3", children: [
          /* @__PURE__ */ jsx("h3", { className: "text-sm font-medium text-gray-900", children: product.name }),
          /* @__PURE__ */ jsxs("p", { className: "text-sm text-gray-500", children: [
            "Quantity: ",
            product.quantity
          ] })
        ] }, product.id)) })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "bg-white p-6 rounded-lg shadow", children: [
        /* @__PURE__ */ jsx("h2", { className: "text-xl font-semibold text-gray-900 mb-4", children: "Recent Transactions" }),
        /* @__PURE__ */ jsx("div", { className: "divide-y divide-gray-200", children: recentTransactions.map((transaction) => /* @__PURE__ */ jsxs("div", { className: "py-3", children: [
          /* @__PURE__ */ jsxs("p", { className: "text-sm text-gray-500", children: [
            new Date(transaction.date).toLocaleDateString(),
            " - ",
            transaction.type
          ] }),
          /* @__PURE__ */ jsxs("p", { className: "text-sm font-medium text-gray-900", children: [
            "Quantity: ",
            transaction.quantity
          ] })
        ] }, transaction.id)) })
      ] })
    ] })
  ] });
}
const route4 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: Dashboard
}, Symbol.toStringTag, { value: "Module" }));
const meta = () => {
  return [
    { title: "Inventory Management System" },
    { name: "description", content: "Enterprise Inventory Management System" }
  ];
};
function Index() {
  return /* @__PURE__ */ jsx("div", { className: "min-h-screen bg-gray-100", children: /* @__PURE__ */ jsx("div", { className: "max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8", children: /* @__PURE__ */ jsxs("div", { className: "text-center", children: [
    /* @__PURE__ */ jsx("h1", { className: "text-4xl font-bold text-gray-900 mb-8", children: "Inventory Management System" }),
    /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6", children: [
      /* @__PURE__ */ jsxs(
        Link,
        {
          to: "/products",
          className: "bg-white p-6 rounded-lg shadow hover:shadow-lg transition",
          children: [
            /* @__PURE__ */ jsx("h2", { className: "text-xl font-semibold text-gray-900 mb-2", children: "Products" }),
            /* @__PURE__ */ jsx("p", { className: "text-gray-600", children: "Manage your product inventory" })
          ]
        }
      ),
      /* @__PURE__ */ jsxs(
        Link,
        {
          to: "/transactions",
          className: "bg-white p-6 rounded-lg shadow hover:shadow-lg transition",
          children: [
            /* @__PURE__ */ jsx("h2", { className: "text-xl font-semibold text-gray-900 mb-2", children: "Transactions" }),
            /* @__PURE__ */ jsx("p", { className: "text-gray-600", children: "Track inventory movements" })
          ]
        }
      ),
      /* @__PURE__ */ jsxs(
        Link,
        {
          to: "/dashboard",
          className: "bg-white p-6 rounded-lg shadow hover:shadow-lg transition",
          children: [
            /* @__PURE__ */ jsx("h2", { className: "text-xl font-semibold text-gray-900 mb-2", children: "Dashboard" }),
            /* @__PURE__ */ jsx("p", { className: "text-gray-600", children: "View inventory analytics" })
          ]
        }
      )
    ] })
  ] }) }) });
}
const route5 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: Index,
  meta
}, Symbol.toStringTag, { value: "Module" }));
const serverManifest = { "entry": { "module": "/assets/entry.client-ByOfz6iN.js", "imports": ["/assets/jsx-runtime-56DGgGmo.js", "/assets/components-BBsdKsiM.js"], "css": [] }, "routes": { "root": { "id": "root", "parentId": void 0, "path": "", "index": void 0, "caseSensitive": void 0, "hasAction": false, "hasLoader": false, "hasClientAction": false, "hasClientLoader": false, "hasErrorBoundary": false, "module": "/assets/root-BY4d-Oaw.js", "imports": ["/assets/jsx-runtime-56DGgGmo.js", "/assets/components-BBsdKsiM.js"], "css": ["/assets/root-Dr1bkvVh.css"] }, "routes/transactions._index": { "id": "routes/transactions._index", "parentId": "root", "path": "transactions", "index": true, "caseSensitive": void 0, "hasAction": false, "hasLoader": false, "hasClientAction": false, "hasClientLoader": false, "hasErrorBoundary": false, "module": "/assets/transactions._index-Bi4mNUYp.js", "imports": ["/assets/jsx-runtime-56DGgGmo.js", "/assets/localStorage-DrmKea_W.js", "/assets/components-BBsdKsiM.js"], "css": [] }, "routes/products._index": { "id": "routes/products._index", "parentId": "root", "path": "products", "index": true, "caseSensitive": void 0, "hasAction": false, "hasLoader": false, "hasClientAction": false, "hasClientLoader": false, "hasErrorBoundary": false, "module": "/assets/products._index-DTJf7jrr.js", "imports": ["/assets/jsx-runtime-56DGgGmo.js", "/assets/localStorage-DrmKea_W.js", "/assets/components-BBsdKsiM.js"], "css": [] }, "routes/products.new": { "id": "routes/products.new", "parentId": "root", "path": "products/new", "index": void 0, "caseSensitive": void 0, "hasAction": false, "hasLoader": false, "hasClientAction": false, "hasClientLoader": false, "hasErrorBoundary": false, "module": "/assets/products.new-zYZrmXM3.js", "imports": ["/assets/jsx-runtime-56DGgGmo.js", "/assets/localStorage-DrmKea_W.js", "/assets/components-BBsdKsiM.js"], "css": [] }, "routes/dashboard": { "id": "routes/dashboard", "parentId": "root", "path": "dashboard", "index": void 0, "caseSensitive": void 0, "hasAction": false, "hasLoader": false, "hasClientAction": false, "hasClientLoader": false, "hasErrorBoundary": false, "module": "/assets/dashboard-B7bhJ17G.js", "imports": ["/assets/jsx-runtime-56DGgGmo.js", "/assets/localStorage-DrmKea_W.js"], "css": [] }, "routes/_index": { "id": "routes/_index", "parentId": "root", "path": void 0, "index": true, "caseSensitive": void 0, "hasAction": false, "hasLoader": false, "hasClientAction": false, "hasClientLoader": false, "hasErrorBoundary": false, "module": "/assets/_index-ifoNFVU3.js", "imports": ["/assets/jsx-runtime-56DGgGmo.js", "/assets/components-BBsdKsiM.js"], "css": [] } }, "url": "/assets/manifest-2e3b6328.js", "version": "2e3b6328" };
const mode = "production";
const assetsBuildDirectory = "build/client";
const basename = "/";
const future = { "v3_fetcherPersist": false, "v3_relativeSplatPath": false, "v3_throwAbortReason": false, "v3_routeConfig": false, "v3_singleFetch": false, "v3_lazyRouteDiscovery": false, "unstable_optimizeDeps": false };
const isSpaMode = false;
const publicPath = "/";
const entry = { module: entryServer };
const routes = {
  "root": {
    id: "root",
    parentId: void 0,
    path: "",
    index: void 0,
    caseSensitive: void 0,
    module: route0
  },
  "routes/transactions._index": {
    id: "routes/transactions._index",
    parentId: "root",
    path: "transactions",
    index: true,
    caseSensitive: void 0,
    module: route1
  },
  "routes/products._index": {
    id: "routes/products._index",
    parentId: "root",
    path: "products",
    index: true,
    caseSensitive: void 0,
    module: route2
  },
  "routes/products.new": {
    id: "routes/products.new",
    parentId: "root",
    path: "products/new",
    index: void 0,
    caseSensitive: void 0,
    module: route3
  },
  "routes/dashboard": {
    id: "routes/dashboard",
    parentId: "root",
    path: "dashboard",
    index: void 0,
    caseSensitive: void 0,
    module: route4
  },
  "routes/_index": {
    id: "routes/_index",
    parentId: "root",
    path: void 0,
    index: true,
    caseSensitive: void 0,
    module: route5
  }
};
export {
  serverManifest as assets,
  assetsBuildDirectory,
  basename,
  entry,
  future,
  isSpaMode,
  mode,
  publicPath,
  routes
};
