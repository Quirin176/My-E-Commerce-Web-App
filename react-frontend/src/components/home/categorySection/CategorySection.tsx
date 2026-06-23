import CategoryCard from "./CategoryCard";
import type { Category } from "../../../types/models/products/Category"
import { useNavigate } from "react-router-dom";

type CategorySectionProps = {
    categories: Category[];
}

export default function CategorySection({ categories }: CategorySectionProps) {
    const navigate = useNavigate();

    const handleCardClick = (slug: string) => {
        navigate(`/category/${slug}`);
    }

    return (
        <div>
            <h2 className="text-4xl font-bold my-8 text-center text-(--text-primary)">Browse by Categories</h2>

            <div className="w-full grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-3 px-2">
                {categories.map((category) => (
                    <CategoryCard
                        key={category.id}
                        category={category}
                        onClick={() => handleCardClick(category.slug)}
                    />
                ))}
            </div>
        </div>
    )
}