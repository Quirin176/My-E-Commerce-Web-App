import { getCategoryIcon } from "../../utils/getCategoryIcon";

interface Props {
  categories: any[];
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
        {categories.map((item) => (
          <button
            key={item.id}
            onMouseEnter={() => onHover(item.slug)}
            onClick={() => onClick(item.slug)}
            className={`flex items-center gap-3 px-4 py-2 rounded-lg transition cursor-pointer
              ${selectedCategory === item.slug ? "text-(--text-secondary) bg-(--brand-primary)" : "text-(--text-primary) bg-(--bg-surface)"}`}
          >
            <div
              className={`w-8 h-8 flex items-center justify-center rounded-md border-2
              ${selectedCategory === item.slug ? "text-(--text-secondary) bg-(--brand-primary)" : "text-(--text-primary) bg-(--bg-surface)"}`}
            >
              {getCategoryIcon(item.slug, 20)}
            </div>

            <span className="font-semibold">{item.name}</span>
          </button>
        ))}
      </div>
    </div>
  );
}