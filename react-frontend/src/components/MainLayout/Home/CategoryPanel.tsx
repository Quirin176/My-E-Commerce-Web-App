import { LayoutGrid } from "lucide-react";
import { categoriesIcon, siteConfig } from "../../../config/siteConfig";

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
  const colors = siteConfig.colors;

  const getCategoryIcon = (slug: string) => {
    const Icon = categoriesIcon[slug.toLowerCase()];
    return Icon ? <Icon size={20} /> : <LayoutGrid size={20} />;
  };

  return (
    <div className="bg-white overflow-y-auto rounded-2xl">
      <div className="flex flex-col gap-y-4">
        {categories.map((item) => (
          <button
            key={item.id}
            onMouseEnter={() => onHover(item.slug)}
            onClick={() => onClick(item.slug)}
            className="flex items-center gap-3 px-4 py-2 rounded-lg transition"
            style={{
              backgroundColor:
                selectedCategory === item.slug
                  ? colors.primarycolor
                  : "white",
              color: selectedCategory === item.slug ? "white" : "black"
            }}
          >
            <div
              className="w-8 h-8 flex items-center justify-center rounded-md border-2"
              style={{
                background:
                  selectedCategory === item.slug
                    ? colors.primarycolor
                    : "#F9FAFB"
              }}
            >
              {getCategoryIcon(item.slug)}
            </div>

            <span className="font-semibold">{item.name}</span>
          </button>
        ))}
      </div>
    </div>
  );
}