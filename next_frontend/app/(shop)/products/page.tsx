'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { productsAPI, categoriesAPI, filtersAPI } from '@/lib/api';
import { Product, Category } from '@/types';
import toast from 'react-hot-toast';

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [filters, setFilters] = useState<any[]>([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [minPrice, setMinPrice] = useState(0);
  const [maxPrice, setMaxPrice] = useState(100000000);
  const [selectedOptions, setSelectedOptions] = useState<number[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const catsRes = await categoriesAPI.getAll();
        setCategories(catsRes.data);
      } catch (error) {
        toast.error('Failed to load categories');
      }
    };
    loadData();
  }, []);

  useEffect(() => {
    const loadProducts = async () => {
      setLoading(true);
      try {
        const params: any = {
          minPrice,
          maxPrice,
        };

        if (selectedCategory) {
          params.category = selectedCategory;
        }

        if (selectedOptions.length > 0) {
          params.options = selectedOptions.join(',');
        }

        const res = await productsAPI.getAll(params);
        setProducts(res.data);
      } catch (error) {
        toast.error('Failed to load products');
      } finally {
        setLoading(false);
      }
    };

    loadProducts();
  }, [selectedCategory, minPrice, maxPrice, selectedOptions]);

  useEffect(() => {
    const loadFilters = async () => {
      if (!selectedCategory) {
        setFilters([]);
        return;
      }
      try {
        const res = await filtersAPI.getByCategory(selectedCategory);
        setFilters(res.data);
      } catch (error) {
        toast.error('Failed to load filters');
      }
    };
    loadFilters();
  }, [selectedCategory]);

  return (
    <div className="grid grid-cols-4 gap-6">
      {/* Sidebar */}
      <aside className="col-span-1">
        <div className="bg-white p-4 rounded shadow">
          <h3 className="font-bold mb-4">Categories</h3>
          <select
            value={selectedCategory}
            onChange={(e) => {
              setSelectedCategory(e.target.value);
              setSelectedOptions([]);
            }}
            className="w-full border rounded px-2 py-2 mb-6"
          >
            <option value="">All Categories</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.slug}>
                {cat.name}
              </option>
            ))}
          </select>

          <h3 className="font-bold mb-4">Price</h3>
          <div className="space-y-2 mb-6">
            <input
              type="range"
              min="0"
              max="10000000"
              value={minPrice}
              onChange={(e) => setMinPrice(Number(e.target.value))}
              className="w-full"
            />
            <input
              type="range"
              min="0"
              max="10000000"
              value={maxPrice}
              onChange={(e) => setMaxPrice(Number(e.target.value))}
              className="w-full"
            />
            <p className="text-sm">
              {minPrice.toLocaleString()} - {maxPrice.toLocaleString()}
            </p>
          </div>

          {filters.map((filter) => (
            <div key={filter.optionId} className="mb-6">
              <h4 className="font-semibold mb-2">{filter.name}</h4>
              {filter.optionValues.map((val: any) => (
                <label key={val.optionValueId} className="flex items-center mb-2">
                  <input
                    type="checkbox"
                    checked={selectedOptions.includes(val.optionValueId)}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setSelectedOptions([...selectedOptions, val.optionValueId]);
                      } else {
                        setSelectedOptions(
                          selectedOptions.filter((id) => id !== val.optionValueId)
                        );
                      }
                    }}
                    className="mr-2"
                  />
                  {val.value}
                </label>
              ))}
            </div>
          ))}
        </div>
      </aside>

      {/* Products Grid */}
      <div className="col-span-3">
        {loading ? (
          <p>Loading products...</p>
        ) : products.length === 0 ? (
          <p>No products found</p>
        ) : (
          <div className="grid grid-cols-3 gap-4">
            {products.map((product) => (
              <Link key={product.id} href={`/products/${product.slug}`}>
                <div className="border rounded overflow-hidden hover:shadow-lg transition cursor-pointer">
                  <img
                    src={product.imageUrl}
                    alt={product.name}
                    className="w-full h-48 object-cover"
                  />
                  <div className="p-4">
                    <h3 className="font-bold truncate">{product.name}</h3>
                    <p className="text-gray-600 text-sm line-clamp-2">
                      {product.shortDescription}
                    </p>
                    <p className="text-blue-600 font-bold mt-2">
                      ${product.price.toLocaleString()}
                    </p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
