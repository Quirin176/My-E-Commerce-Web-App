import React, { useEffect, useState, useMemo } from "react";
import { adminApi } from "../../api/adminApi";
import { categoryApi } from "../../api/categoryApi";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import AdminProductsToolbar from "../../components/admin/AdminProductsToolbar";

export default function AdminProducts() {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  // Toolbar states
  const [activeCategory, setActiveCategory] = useState(null);
  const [activeBrand, setActiveBrand] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");

  // Sort states
  const [sortConfig, setSortConfig] = useState({
    key: "id",
    direction: "desc",
  });

  // Load categories
  useEffect(() => {
    const loadCategories = async () => {
      try {
        const data = await categoryApi.getAll();
        const catList = Array.isArray(data) ? data : [];
        setCategories(catList);
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
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };
    loadProducts();
  }, []);

  // Extract unique brands from products in selected category
  const brands = useMemo(() => {
    let filtered = products;
    
    if (activeCategory) {
      filtered = filtered.filter((p) => p.categoryId === activeCategory);
    }

    const brandSet = new Set();
    filtered.forEach((p) => {
      if (p.options && Array.isArray(p.options)) {
        const brandOption = p.options.find(
          (opt) => opt.optionName.toLowerCase() === "brand"
        );
        if (brandOption && brandOption.value) {
          brandSet.add(brandOption.value);
        }
      }
    });

    return Array.from(brandSet).sort();
  }, [products, activeCategory]);

  // Apply all filters
  const filteredProducts = useMemo(() => {
    let filtered = [...products];

    // Filter by category
    if (activeCategory) {
      filtered = filtered.filter((p) => p.categoryId === activeCategory);
    }

    // Filter by brand
    if (activeBrand) {
      filtered = filtered.filter((p) => {
        if (p.options && Array.isArray(p.options)) {
          const brandOption = p.options.find(
            (opt) => opt.optionName.toLowerCase() === "brand"
          );
          return brandOption && brandOption.value === activeBrand;
        }
        return false;
      });
    }

    // Filter by search term
    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(
        (p) =>
          p.name.toLowerCase().includes(term) ||
          p.slug.toLowerCase().includes(term) ||
          p.id.toString().includes(term)
      );
    }

    // Filter by price range
    if (minPrice) {
      filtered = filtered.filter((p) => p.price >= parseFloat(minPrice));
    }
    if (maxPrice) {
      filtered = filtered.filter((p) => p.price <= parseFloat(maxPrice));
    }

    return filtered;
  }, [products, activeCategory, activeBrand, searchTerm, minPrice, maxPrice]);

  // Sort products
  const sortedProducts = useMemo(() => {
    const sorted = [...filteredProducts];

    if (!sortConfig.key) return sorted;

    sorted.sort((a, b) => {
      let aValue = a[sortConfig.key];
      let bValue = b[sortConfig.key];

      // Handle numeric sorting
      if (sortConfig.key === "price" || sortConfig.key === "id") {
        aValue = parseFloat(aValue) || 0;
        bValue = parseFloat(bValue) || 0;
        return sortConfig.direction === "asc" ? aValue - bValue : bValue - aValue;
      }

      // Handle string sorting
      aValue = String(aValue).toLowerCase();
      bValue = String(bValue).toLowerCase();

      if (aValue < bValue) {
        return sortConfig.direction === "asc" ? -1 : 1;
      }
      if (aValue > bValue) {
        return sortConfig.direction === "asc" ? 1 : -1;
      }
      return 0;
    });

    return sorted;
  }, [filteredProducts, sortConfig]);

  // Handle sort column click
  const handleSort = (key) => {
    setSortConfig((prev) => ({
      key,
      direction: prev.key === key && prev.direction === "asc" ? "desc" : "asc",
    }));
  };

  // Get sort indicator
  const getSortIndicator = (key) => {
    if (sortConfig.key !== key) return " ⇅";
    return sortConfig.direction === "asc" ? " ▲" : " ▼";
  };

  // Delete handler
  const handleDelete = async (productId, productName) => {
    if (!window.confirm(`Are you sure you want to delete: ${productName}?`)) {
      return;
    }

    try {
      await adminApi.deleteProduct(productId);
      setProducts((prevProducts) =>
        prevProducts.filter((p) => p.id !== productId)
      );
      toast.success(`${productName} deleted successfully`);
    } catch (error) {
      console.error(`Failed to delete product:`, error);
      toast.error("Failed to delete product");
    }
  };

  const sortableColumns = [
    { key: "id", label: "ID" },
    { key: "name", label: "Name" },
    { key: "slug", label: "Slug" },
    { key: "price", label: "Price (VND)" },
  ];

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Product Management</h1>
        <p className="text-gray-600 mt-2">
          Manage, edit, and delete your product inventory
        </p>
      </div>

      {/* Toolbar */}
      <AdminProductsToolbar
        categories={categories}
        activeCategory={activeCategory}
        setActiveCategory={setActiveCategory}
        brands={brands}
        activeBrand={activeBrand}
        setActiveBrand={setActiveBrand}
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        minPrice={minPrice}
        setMinPrice={setMinPrice}
        maxPrice={maxPrice}
        setMaxPrice={setMaxPrice}
        onAddNew={() => navigate("/admin/products/new")}
      />

      {/* Results Summary */}
      {!loading && (
        <div className="mb-4 text-sm text-gray-600">
          <span className="font-semibold">
            {sortedProducts.length}
          </span>
          {" "}
          product{sortedProducts.length !== 1 ? "s" : ""} found
          {activeCategory && (
            <span className="ml-2">
              in <span className="font-semibold">{categories.find(c => c.id === activeCategory)?.name}</span>
            </span>
          )}
          {activeBrand && (
            <span className="ml-2">
              from <span className="font-semibold">{activeBrand}</span>
            </span>
          )}
        </div>
      )}

      {/* TABLE */}
      {loading ? (
        <div className="text-center py-12">
          <div className="inline-block">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
          <p className="text-gray-500 mt-4">Loading products...</p>
        </div>
      ) : categories.length === 0 ? (
        <div className="bg-white rounded-lg shadow p-8 text-center">
          <p className="text-gray-500 text-lg">No categories available.</p>
          <p className="text-gray-400 mt-2">Create categories first in the backend.</p>
        </div>
      ) : sortedProducts.length === 0 ? (
        <div className="bg-white rounded-lg shadow p-8 text-center">
          <p className="text-gray-500 text-lg">
            {searchTerm || minPrice || maxPrice || activeCategory || activeBrand
              ? "No products match your filters."
              : "No products found."}
          </p>
          <p className="text-gray-400 mt-2">
            {!searchTerm && !minPrice && !maxPrice && !activeCategory && !activeBrand && (
              <>
                <button
                  onClick={() => navigate("/admin/products/new")}
                  className="text-blue-600 hover:underline font-semibold"
                >
                  Create your first product
                </button>
              </>
            )}
          </p>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-100 border-b-2 border-gray-300">
                <tr>
                  {sortableColumns.map((col) => (
                    <th
                      key={col.key}
                      className="px-6 py-3 text-left font-semibold text-gray-700 cursor-pointer hover:bg-gray-200 transition select-none"
                      onClick={() => handleSort(col.key)}
                      title="Click to sort"
                    >
                      {col.label}
                      <span className="text-gray-500 ml-1 text-xs">
                        {getSortIndicator(col.key)}
                      </span>
                    </th>
                  ))}
                  <th className="px-6 py-3 text-left font-semibold text-gray-700">
                    Image
                  </th>
                  <th className="px-6 py-3 text-center font-semibold text-gray-700">
                    Action
                  </th>
                </tr>
              </thead>

              <tbody>
                {sortedProducts.map((p, idx) => (
                  <tr
                    key={p.id}
                    className={`border-b hover:bg-blue-50 transition ${
                      idx % 2 === 0 ? "bg-white" : "bg-gray-50"
                    }`}
                  >
                    <td className="px-6 py-4 font-semibold text-blue-600">
                      {p.id}
                    </td>
                    <td className="px-6 py-4 text-gray-800 font-medium">
                      {p.name}
                    </td>
                    <td className="px-6 py-4 text-gray-600 text-sm">
                      {p.slug}
                    </td>
                    <td className="px-6 py-4 text-right font-semibold text-gray-800">
                      {p.price?.toLocaleString() || "N/A"}
                    </td>
                    <td className="px-6 py-4 text-center">
                      <img
                        src={
                          p.imageUrl ||
                          p.image ||
                          "https://via.placeholder.com/48?text=No+Image"
                        }
                        className="w-12 h-12 object-cover mx-auto rounded border border-gray-200"
                        alt={p.name}
                        onError={(e) => {
                          e.target.src =
                            "https://via.placeholder.com/48?text=No+Image";
                        }}
                      />
                    </td>

                    <td className="px-6 py-4 text-center space-x-2">
                      <Link
                        to={`/admin/products/${p.id}`}
                        className="inline-block px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700 transition text-sm font-semibold"
                      >
                        Edit
                      </Link>
                      <button
                        onClick={() => handleDelete(p.id, p.name)}
                        className="inline-block px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700 transition text-sm font-semibold"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Table Footer */}
          <div className="px-6 py-4 bg-gray-50 border-t text-sm text-gray-600 font-semibold">
            Showing {sortedProducts.length} of {products.length} total products
          </div>
        </div>
      )}
    </div>
  );
}
