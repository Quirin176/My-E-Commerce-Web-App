import { getCategoryIcon } from "../../utils/getCategoryIcon";
import type { Category } from "../../types/models/products/Category";

interface Props {
  categories: Category[];
  selectedCategory: string | null;
  onHover: (slug: string) => void;
  onClick: (slug: string) => void;
}

export default function CategoryPanel({
  categories,
  selectedCategory,
  onHover,
  onClick
}: Props) {

  return (
    <div className="overflow-y-auto rounded-2xl">
      <div className="flex flex-col bg-(--bg-surface)">
        {categories.map((category) => (
          <button
            key={category.id}
            onMouseEnter={() => onHover(category.slug)}
            onClick={() => onClick(category.slug)}
            className={`flex items-center gap-3 px-4 py-2 rounded-lg transition cursor-pointer
              ${selectedCategory === category.slug ? "text-(--text-secondary) bg-(--brand-primary)" : "text-(--text-primary) bg-(--bg-surface)"}`}
          >
            <div
              className={`w-8 h-8 flex items-center justify-center rounded-md border-2
              ${selectedCategory === category.slug ? "text-(--text-secondary) bg-(--brand-primary)" : "text-(--text-primary) bg-(--bg-surface)"}`}
            >
              {getCategoryIcon(category.slug, 20)}
            </div>

            <span className="font-semibold">{category.name}</span>
          </button>
        ))}
      </div>
    </div>
  );
}