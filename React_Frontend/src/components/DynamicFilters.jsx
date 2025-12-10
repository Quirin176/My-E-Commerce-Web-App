import { useState } from "react";
import { ChevronDown } from "lucide-react";

export default function DynamicFilters({ 
  categories, 
  selectedOptions, 
  setSelectedOptions,
  minPrice,
  setMinPrice,
  maxPrice,
  setMaxPrice,
  priceOrder,
  setPriceOrder
}) {
  const [openDropdowns, setOpenDropdowns] = useState({});

  const toggleDropdown = (categoryId) => {
    setOpenDropdowns(prev => ({
      ...prev,
      [categoryId]: !prev[categoryId]
    }));
  };

  const toggleOption = (optionValueId) => {
    if (selectedOptions.includes(optionValueId)) {
      setSelectedOptions(selectedOptions.filter(o => o !== optionValueId));
    } else {
      setSelectedOptions([...selectedOptions, optionValueId]);
    }
  };

  return (
    <div className="bg-white p-3 rounded shadow border mb-4">
      <div className="flex flex-wrap gap-2 items-center">
        
        {/* Dynamic Option Dropdowns*/}
        {categories && categories.length > 0 && (
          <>
            {categories.map(category => {
              const selectedInCategory = selectedOptions.filter(id =>
                category.optionValues.some(v => v.optionValueId === id)
              );

              return (
                <div key={category.optionId} className="relative">
                  <button
                    onClick={() => toggleDropdown(category.optionId)}
                    className="flex items-center justify-between px-2 py-1.5 border rounded bg-white hover:bg-gray-50 transition text-sm min-w-28"
                  >
                    <span className="font-semibold text-gray-700 truncate text-xs">
                      {category.name}
                      {selectedInCategory.length > 0 && (
                        <span className="ml-1 text-xs bg-blue-500 text-white px-1.5 py-0.5 rounded inline-block">
                          {selectedInCategory.length}
                        </span>
                      )}
                    </span>
                    <ChevronDown
                      size={16}
                      className={`transition ml-1 flex-shrink-0 ${openDropdowns[category.optionId] ? 'rotate-180' : ''}`}
                    />
                  </button>

                  {openDropdowns[category.optionId] && (
                    <div className="absolute top-full left-0 mt-1 bg-white border rounded shadow-lg z-50 w-40" onMouseLeave={() => setOpenDropdowns(false)}>
                      <div className="p-2 max-h-48 overflow-y-auto">
                        {category.optionValues.map(value => (
                          <label
                            key={value.optionValueId}
                            className="flex items-center gap-2 px-2 py-1.5 rounded hover:bg-gray-100 transition cursor-pointer"
                          >
                            <input
                              type="checkbox"
                              checked={selectedOptions.includes(value.optionValueId)}
                              onChange={() => toggleOption(value.optionValueId)}
                              className="w-3 h-3"
                            />
                            <span className="text-gray-700 text-xs">{value.value}</span>
                          </label>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </>
        )}

        {/* Price Range and Sort - At the end */}
        <div className="ml-auto flex items-center gap-2">
          <div className="flex items-center gap-1">
            <label className="text-xs font-semibold text-gray-700 whitespace-nowrap">Price:</label>
            <input
              placeholder="Min"
              type="number"
              className="border p-1.5 rounded w-24 text-xs"
              value={minPrice}
              onChange={(e) => setMinPrice(e.target.value)}
            />
            <span className="text-xs text-gray-500">-</span>
            <input
              placeholder="Max"
              type="number"
              className="border p-1.5 rounded w-24 text-xs"
              value={maxPrice}
              onChange={(e) => setMaxPrice(e.target.value)}
            />
          </div>

          {/* Sort Dropdown */}
          <select
            className="border p-1.5 rounded text-xs min-w-32 bg-white hover:bg-gray-50 transition"
            value={priceOrder}
            onChange={(e) => setPriceOrder(e.target.value)}
          >
            <option value="newest">Newest</option>
            <option value="ascending">Low → High</option>
            <option value="descending">High → Low</option>
          </select>
        </div>
      </div>

      {/* Selected Filters Summary */}
      {selectedOptions.length > 0 && (
        <div className="mt-3 pt-3 border-t flex items-center justify-between">
          <div className="flex flex-wrap gap-1.5">
            {selectedOptions.map(id => {
              const option = categories
                .flatMap(c => c.optionValues)
                .find(v => v.optionValueId === id);
              return option ? (
                <span
                  key={id}
                  className="bg-blue-500 text-white px-2 py-1 rounded text-xs flex items-center gap-1"
                >
                  {option.value}
                  <button
                    onClick={() => toggleOption(id)}
                    className="hover:text-blue-200 font-bold"
                  >
                    ✕
                  </button>
                </span>
              ) : null;
            })}
          </div>
          <button
            onClick={() => setSelectedOptions([])}
            className="text-red-600 hover:underline text-xs font-semibold whitespace-nowrap ml-4"
          >
            Clear all
          </button>
        </div>
      )}
    </div>
  );
}
