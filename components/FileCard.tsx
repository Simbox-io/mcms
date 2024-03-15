// components/FileCard.tsx
import React from 'react';
import Card from '@/components/Card';
import DownloadButton from './DownloadButton';
import { File } from '@/lib/prisma';
interface FileCardProps {
    file: File;
    description: string;
    onClick: () => void;
}

const FileCard: React.FC<FileCardProps> = ({ file, onClick }) => {
    return (
        <Card onClick={onClick} >
            <div className="h-32" >
                <h2 className="text-lg font-semibold mb-2 text-gray-800 dark:text-white ">{file.name}</h2>
                <p className="text-gray-600 dark:text-gray-400">{file.description}</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                    Uploaded on {new Date(file.createdAt).toLocaleDateString()}
                </p>
            </div>
            <DownloadButton onClick={onClick} className="mt-4" />
        </Card>
    );
};

export default FileCard;