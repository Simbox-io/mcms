// components/SpaceCategoryFilter.tsx
import React from 'react';
import Link from 'next/link';

interface SpaceCategoryFilterProps {
    selectedCategory: string | null;
    onCategoryFilter: (category: string | null) => void;
    className?: string;
}

const SpaceCategoryFilter: React.FC<SpaceCategoryFilterProps> = ({
                                                                     selectedCategory,
                                                                     onCategoryFilter,
                                                                     className = '',
                                                                 }) => {
    const categories = [{id: 1, name: 'Category 1'}, {id: 2, name: 'Category 2'}, {id: 3, name: 'Category 3'}]; // Replace with your actual categories

    return (
        <div className="p-4">
            <h2 className="text-xl font-semibold mb-4">Categories</h2>
            <ul className="space-y-2">
                {categories.map((category) => (
                    <li key={category.id}>
                        <Link href={`/spaces?category=${category.id}`}>{category.name}</Link>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default SpaceCategoryFilter;