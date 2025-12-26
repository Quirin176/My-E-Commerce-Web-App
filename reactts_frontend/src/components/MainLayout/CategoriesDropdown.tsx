import { useState } from "react";
import { ChevronDown, LayoutGrid } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { filterApi } from "../../api/filterApi";
import { siteConfig } from "../../config/siteConfig";
import type { Category } from "../../types/models/Category";
import type { ProductOption } from "../../types/models/ProductOption.ts";

export default function CategoriesDropdown({ categories = siteConfig.categories }) {
  const colors = siteConfig.colors;
  const [open, setOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [categoryFilters, setCategoryFilters] = useState<Record<string, ProductOption[]>>({});
  const [loadingFilters, setLoadingFilters] = useState<Record<string, boolean>>({});
    const navigate = useNavigate();

  // Get icon component from category
  const getCategoryIcon = (category: Category) => {
    if (category.icon) {
      const IconComponent = category.icon;
      return <IconComponent size={20} />;
    }
    return <LayoutGrid size={20} />;
  };

  // Load filters when category is hovered
  const handleCategoryHover = async (categoryLink: string) => {
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
  const handleFilterClick = (categoryLink: string, optionValueId: string | number) => {
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
        style={{ color: "White" }} 
        onClick={() => setOpen(!open)}
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
          style={{ width: "1500px", height: "700px" }}
          onMouseLeave={handleClose}
        >
          {/* LEFT SIDE: CATEGORIES LIST */}
          <div className={`${selectedCategory ? "w-1/5" : "w-full"} border-r border-gray-200 overflow-y-auto bg-white transition-all duration-300`}>
            <div
            className="sticky bg-linear-to-b text-white pl-4 py-2"
            style={{ background: colors.primarycolor}}
            >
              <h3 className="text-lg font-bold">Categories</h3>
            </div>
            
            <div className="p-2 space-y-2">
              {categories.map((item, index) => (
                <button
                  key={index}
                  onMouseEnter={() => handleCategoryHover(item.link)}
                  onClick={() => {
                    handleClose();
                    navigate(`/category/${encodeURIComponent(item.link)}`);
                  }}
                  className="w-full flex items-center gap-3 px-4 py-3 rounded-lg cursor-pointer transition duration-200"
                  style={{
                    backgroundColor: selectedCategory === item.link ? colors.primarycolor : "White",
                    color: selectedCategory === item.link ? "White" : "Black"
                  }}
                >

                  {/* ICON BOX */}
                  <div
                  // className={`flex items-center justify-center w-12 h-12 rounded-md border-2 transition ${
                  //   selectedCategory === item.link
                  //     ? "border-white bg-blue-700"
                  //     : "border-gray-200 bg-gray-50"}`}
                  className="flex items-center justify-center w-8 h-8 rounded-md border-2 transition"  
                  style={{ background: selectedCategory === item.link ? colors.primarycolor : "#F9FAFB",
                  borderColor: selectedCategory === item.link ? "white" : "#E5E7EB"}}
                  >
                    <div className={selectedCategory === item.link ? "text-white" : "text-gray-700"}>
                      {getCategoryIcon(item)}
                    </div>
                  </div>
                  
                  {/* LABEL */}
                  <div className="flex-1 text-left">
                    <span className="font-semibold text-base block">{item.label}</span>
                  </div>
                  {/* ARROW */}
                  <ChevronDown 
                    size={20} 
                    className={`transition ${selectedCategory === item.link ? "rotate-180" : ""}`}
                  />
                </button>
              ))}
            </div>
          </div>

          {/* RIGHT SIDE: FILTERS FOR SELECTED CATEGORY */}
          {selectedCategory && (
            <div className="w-4/5 overflow-y-auto bg-white">

                {/* HEADER */}
                <div
                  className="sticky bg-linear-to-r border-b border-gray-200 pl-4 py-2"
                  style={{ background: colors.primarycolor}}
                >
                  <p className="text-lg font-bold text-white">Filters</p>
                </div>

                {/* CONTENT */}
                <div className="p-4">
                  {loadingFilters[selectedCategory] ? (
                    <div className="text-center py-12">
                      <div className="inline-block">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                      </div>
                      <p className="text-gray-500 text-sm mt-4">Loading filters...</p>
                    </div>
                  ) : categoryFilters[selectedCategory]?.length > 0 ? (
                    <div className="space-y-4">
                      {categoryFilters[selectedCategory].map((option) => (
                        <div key={option.optionId}>
                          {/* OPTION NAME */}
                          <h4 className="text-sm font-bold text-gray-800 mb-4 uppercase tracking-wide">
                            {option.name}
                          </h4>

                          {/* OPTION VALUES */}
                          <div className="flex flex-wrap gap-2">
                            {option.optionValues.map((value) => (
                              <button
                                key={value.optionValueId}
                                onClick={() => handleFilterClick(selectedCategory, value.optionValueId)}
                                className="px-4 py-2 bg-white hover:bg-gray-700 text-gray-700 hover:text-white text-sm rounded-lg hover:shadow-md transition duration-200 font-medium border border-gray-300"
                              >
                                {value.value}
                              </button>
                            ))}
                          </div>
                        </div>
                      ))}

                      {/* DIVIDER */}
                      <div className="border-t border-gray-200 pt-4">
                        {/* VIEW ALL BUTTON */}
                        <button
                          onClick={() => {
                            handleClose();
                            navigate(`/category/${encodeURIComponent(selectedCategory)}`);
                          }}
                          className="w-full px-6 py-3 bg-linear-to-r text-white text-sm font-bold rounded-lg hover:shadow-lg transition duration-200 hover:brightness-75"
                          style={{ background: colors.primarycolor}}
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
                        className="px-6 py-3 text-white text-sm font-bold rounded-lg hover:brightness-75 transition duration-200"
                        style={{ background: colors.primarycolor}}
                      >
                        View Products
                      </button>
                    </div>
                  )}
                </div>
              </div>)}
        </div>
      )}
    </div>
  );
}