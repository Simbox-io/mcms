// components/MembersList.tsx
import React from 'react';
import Avatar from '@/components/Avatar';
import Button from '@/components/Button';
import Tooltip from '@/components/Tooltip';

interface MembersListProps {
    members: {
        id: number;
        username: string;
        avatar: string;
    }[];
    onRemoveMember: (memberId: number) => void;
}

const MembersList: React.FC<MembersListProps> = ({ members, onRemoveMember }) => {
    return (
        <ul className="space-y-4">
            {members.map((member) => (
                <li key={member.id} className="flex items-center justify-between">
                    <div className="flex items-center">
                        <Avatar src={member.avatar} alt={member.username} size="medium" />
                        <span className="ml-2 font-semibold">{member.username}</span>
                    </div>
                    <Tooltip content="Remove member">
                        <Button variant="danger" onClick={() => onRemoveMember(member.id)}>
                            Remove
                        </Button>
                    </Tooltip>
                </li>
            ))}
        </ul>
    );
};

export default MembersList;