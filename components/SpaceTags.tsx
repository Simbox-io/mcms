// components/SpaceTags.tsx
import React from 'react';
import Link from 'next/link';

const SpaceTags: React.FC = () => {
    const tags = [
        { id: 1, name: 'JavaScript' },
    ];

    return (
        <div className="p-4">
            <h2 className="text-xl font-semibold mb-4">Tags</h2>
            <div className="flex flex-wrap gap-2">
                {tags.map((tag) => (
                    <Link
                        key={tag.id}
                        href={`/spaces?tag=${tag.id}`}
                        className="px-2 py-1 bg-gray-200 dark:bg-gray-700 rounded-md text-sm"
                    >
                        {tag.name}
                    </Link>
                ))}
            </div>
        </div>
    );
};

export default SpaceTags;