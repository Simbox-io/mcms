// components/SpaceSortDropdown.tsx
import React from 'react';
import Select from '@/components/Select';

interface SpaceSortDropdownProps {
    sortOption: string;
    onSortOptionChange: (option: string) => void;
    className?: string;
}

const SpaceSortDropdown: React.FC<SpaceSortDropdownProps> = ({
                                                                 sortOption,
                                                                 onSortOptionChange,
                                                                 className = '',
                                                             }) => {
    const sortOptions = [
        { value: 'latest', label: 'Latest' },
        { value: 'popular', label: 'Popular' },
        { value: 'alphabetical', label: 'Alphabetical' },
    ];

    return (
        <Select
            value={[sortOption]}
            onChange={(value) => onSortOptionChange(value[0])}
            options={sortOptions}
            className={className}
        />
    );
};

export default SpaceSortDropdown;