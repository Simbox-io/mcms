// components/SpaceCard.tsx
import React from 'react';
import Card from '@/components/Card';
import Button from '@/components/Button';
import { Space, User } from "@/lib/prisma";
import { getSession } from 'next-auth/react';

interface SpaceCardProps {
    space: Space;
    onJoin?: () => void;
    onLeave?: () => void;
    onManage?: () => void;
    onPreview?: () => void;
}

const SpaceCard: React.FC<SpaceCardProps> = ({ space, onJoin, onLeave, onManage, onPreview }) => {
    return (
        <Card>
            <h3 className="text-xl font-semibold mb-2">{space.title}</h3>
            <p className="text-gray-600 mb-4">{space.description}</p>
            <div className="flex items-center justify-between">
                <div>
                    <p className="text-gray-500 text-sm">Created by {space.author.username}</p>
                    {space.project && (
                        <p className="text-gray-500 text-sm">Project: {space.project.name}</p>
                    )}
                </div>
                <div>
                    {/*space.isJoined ? (
                        <Button variant="secondary" onClick={onLeave}>
                            Leave
                        </Button>
                    ) : (
                        <Button variant="primary" onClick={onJoin}>
                            Join
                        </Button>
                    )}
                    {space.author.id === userId && (
                        <Button variant="secondary" onClick={onManage} className="ml-2">
                            Manage
                        </Button>
                    )*/}
                    <Button variant="secondary" onClick={onPreview} className="ml-2">
                        Preview
                    </Button>
                </div>
            </div>
        </Card>
    );
};

export default SpaceCard;