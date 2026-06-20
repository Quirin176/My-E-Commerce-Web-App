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

            <div className="w-full flex gap-4 justify-center">
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