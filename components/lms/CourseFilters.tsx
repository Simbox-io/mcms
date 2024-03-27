'use client'
import { CourseCategory, Tag } from '@/lib/prisma';

type CourseFiltersProps = {
  categories: CourseCategory[];
  tags: Tag[];
};

export default function CourseFilters({ categories, tags }: CourseFiltersProps) {
  return (
    <div className="bg-white dark:bg-gray-800 shadow p-4">
      <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white">Filters</h2>
      <div className="mb-4">
        <label htmlFor="category" className="block font-medium text-gray-700 dark:text-gray-300">Category</label>
        <select id="category" className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 bg-white dark:bg-gray-700 text-gray-800 dark:text-white">
          <option value="">All Categories</option>
          {categories?.length > 0 && categories.map((category) => (
            <option key={category.id} value={category.id}>{category.name}</option>
          ))}
        </select>
      </div>
      <div>
        <label htmlFor="tags" className="block font-medium text-gray-700 dark:text-gray-300">Tags</label>
        <select id="tags" multiple className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 bg-white dark:bg-gray-700 text-gray-800 dark:text-white">
          {tags?.length > 0 && tags.map((tag) => (
            <option key={tag.id} value={tag.id}>{tag.name}</option>
          ))}
        </select>
      </div>
    </div>
  );
}