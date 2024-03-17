// components/RecentlyViewedSpaces.tsx
import React, { useEffect, useState } from 'react';
import SpaceCard from '@/components/SpaceCard';
import EmptyState from '@/components/EmptyState';
import Spinner from '@/components/Spinner';
import  { Space } from '@/lib/prisma';

interface RecentlyViewedSpacesProps {
    onSpaceClick: (spaceId: number) => void;
}

const RecentlyViewedSpaces: React.FC<RecentlyViewedSpacesProps> = ({ onSpaceClick }) => {
    const [spaces, setSpaces] = useState<Space[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchRecentlyViewedSpaces = async () => {
            try {
                const response = await fetch('/api/spaces/recently-viewed');
                if (response.ok) {
                    const data = await response.json();
                    setSpaces(data);
                } else {
                    console.error('Error fetching recently viewed spaces:', response.statusText);
                }
            } catch (error) {
                console.error('Error fetching recently viewed spaces:', error);
            }
            setIsLoading(false);
        };

        fetchRecentlyViewedSpaces();
    }, []);

    const handleSpaceClick = (spaceId: number) => {
        onSpaceClick(spaceId);
    }

    if (isLoading) {
        return <Spinner />;
    }

    if (spaces.length === 0) {
        return (
            <EmptyState
                title="No recently viewed spaces"
                description="You haven't viewed any spaces recently."
            />
        );
    }

    return (
        <div className="p-4">
            <h2 className="text-xl font-semibold mb-4">Recently Viewed Spaces</h2>
            {spaces.map((space) => (
                <SpaceCard key={space.id} space={space} onClick={() => handleSpaceClick}/>
            ))}
        </div>
    );
};

export default RecentlyViewedSpaces;