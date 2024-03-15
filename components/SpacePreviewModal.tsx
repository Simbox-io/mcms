import React from 'react';
import Modal from '@/components/Modal';
import { Space } from '@/lib/prisma';

interface SpacePreviewModalProps {
    isOpen: boolean;
    onClose: () => void;
    space: Space | null;
}

const SpacePreviewModal: React.FC<SpacePreviewModalProps> = ({ isOpen, onClose, space }) => {
    if (!space) {
        return null;
    }

    return (
        <Modal isOpen={isOpen} onClose={onClose} title={space.title}>
            <p className="text-gray-600 mb-4">{space.description}</p>
            {/* Add more preview content as needed */}
        </Modal>
    );
};

export default SpacePreviewModal;