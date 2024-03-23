// components/CreateSpaceModal.tsx
'use client'
import React, { useState } from 'react';
import Modal from '@/components/next-gen/Modal';
import Input from '@/components/next-gen/Input';
import Textarea from '@/components/next-gen/Textarea';
import Select from '@/components/next-gen/Select';
import Button from '@/components/next-gen/Button';
import { Project } from '@/lib/prisma';

interface CreateSpaceModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (title: string, description: string, projectId: string | null) => void;
    projects: Project[];
}

const CreateSpaceModal: React.FC<CreateSpaceModalProps> = ({
    isOpen,
    onClose,
    onSubmit,
    projects,
}) => {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [projectId, setProjectId] = useState<string | null>(null);

    const handleSubmit = () => {
        onSubmit(title, description, projectId);
        setTitle('');
        setDescription('');
        setProjectId(null);
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Create Space">
            <Input
                type="text"
                placeholder="Title"
                value={title}
                onChange={(e) => setTitle}
            />
            <Textarea
                placeholder="Description"
                value={description}
                onChange={(e) => setDescription}
            />
            <Select
                options={projects.map((project) => ({
                    value: project.id.toString(),
                    label: project.name,
                }))}
                value={projectId ? projectId.toString() : ''}
                placeholder="Select a project"
                onChange={(value) => setProjectId(projectId ? String(value) : null)}
            />
            <div className="flex justify-end">
                <Button onClick={handleSubmit}>Create</Button>
            </div>
        </Modal>
    );
};

export default CreateSpaceModal;