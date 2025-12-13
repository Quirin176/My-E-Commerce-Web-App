import { useState } from "react";
import { ChevronDown, Grid, X } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { filterApi } from "../../api/filterApi";
import { siteConfig } from "../../config/siteConfig";

export default function CategoriesDropdown({ categories = [], textColor = "", listhoverBg = "" }) {
  const [open, setOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [categoryFilters, setCategoryFilters] = useState({});
  const [loadingFilters, setLoadingFilters] = useState({});
  const navigate = useNavigate();

  // Load filters when category is hovered
  const handleCategoryHover = async (categoryLink) => {
    if (categoryFilters[categoryLink]) {
      // Already loaded
      setSelectedCategory(categoryLink);
      return;
    }

    setLoadingFilters(prev => ({ ...prev, [categoryLink]: true }));
    try {
      const filters = await filterApi.getFiltersByCategory(categoryLink);
      setCategoryFilters(prev => ({
        ...prev,
        [categoryLink]: filters || []
      }));
      setSelectedCategory(categoryLink);
    } catch (error) {
      console.error("Error loading category filters:", error);
      setCategoryFilters(prev => ({
        ...prev,
        [categoryLink]: []
      }));
      setSelectedCategory(categoryLink);
    } finally {
      setLoadingFilters(prev => ({ ...prev, [categoryLink]: false }));
    }
  };

  // Handle filter click - navigate with filter applied
  const handleFilterClick = (categoryLink, optionValueId) => {
    setOpen(false);
    // Navigate to category page with filter in query params
    navigate(`/category/${encodeURIComponent(categoryLink)}?filter=${optionValueId}`);
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedCategory(null);
  };

  return (
    <div className="relative inline-block font-semibold">
      <button 
        className="flex items-center gap-2 px-4 py-2 border rounded font-semibold hover:shadow-md transition" 
        style={{ color: textColor }} 
        onMouseEnter={() => setOpen(true)}
      >
        <Grid size={18} />
        <span className="text-lg">Categories</span>
        <ChevronDown size={18} className={`${open ? "rotate-180" : ""} transition`} />
      </button>

      {/* DARK OVERLAY */}
      {open && (
        <div 
          className="fixed inset-0 bg-black/40 z-40"
          onClick={handleClose}
        />
      )}

      {/* DROPDOWN CONTAINER */}
      {open && (
        <div 
          className="absolute left-0 mt-2 bg-white border rounded shadow-lg p-2 z-50 flex"
          style={{ width: "1400px", maxHeight: "700px" }}
          onMouseLeave={handleClose}
        >
          {/* LEFT SIDE: CATEGORIES LIST */}
          <div className="w-1/3 border-r overflow-y-auto">
            {categories.map((item, index) => (
              <div
                key={index}
                onMouseEnter={() => handleCategoryHover(item.link)}
                className={`flex items-center gap-3 px-3 py-2 rounded cursor-pointer transition ${
                  selectedCategory === item.link 
                    ? "bg-blue-100" 
                    : "hover:bg-gray-100"
                }`}
              >
                {/* IMAGE */}
                <img 
                  src={item.image} 
                  alt={item.label} 
                  className="w-8 h-8 object-cover rounded"
                />
                {/* LABEL */}
                <span className="text-base font-medium flex-1">{item.label}</span>
                {/* ARROW */}
                <ChevronDown size={16} className="text-gray-400" />
              </div>
            ))}
          </div>

          {/* RIGHT SIDE: FILTERS FOR SELECTED CATEGORY */}
          
          <div className="w-2/3 pl-4 overflow-y-auto">
            {selectedCategory && (
              <div>
                {/* <div className="sticky top-0 bg-white py-2 mb-3">
                  <h3 className="text-sm font-bold text-gray-800">
                    {categories.find(c => c.link === selectedCategory)?.label} - Filters
                  </h3>
                </div> */}

                {loadingFilters[selectedCategory] ? (
                  <div className="text-center py-8">
                    <p className="text-gray-500 text-sm">Loading filters...</p>
                  </div>
                ) : categoryFilters[selectedCategory]?.length > 0 ? (
                  <div className="space-y-4">
                    {categoryFilters[selectedCategory].map((option) => (
                      <div key={option.optionId} className="border-b pb-3 last:border-b-0">
                        {/* OPTION NAME */}
                        <h4
                        className="text-xs font-bold mb-2 uppercase"
                        style={{color: siteConfig.colors.headerBg}}
                        >
                          {option.name}
                        </h4>

                        {/* OPTION VALUES */}
                        <div className="flex flex-wrap gap-2">
                          {option.optionValues.map((value) => (
                            <button
                              key={value.optionValueId}
                              onClick={() => handleFilterClick(selectedCategory, value.optionValueId)}
                              className="px-3 py-1 bg-gray-100 text-gray-700 text-xs rounded hover:bg-blue-600 hover:text-white transition cursor-pointer font-medium"
                            >
                              {value.value}
                            </button>
                          ))}
                        </div>
                      </div>
                    ))}

                    {/* VIEW ALL LINK */}
                    <button
                      onClick={() => {
                        setOpen(false);
                        navigate(`/category/${encodeURIComponent(selectedCategory)}`);
                      }}
                      className="w-full mt-4 px-4 py-2 bg-blue-600 text-white text-xs font-semibold rounded hover:bg-blue-700 transition"
                    >
                      View All Products in {categories.find(c => c.link === selectedCategory)?.label}
                    </button>
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <p className="text-gray-500 text-sm">No filters available for this category</p>
                    <button
                      onClick={() => {
                        setOpen(false);
                        navigate(`/category/${encodeURIComponent(selectedCategory)}`);
                      }}
                      className="inline-block mt-3 px-4 py-2 bg-blue-600 text-white text-xs font-semibold rounded hover:bg-blue-700 transition"
                    >
                      View Products
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
