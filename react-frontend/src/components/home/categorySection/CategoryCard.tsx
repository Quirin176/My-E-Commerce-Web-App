import { getCategoryIcon } from "../../../utils/getCategoryIcon";
import type { Category } from "../../../types/models/products/Category"

type CategoryCardProps = {
    category: Category;
    onClick: () => void;
}

export default function CategoryCard({ category, onClick }: CategoryCardProps) {

    return (
        <div
            className="relative w-32 h-32 bg-linear-to-br from-(--brand-primary) to-(--brand-secondary) rounded-2xl cursor-pointer"
            onClick={onClick}
        >
            <h1 className="font-bold text-white p-4">{category.name}</h1>

            <div className="absolute bottom-0 right-0 flex h-12 w-12 items-center justify-center rounded-2xl bg-(--bg-surface)">
                {getCategoryIcon(category.slug, 28)}
            </div>
        </div>
    )
}