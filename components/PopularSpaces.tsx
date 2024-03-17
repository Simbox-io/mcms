// components/PopularSpaces.tsx
import React, { useEffect, useState } from 'react';
import SpaceCard from '@/components/SpaceCard';
import EmptyState from '@/components/EmptyState';
import Spinner from '@/components/Spinner';
import { Space } from '@/lib/prisma';

interface PopularSpacesProps {
    onSpaceClick: (spaceId: number) => void;
}

const PopularSpaces: React.FC<PopularSpacesProps> = ({ onSpaceClick }) => {
    const [spaces, setSpaces] = useState<Space[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchPopularSpaces = async () => {
            try {
                const response = await fetch('/api/spaces/popular');
                if (response.ok) {
                    const data = await response.json();
                    setSpaces(data);
                } else {
                    console.error('Error fetching popular spaces:', response.statusText);
                }
            } catch (error) {
                console.error('Error fetching popular spaces:', error);
            }
            setIsLoading(false);
        };

        fetchPopularSpaces();
    }, []);

    const handleCardClick = (spaceId: number) => {
        onSpaceClick(spaceId);
    }

    if (isLoading) {
        return <Spinner />;
    }

    if (spaces.length === 0) {
        return (
            <EmptyState
                title="No popular spaces"
                description="There are no popular spaces at the moment."
            />
        );
    }

    return (
        <div className="p-4">
            <h2 className="text-xl font-semibold mb-4">Popular Spaces</h2>
            {spaces.map((space) => (
                <SpaceCard key={space.id} space={space} onClick={() => handleCardClick} />
            ))}
        </div>
    );
};

export default PopularSpaces;