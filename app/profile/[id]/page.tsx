// app/profile/[id]/page.tsx
'use client';
import React, { useEffect, useState } from 'react';
import { User, Project, File, Space } from '@/lib/prisma';
import { motion } from 'framer-motion';
import Avatar from '@/components/Avatar';
import Button from '@/components/Button';
import Tabs from '@/components/Tabs';
import Skeleton from '@/components/Skeleton';
import ProjectCard from '@/components/ProjectCard';
import FileCard from '@/components/FileCard';
import SpaceCard from '@/components/SpaceCard';
import { useRouter } from 'next/navigation';

interface ProfileProps {
  params: {
    id: string;
  };
}

const Profile: React.FC<ProfileProps> = ({ params }) => {
  const [user, setUser] = useState<User | null>(null);
  const [projects, setProjects] = useState<Project[]>([]);
  const [files, setFiles] = useState<File[]>([]);
  const [spaces, setSpaces] = useState<Space[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await fetch(`/api/users/${params.id}`);
        const data = await response.json();
        setUser(data.user);
        setProjects(data.projects);
        setFiles(data.files);
        setSpaces(data.spaces);
        setIsLoading(false);
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };
    fetchUserData();
  }, [params.id]);

  const handleProjectClick = (project: Project) => {
    router.push(`/projects/${project.id}`);
  };

  const handleFileClick = (file: File) => {
    router.push(`/files/${file.id}`);
  };

  const handleSpaceClick = (space: Space) => {
    router.push(`/spaces/${space.id}`);
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Skeleton variant="rectangular" width="100%" height="200px" className="mb-4" />
        <Skeleton variant="text" width="50%" height="30px" className="mb-2" />
        <Skeleton variant="text" width="30%" height="20px" className="mb-4" />
        <Skeleton variant="rectangular" width="100%" height="400px" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="container mx-auto px-4 py-8">
        <p className="text-xl text-gray-500 dark:text-gray-400">User not found.</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-8"
      >
        <div className="flex items-center mb-4">
          <Avatar src={user.avatar || ''} alt={user.username} size="large" />
          <div className="ml-4">
            <h1 className="text-3xl font-bold text-gray-800 dark:text-white">{user.username}</h1>
            <p className="text-gray-600 dark:text-gray-400">{user.email}</p>
          </div>
        </div>
        <div className="mb-4">
          <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-2">Bio</h2>
          <p className="text-gray-600 dark:text-gray-400">{user.bio || 'No bio available.'}</p>
        </div>
        <div>
          <Button variant="primary">Follow</Button>
        </div>
      </motion.div>
      <Tabs
        tabs={[
          {
            id: 'projects',
            label: 'Projects',
            content: (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {projects.map((project) => (
                  <ProjectCard key={project.id} project={project} onClick={() => handleProjectClick(project)} />
                ))}
              </div>
            ),
          },
          {
            id: 'files',
            label: 'Files',
            content: (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {files.map((file) => (
                  <FileCard key={file.id} file={file} onClick={() => handleFileClick(file)} />
                ))}
              </div>
            ),
          },
          {
            id: 'spaces',
            label: 'Spaces',
            content: (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {spaces.map((space) => (
                  <SpaceCard key={space.id} space={space} onClick={() => handleSpaceClick(space)}/>
                ))}
              </div>
            ),
          },
        ]}
      />
    </div>
  );
};

export default Profile;