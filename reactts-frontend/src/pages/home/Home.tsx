import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { LayoutGrid } from "lucide-react";
import { siteConfig } from "../../config/siteConfig";
import { categoryApi } from "../../api/products/categoryApi";
import type { ProductOption } from "../../types/models/products/ProductOption.ts";
import CategoryTabs from "../../components/Product/CategoryTabs";

export default function Home() {
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
      const filters = await categoryApi.getFiltersBySlug(categoryLink);
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
    navigate(`/category/${encodeURIComponent(categoryLink)}?filter=${optionValueId}`);
  };

  const handlePanelLeave = () => {
    setSelectedCategory(null);
  };

  return (
    <div className="flex flex-col items-center w-full">
      <div className="w-full flex" style={{ height: 500 }}>
        {/* LEFT SIDE: CATEGORIES PANEL */}
        <div 
          className="w-1/6 bg-white border-r border-gray-200 overflow-y-auto"
          // onMouseLeave={handlePanelLeave}
        >
          <div className="p-4">            
            {categories.map((item) => (
              <button
                key={item.id}
                onMouseEnter={() => handleCategoryHover(item.slug)}
                onClick={() => {
                  handlePanelLeave();
                  navigate(`/category/${encodeURIComponent(item.slug)}`);
                }}
                className="w-full flex items-center gap-3 px-4 py-1 rounded-lg cursor-pointer transition duration-200"
                style={{
                  backgroundColor: selectedCategory === item.slug ? colors.primarycolor : "white",
                  color: selectedCategory === item.slug ? "white" : "black"
                }}
              >
                {/* ICON BOX */}
                <div
                  className="flex items-center justify-center w-8 h-8 rounded-md border-2 transition"
                  style={{ 
                    background: selectedCategory === item.slug ? colors.primarycolor : "#F9FAFB", 
                    borderColor: selectedCategory === item.slug ? "white" : "#E5E7EB"
                  }}
                >
                  <div className={selectedCategory === item.slug ? "text-white" : "text-gray-700"}>
                    {getCategoryIcon(item.name)}
                  </div>
                </div>
                
                {/* LABEL */}
                <div className="flex-1 text-left">
                  <span className="font-semibold text-base block">{item.name}</span>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* CENTER SIDE: DYNAMIC CONTENT OR WARNING PANEL */}
        <div className="flex-1 overflow-y-auto">
          {selectedCategory ? (
            // Show Filters when category is hovered
            <div onMouseLeave={handlePanelLeave}>
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
                  <div className="space-y-2">
                    {categoryFilters[selectedCategory].map((option) => (
                      <div key={option.optionId}>
                        {/* OPTION NAME */}
                        <h4 className="text-sm font-bold text-gray-800 mb-1 tracking-wide">
                          {option.name}
                        </h4>

                        {/* OPTION VALUES */}
                        <div className="flex flex-wrap gap-2">
                          {option.optionValues.map((optionvalue) => (
                            <button
                              key={optionvalue.optionValueId}
                              onClick={() => handleFilterClick(selectedCategory, optionvalue.optionValueId)}
                              className="px-4 py-1 bg-white hover:bg-gray-700 text-gray-700 hover:text-white text-xs rounded-lg hover:shadow-md transition duration-200 font-medium border border-gray-300"
                            >
                              {optionvalue.value}
                            </button>
                          ))}
                        </div>
                      </div>
                    ))}

                    <div>
                      {/* VIEW ALL BUTTON */}
                      <button
                        onClick={() => {
                          handlePanelLeave();
                          navigate(`/category/${encodeURIComponent(selectedCategory)}`);
                        }}
                        className="w-full px-6 py-3 text-white text-sm font-bold rounded-lg hover:shadow-lg transition duration-200 hover:brightness-75"
                        style={{ background: colors.primarycolor}}
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
                        handlePanelLeave();
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
            </div>
          ) : (
            // Show Welcome Panel when no category is hovered
            <div className="p-12 flex flex-col items-center justify-center">
              <div className="max-w-2xl text-center">
                <h2 
                  className="text-5xl font-bold mb-8"
                  style={{ color: colors.primarycolor }}
                >
                  Welcome to My Store
                </h2>

                <p className="text-2xl text-gray-700 mb-8">
                  Explore a wide range of high-quality products
                </p>

                <div className="bg-yellow-50 border-2 border-yellow-400 rounded-xl p-8 mb-8">
                  <p className="text-yellow-800 font-bold text-lg">
                    ⚠️ This is a demo store for testing purposes only.
                    <br />
                    No real orders will be processed. ⚠️
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* RIGHT PANEL FOR ADVERTISING*/}
        <div className="w-1/6 bg-gray-100 border-l border-gray-200 overflow-y-auto">
          <div className="p-4">
            <div className="text-center">
              <h3 className="text-lg font-bold mb-4">Special Offer!</h3>
              <p className="text-gray-700 mb-6">Get 20% off on your first purchase. Use code: WELCOME20</p>
              <img 
                src="https://via.placeholder.com/200x150.png?text=Ad+Banner" 
                alt="Advertisement Banner" 
                className="mx-auto rounded-lg shadow-md"
              />
            </div>
        </div>
        </div>
      </div>

      {/* CATEGORY TABS SECTION BELOW */}
      <section className="w-full py-12 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <h2 
            className="text-4xl font-bold mb-10 text-center"
            style={{ color: colors.primarycolor }}
          >
            Featured Products
          </h2>
          <CategoryTabs />
        </div>
      </section>
    </div>
  );
};
