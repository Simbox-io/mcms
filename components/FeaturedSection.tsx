// components/FeaturedSection.tsx
import React from 'react';

interface FeaturedSectionProps {
    title: string;
    children: React.ReactNode;
    className?: string;
}

const FeaturedSection: React.FC<FeaturedSectionProps> = ({ title, children, className = '' }) => {
    return (
        <section className={`${className}`}>
            <h2 className="text-3xl font-semibold mb-8 text-gray-800 dark:text-white">{title}</h2>
            {children}
        </section>
    );
};

export default FeaturedSection;