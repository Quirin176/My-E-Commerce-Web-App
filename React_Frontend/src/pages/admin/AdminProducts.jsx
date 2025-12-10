import React, { useEffect, useState, useMemo } from "react";
import { adminApi } from "../../api/adminApi";
import { categoryApi } from "../../api/categoryApi";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";

// Helper function for sorting
const sortData = (data, sortConfig) => {
  if (!sortConfig.key) return data;

  const sortableData = [...data];

  sortableData.sort((a, b) => {
    const aValue = String(a[sortConfig.key]).toLowerCase();
    const bValue = String(b[sortConfig.key]).toLowerCase();

    const isNumeric = sortConfig.key === "price";

    if (isNumeric) {
      const aNum = parseFloat(a[sortConfig.key]);
      const bNum = parseFloat(b[sortConfig.key]);

      return sortConfig.direction === "ascending" ? aNum - bNum : bNum - aNum;
    }

    if (aValue < bValue) {
      return sortConfig.direction === "ascending" ? -1 : 1;
    }
    if (aValue > bValue) {
      return sortConfig.direction === "ascending" ? 1 : -1;
    }
    return 0;
  });

  return sortableData;
};

export default function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [activeTab, setActiveTab] = useState(null);
  const [loading, setLoading] = useState(true);
  const [sortConfig, setSortConfig] = useState({
    key: null,
    direction: "ascending",
  });

  // Load categories
  useEffect(() => {
    const loadCategories = async () => {
      try {
        const data = await categoryApi.getAll();
        const catList = Array.isArray(data) ? data : [];
        setCategories(catList);
        if (catList.length > 0) {
          setActiveTab(catList[0].id);
        }
      } catch (error) {
        console.error("Error loading categories:", error);
        toast.error("Failed to load categories");
      }
    };
    loadCategories();
  }, []);

  // Load all products
  useEffect(() => {
    const loadProducts = async () => {
      setLoading(true);
      try {
        const data = await adminApi.getProducts();
        const productList = Array.isArray(data) ? data : [];
        setProducts(productList);
      } catch (error) {
        console.error("Error loading products:", error);
        toast.error("Failed to load products");
      } finally {
        setLoading(false);
      }
    };
    loadProducts();
  }, []);

  // Filter products by active category
  const filteredProducts = useMemo(() => {
    if (!activeTab) return products;
    return products.filter((p) => p.categoryId === activeTab);
  }, [products, activeTab]);

  // Sort filtered products
  const sortedProducts = useMemo(() => {
    return sortData(filteredProducts, sortConfig);
  }, [filteredProducts, sortConfig]);

  const requestSort = (key) => {
    let direction = "ascending";

    if (sortConfig.key === key && sortConfig.direction === "ascending") {
      direction = "descending";
    }

    setSortConfig({ key, direction });
  };

  const getSortIndicator = (key) => {
    if (sortConfig.key !== key) return null;
    return sortConfig.direction === "ascending" ? " ▲" : " ▼";
  };

  const sortableColumns = [
    { key: "id", label: "ID" },
    { key: "name", label: "Name" },
    { key: "slug", label: "Slug" },
    { key: "price", label: "Price" },
  ];

  // Delete handler
  const handleDelete = async (productId, productName) => {
    if (!window.confirm(`Are you sure you want to delete: ${productName}?`)) {
      return;
    }

    try {
      await adminApi.deleteProduct(productId);
      setProducts((prevProducts) => prevProducts.filter((p) => p.id !== productId));
      toast.success(`${productName} deleted successfully`);
    } catch (error) {
      console.error(`Failed to delete product:`, error);
      toast.error("Failed to delete product");
    }
  };

  const activeCategoryName = categories.find((c) => c.id === activeTab)?.name || "All";

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Product Management</h1>
        <Link
          to="/admin/products/new"
          className="px-4 py-2 bg-blue-600 text-white rounded font-semibold hover:bg-blue-700 transition"
        >
          Add New Product
        </Link>
      </div>

      {/* Category Buttons */}
      <div style={{ display: "flex", justifyContent: "center", gap: 10, marginBottom: 20, flexWrap: "wrap" }}>
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setActiveTab(cat.id)}
            style={{
              padding: "10px 20px",
              borderRadius: 10,
              border: "1px solid #ccc",
              cursor: "pointer",
              background: activeTab === cat.id ? "#4169E1" : "white",
              color: activeTab === cat.id ? "white" : "black",
              fontSize: 16,
              fontWeight: "bold",
              transition: "all 0.2s",
            }}
          >
            {cat.name}
          </button>
        ))}
      </div>

      {/* TABLE */}
      {loading ? (
        <p className="text-center text-gray-500 py-8">Loading products...</p>
      ) : sortedProducts.length === 0 ? (
        <p className="text-center text-gray-500 py-8">No products in {activeCategoryName} category.</p>
      ) : (
        <table className="w-full border">
          <thead>
            <tr className="bg-gray-100">
              {sortableColumns.map((col) => (
                <th
                  key={col.key}
                  className="p-3 border cursor-pointer hover:bg-gray-200"
                  onClick={() => requestSort(col.key)}
                >
                  {col.label}
                  {getSortIndicator(col.key)}
                </th>
              ))}
              <th className="p-3 border">Image</th>
              <th className="p-3 border">Action</th>
            </tr>
          </thead>

          <tbody>
            {sortedProducts.map((p) => (
              <tr key={p.id} className="border hover:bg-gray-50">
                <td className="p-3 text-center">{p.id}</td>
                <td className="p-3 text-left">{p.name}</td>
                <td className="p-3 text-center">{p.slug}</td>
                <td className="p-3 text-right">{p.price?.toLocaleString() || "N/A"} VND</td>
                <td className="p-3 text-center">
                  <img
                    src={p.imageUrl || p.image || "https://via.placeholder.com/48?text=No+Image"}
                    className="w-12 h-12 object-cover mx-auto rounded"
                    alt={p.name}
                  />
                </td>

                <td className="p-3 text-center space-x-2">
                  <Link
                    to={`/admin/products/${p.id}`}
                    className="px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700 transition text-sm"
                  >
                    Edit
                  </Link>
                  <button
                    onClick={() => handleDelete(p.id, p.name)}
                    className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700 transition text-sm"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
