import { siteConfig } from "../../../config/siteConfig";
import type { ProductOption } from "../../../types/models/products/ProductOption";

interface Props {
  selectedCategory: string;
  filters: ProductOption[];
  loading: boolean;
  onLeave: () => void;
  onFilterClick: (category: string, optionId: string | number) => void;
  onViewAll: () => void;
}

export default function CategoryFiltersPanel({
  selectedCategory,
  filters,
  loading,
  onLeave,
  onFilterClick,
  onViewAll
}: Props) {
  const colors = siteConfig.colors;

  return (
    <div onMouseLeave={onLeave}>
      <div className="p-4 rounded-2xl">
        {loading ? (
          <div className="text-center py-12">Loading...</div>
        ) : filters?.length > 0 ? (
          <div className="space-y-3">
            {filters.map((option) => (
              <div key={option.optionId}>
                <h4 className="font-bold text-sm pb-1">{option.optionName}</h4>

                <div className="flex flex-wrap gap-2">
                  {option.optionValues.map((v) => (
                    <button
                      key={v.id}
                      onClick={() =>
                        onFilterClick(selectedCategory, v.id)
                      }
                      className="px-3 py-1 border rounded-lg text-sm cursor-pointer"
                    >
                      {v.value}
                    </button>
                  ))}
                </div>
              </div>
            ))}

            <button
              onClick={onViewAll}
              className="w-full py-2 text-white rounded-lg cursor-pointer"
              style={{ background: colors.primarycolor }}
            >
              View All
            </button>
          </div>
        ) : (
          <div className="text-center py-12">
            No filters available
          </div>
        )}
      </div>
    </div>
  );
}