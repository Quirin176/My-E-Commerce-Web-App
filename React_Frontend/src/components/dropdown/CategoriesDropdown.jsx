import { useState } from "react";
import { ChevronDown, LayoutGrid, X } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { filterApi } from "../../api/filterApi";

export default function CategoriesDropdown({ categories = [], textColor = "", listhoverBg = "" }) {
  const [open, setOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [categoryFilters, setCategoryFilters] = useState({});
  const [loadingFilters, setLoadingFilters] = useState({});
  const navigate = useNavigate();

  // Load filters when category is hovered
  const handleCategoryHover = async (categoryLink) => {
    if (categoryFilters[categoryLink]) {
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
    navigate(`/category/${encodeURIComponent(categoryLink)}?filter=${optionValueId}`);
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedCategory(null);
  };

  return (
    <div className="relative inline-block font-semibold">
      <button 
        className="flex items-center gap-2 px-2 py-1 border rounded font-semibold hover:shadow-md transition" 
        style={{ color: textColor }} 
        onMouseUp={() => setOpen(true)}
      >
        <LayoutGrid size={18} />
        <span className="text-base">Categories</span>
        <ChevronDown size={18} className={`${open ? "rotate-180" : ""} transition`} />
      </button>

      {/* DARK OVERLAY */}
      {open && (
        <div 
          className="fixed inset-0 bg-black/30 z-40"
          onClick={handleClose}
        />
      )}

      {/* DROPDOWN PANEL - HORIZONTALLY CENTERED, VERTICALLY CENTERED ON PAGE */}
      {open && (
        <div 
          className="fixed left-1/2 transform -translate-x-1/2 bg-white border-0 rounded-xl shadow-2xl z-50 flex overflow-hidden"
          style={{ width: "1400px", height: "700px" }}
          onMouseLeave={handleClose}
        >
          {/* LEFT SIDE: CATEGORIES LIST */}
          <div className={`${selectedCategory ? "w-1/4" : "w-full"} border-r border-gray-200 overflow-y-auto bg-white transition-all duration-300`}>
            <div className="sticky top-0 bg-gradient-to-b from-blue-600 to-blue-500 text-white p-4 z-10">
              <h3 className="text-lg font-bold">Categories</h3>
            </div>
            
            <div className="p-3 space-y-2">
              {categories.map((item, index) => (
                <button
                  key={index}
                  onMouseEnter={() => handleCategoryHover(item.link)}
                  onClick={() => {
                    handleClose();
                    navigate(`/category/${encodeURIComponent(item.link)}`);
                  }}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg cursor-pointer transition duration-200 ${
                    selectedCategory === item.link 
                      ? "bg-blue-600 text-white shadow-md" 
                      : "hover:bg-white hover:shadow-sm text-gray-700"
                  }`}
                >
                  {/* IMAGE */}
                  <img 
                    src={item.image} 
                    alt={item.label} 
                    className="w-12 h-12 object-cover rounded-md border border-gray-200"
                  />
                  {/* LABEL */}
                  <div className="flex-1 text-left">
                    <span className="font-semibold text-base block">{item.label}</span>
                  </div>
                  {/* ARROW */}
                  <ChevronDown 
                    size={16} 
                    className={`transition ${selectedCategory === item.link ? "rotate-180" : ""}`}
                  />
                </button>
              ))}
            </div>
          </div>

          {/* RIGHT SIDE: FILTERS FOR SELECTED CATEGORY */}
          {selectedCategory && (
            <div className="w-3/4 overflow-y-auto bg-white">
            {selectedCategory && (
              <div>
                {/* HEADER */}
                <div className="sticky top-0 bg-gradient-to-r from-blue-600 to-blue-500 border-b border-gray-200 px-4 py-1 z-10">
                  <h3 className="text-xl font-bold text-white">
                    {categories.find(c => c.link === selectedCategory)?.label}
                  </h3>
                  <p className="text-sm text-white mt-1">Choose filters</p>
                </div>

                {/* CONTENT */}
                <div className="p-8">
                  {loadingFilters[selectedCategory] ? (
                    <div className="text-center py-12">
                      <div className="inline-block">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                      </div>
                      <p className="text-gray-500 text-sm mt-4">Loading filters...</p>
                    </div>
                  ) : categoryFilters[selectedCategory]?.length > 0 ? (
                    <div className="space-y-8">
                      {categoryFilters[selectedCategory].map((option) => (
                        <div key={option.optionId}>
                          {/* OPTION NAME */}
                          <h4 className="text-sm font-bold text-gray-800 mb-4 uppercase tracking-wide">
                            {option.name}
                          </h4>

                          {/* OPTION VALUES */}
                          <div className="flex flex-wrap gap-3">
                            {option.optionValues.map((value) => (
                              <button
                                key={value.optionValueId}
                                onClick={() => handleFilterClick(selectedCategory, value.optionValueId)}
                                className="px-4 py-2 bg-gray-100 text-gray-700 text-sm rounded-lg hover:bg-blue-600 hover:text-white hover:shadow-md transition duration-200 font-medium border border-gray-200 hover:border-blue-600"
                              >
                                {value.value}
                              </button>
                            ))}
                          </div>
                        </div>
                      ))}

                      {/* DIVIDER */}
                      <div className="border-t border-gray-200 pt-8">
                        {/* VIEW ALL BUTTON */}
                        <button
                          onClick={() => {
                            handleClose();
                            navigate(`/category/${encodeURIComponent(selectedCategory)}`);
                          }}
                          className="w-full px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white text-sm font-bold rounded-lg hover:shadow-lg transition duration-200 hover:from-blue-700 hover:to-blue-800"
                        >
                          View All Products in {categories.find(c => c.link === selectedCategory)?.label}
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-12">
                      <p className="text-gray-500 text-sm mb-6">No filters available for this category</p>
                      <button
                        onClick={() => {
                          handleClose();
                          navigate(`/category/${encodeURIComponent(selectedCategory)}`);
                        }}
                        className="px-6 py-3 bg-blue-600 text-white text-sm font-bold rounded-lg hover:bg-blue-700 transition duration-200"
                      >
                        View Products
                      </button>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>)}
        </div>
      )}
    </div>
  );
}