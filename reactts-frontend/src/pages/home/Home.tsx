import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronDown, LayoutGrid } from "lucide-react";
import { siteConfig } from "../../config/siteConfig";
import { filterApi } from "../../api/products/filterApi";
import type { ProductOption } from "../../types/models/ProductOption.ts";
import CategoryTabs from "../../components/Product/CategoryTabs";

const Home = () => {
  const colors = siteConfig.colors;
  const categories = siteConfig.categories;

  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [categoryFilters, setCategoryFilters] = useState<Record<string, ProductOption[]>>({});
  const [loadingFilters, setLoadingFilters] = useState<Record<string, boolean>>({});
  const navigate = useNavigate();

  // Get icon component from category
  const getCategoryIcon = (categoryName: string) => {
    const category = categories.find(cat => cat.name === categoryName);
    if (category && category.icon) {
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
    <div className="flex flex-col items-center">
      <div>
        <div
          className="fixed left-1/2 transform -translate-x-1/2 bg-white border-0 rounded-xl shadow-2xl z-50 flex overflow-hidden"
          style={{ width: "1500px", height: "700px" }}
          onMouseLeave={handleClose}
        >
          {/* LEFT SIDE: CATEGORIES LIST */}
          <div className={`${selectedCategory ? "w-1/5" : "w-full"} border-r border-gray-200 overflow-y-auto bg-white transition-all duration-300`}>
            <div className="p-2 space-y-2">
              {categories.map((item) => (
                <button
                  key={item.id}
                  onMouseEnter={() => handleCategoryHover(item.slug)}
                  onClick={() => {
                    handleClose();
                    navigate(`/category/${encodeURIComponent(item.slug)}`);
                  }}
                  className="w-full flex items-center gap-3 px-4 py-3 rounded-lg cursor-pointer transition duration-200"
                  style={{
                    backgroundColor: selectedCategory === item.slug ? colors.primarycolor : "White",
                    color: selectedCategory === item.slug ? "White" : "Black"
                  }}
                >

                  {/* ICON BOX */}
                  <div
                    className="flex items-center justify-center w-8 h-8 rounded-md border-2 transition"
                    style={{ background: selectedCategory === item.slug ? colors.primarycolor : "#F9FAFB", borderColor: selectedCategory === item.slug ? "white" : "#E5E7EB" }}
                  >
                    <div className={selectedCategory === item.slug ? "text-white" : "text-gray-700"}>
                      {getCategoryIcon(item.name)}
                    </div>
                  </div>

                  {/* LABEL */}
                  <div className="flex-1 text-left">
                    <span className="font-semibold text-base block">{item.name}</span>
                  </div>
                  {/* ARROW */}
                  <ChevronDown
                    size={20}
                    className={`transition ${selectedCategory === item.slug ? "rotate-180" : ""}`}
                  />
                </button>
              ))}
            </div>
          </div>

          {/* RIGHT SIDE: FILTERS FOR SELECTED CATEGORY */}
          {selectedCategory && (
            <div className="w-4/5 overflow-y-auto bg-white">
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
                        style={{ background: colors.primarycolor }}
                      >
                        View All Products in {categories.find(c => c.slug === selectedCategory)?.name}
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
                      style={{ background: colors.primarycolor }}
                    >
                      View Products
                    </button>
                  </div>
                )}
              </div>
            </div>)}
        </div>


        {/* PANEL */}
        <div>
          <h2 className="text-4xl font-bold mb-10 text-center" style={{ color: colors.primarycolor }}>
            ⚠️ This is a demo store for testing purposes only.
            <br />
            No real orders will be processed. ⚠️
          </h2>

          <h2 className="text-4xl font-bold mb-10 text-center" style={{ color: colors.primarycolor }}>Welcome to My Store</h2>

          <p className="text-2xl text-black max-w-4xl text-center mb-10">
            Explore a wide range of high-quality products
            <br />
            Carefully organized into categories to help you quickly find what you’re looking for
          </p>

          <h3 className="text-4xl font-bold mb-10 text-center" style={{ color: colors.primarycolor }}>Explore Shop's Products</h3>
        </div>
      </div>

      <CategoryTabs categories={categories} />
    </div>
  );
};

export default Home;
