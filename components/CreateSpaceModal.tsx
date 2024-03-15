// components/CreateSpaceModal.tsx
import React, { useState } from 'react';
import Modal from '@/components/Modal';
import FormGroup from '@/components/FormGroup';
import Input from '@/components/Input';
import Textarea from '@/components/Textarea';
import Select from '@/components/Select';
import Button from '@/components/Button';
import { Project } from '@/lib/prisma'; 

interface CreateSpaceModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (title: string, description: string, projectId: number | null) => void;
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
    const [projectId, setProjectId] = useState<number | null>(null);

    const handleSubmit = () => {
        onSubmit(title, description, projectId);
        setTitle('');
        setDescription('');
        setProjectId(null);
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Create Space">
            <FormGroup>
                <Input
                    name="title"
                    id="title"
                    type="text"
                    placeholder="Title"
                    value={title}
                    onChange={(e) => setTitle}
                />
            </FormGroup>
            <FormGroup>
                <Textarea
                    placeholder="Description"
                    value={description}
                    onChange={(e) => setDescription}
                />
            </FormGroup>
            <FormGroup>
                <Select
                    options={{...projects.map((project) => ({ value: project.id, label: project.name }))}}
                    value={[projectId] ?[] : []}
                    onChange={(value) => setProjectId}
                />
            </FormGroup>
            <div className="flex justify-end">
                <Button onClick={handleSubmit}>Create</Button>
            </div>
        </Modal>
    );
};

export default CreateSpaceModal;