// components/ProjectCard.tsx
import React from 'react';
import Card from '@/components/Card';
import {User, Project} from "@/lib/prisma";

interface ProjectCardProps {
    project: Project;
    onClick: () => void;
}

const ProjectCard: React.FC<ProjectCardProps> = ({ project, onClick }) => {
    return (
        <Card onClick={onClick}>
            {/*<img src={project.image} alt={project.title} className="w-full h-48 object-cover mb-4" />*/}
            <h2 className="text-xl font-semibold mb-2 text-gray-800 dark:text-gray-200">{project.name}</h2>
            <p className="text-gray-600 dark:text-gray-100">by {project.owner.username}</p>
            <p className="text-gray-600 dark:text-gray-300">{project.description}</p>
        </Card>
    );
};

export default ProjectCard;