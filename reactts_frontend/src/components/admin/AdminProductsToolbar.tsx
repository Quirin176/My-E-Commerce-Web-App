import { Search, X } from "lucide-react";

export default function AdminProductsToolbar({
  categories,
  activeCategory,
  setActiveCategory,
  brands,
  activeBrand,
  setActiveBrand,
  searchTerm,
  setSearchTerm,
  minPrice,
  setMinPrice,
  maxPrice,
  setMaxPrice,
  onAddNew,
}) {
  return (
    <div className="bg-white p-4 rounded-lg shadow mb-6 space-y-4">
      
      {/* Row 1: Search & Add Button */}
      <div className="flex gap-3">
        <div className="flex-1 relative">
          <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search by name, slug, or ID..."
            className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition"
            >
              <X size={18} />
            </button>
          )}
        </div>
        
        <button
          onClick={onAddNew}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-semibold whitespace-nowrap transition"
        >
          + Add Product
        </button>
      </div>

      {/* Row 2: Filters */}
      <div className="flex gap-3 flex-wrap items-end">
        
        {/* Category Selector */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">
            Category
          </label>
          <select
            value={activeCategory || ""}
            onChange={(e) => setActiveCategory(e.target.value ? parseInt(e.target.value) : null)}
            className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white transition"
          >
            <option value="">All Categories</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </select>
        </div>

        {/* Brand Selector */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">
            Brand
          </label>
          <select
            value={activeBrand || ""}
            onChange={(e) => setActiveBrand(e.target.value || null)}
            className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white transition"
            disabled={brands.length === 0}
          >
            <option value="">All Brands</option>
            {brands.map((brand) => (
              <option key={brand} value={brand}>
                {brand}
              </option>
            ))}
          </select>
        </div>

        {/* Price Range */}
        <div className="flex gap-2 items-end">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              Min Price
            </label>
            <input
              type="number"
              placeholder="0"
              className="border border-gray-300 rounded-lg px-3 py-2 w-32 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
              value={minPrice}
              onChange={(e) => setMinPrice(e.target.value)}
            />
          </div>
          <span className="text-gray-400 mb-2 font-semibold">→</span>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              Max Price
            </label>
            <input
              type="number"
              placeholder="999999"
              className="border border-gray-300 rounded-lg px-3 py-2 w-32 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
              value={maxPrice}
              onChange={(e) => setMaxPrice(e.target.value)}
            />
          </div>
        </div>

        {/* Clear Filters */}
        <button
          onClick={() => {
            setSearchTerm("");
            setMinPrice("");
            setMaxPrice("");
            setActiveCategory(null);
            setActiveBrand(null);
          }}
          className="px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg font-semibold text-sm transition border border-red-200"
        >
          Clear All
        </button>
      </div>

      {/* Active Filters Summary */}
      {(searchTerm || minPrice || maxPrice || activeCategory || activeBrand) && (
        <div className="text-sm text-gray-700 bg-blue-50 p-2 rounded border border-blue-200">
          <strong>Active Filters:</strong>
          {searchTerm && <span> Search: "<span className="font-semibold">{searchTerm}</span>"</span>}
          {activeCategory && <span> | Category: <span className="font-semibold">{categories.find(c => c.id === activeCategory)?.name}</span></span>}
          {activeBrand && <span> | Brand: <span className="font-semibold">{activeBrand}</span></span>}
          {minPrice && <span> | Min: <span className="font-semibold">{minPrice}</span> VND</span>}
          {maxPrice && <span> | Max: <span className="font-semibold">{maxPrice}</span> VND</span>}
        </div>
      )}
    </div>
  );
}
