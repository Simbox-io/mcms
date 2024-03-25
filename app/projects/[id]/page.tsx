'use client';
import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Card from '@/components/next-gen/Card';
import Button from '@/components/next-gen/Button';
import Tabs from '@/components/next-gen/Tabs';
import FileGrid from '@/components/FileGrid';
import Avatar from '@/components/next-gen/Avatar';
import { formatDate } from '@/utils/dateUtils';
import { motion } from 'framer-motion';
import { FiEdit, FiTrash, FiUsers, FiActivity, FiCheckCircle, FiMenu, FiFile, FiUserPlus, FiLock } from 'react-icons/fi';
import FileUpload from '@/components/FileUpload';
import Modal from '@/components/next-gen/Modal';
import Select from '@/components/next-gen/Select';
import UserPicker from '@/components/next-gen/UserPicker';
import Toast from '@/components/Toast';
import Popover from '@/components/Popover';
import { Project, User } from '@/lib/prisma';
import EmptyState from '@/components/EmptyState';
import Breadcrumbs from '@/components/Breadcrumbs';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import instance from '@/utils/api';
import MembersList from '@/components/MembersList';
import Spinner from '@/components/base/Spinner';

const ProjectDetailPage: React.FC = () => {
  const { id } = useParams();
  const [project, setProject] = useState<Project | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [newMembers, setNewMembers] = useState<User[]>([]);
  const [permissions, setPermissions] = useState<string[]>([]);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastVariant, setToastVariant] = useState<'success' | 'error' | 'warning' | 'info'>('info');
  const [activeTab, setActiveTab] = useState('files');
  const [viewed, setIsViewed] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  const fetchProject = async () => {
    try {
      const response = await instance.get(`/api/projects/${id}`);
      setProject(response.data);
      if(viewed === false) {
        const viewedResponse = await instance.put(`/api/projects/${id}/view`);
        setIsViewed(true);
      }
      setIsLoading(false);
    } catch (error) {
      console.error('Error fetching project:', error);
    }
  };

  useEffect(() => {
    fetchProject();
  }, [id]);

  if (!project) {
    return <div>Loading...</div>;
  }

  const handleEditProject = () => {
    router.push(`/projects/${project.id}/edit`);
  };

  const handleDeleteProject = () => {
    // Logic for deleting the project
  };

  const handleFileUpload = async () => {
    try {
      const formData = new FormData();
      selectedFiles.forEach((file) => formData.append('file', file));

      const response = await fetch(`/api/files`, {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        const newFiles = await response.json();
        setProject((prevProject) => ({
          ...prevProject!,
          files: [...prevProject!.files, ...newFiles],
        }));
        setSelectedFiles([]);
        setToastMessage('Files uploaded successfully');
      } else {
        console.error('Error uploading files:', response.statusText);
        setToastMessage('Error uploading files');
      }
    } catch (error) {
      console.error('Error uploading files:', error);
      setToastMessage('Error uploading files');
    }
  };
  const handleAddMembers = async () => {
    try {
      const response = await fetch(`/api/projects/${project.id}/collaborators`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ members: newMembers }),
      });
      console.log (await response.json());
      if (response.ok) {
        // Refresh the project data after successfully adding members
        fetchProject();
        setNewMembers([]);
        setToastMessage('Members added successfully');
      } else {
        console.error('Error adding members:', response.statusText);
        setToastMessage('Error adding members');
      }
    } catch (error) {
      console.error('Error adding members:', error);
      setToastMessage('Error adding members');
    }
  };

  const handleRemoveMember = async (memberId: string) => {
    try {
      const response = await fetch(`/api/projects/${project.id}/collaborators`, {
        method: 'DELETE',
        body: JSON.stringify({ collaboratorId: memberId }),
      });
      if (response.ok) {
        // Refresh the project data after successfully removing a member
        fetchProject();
        setToastMessage('Member removed successfully');
      } else {
        console.error('Error removing member:', response.statusText);
        setToastMessage('Error removing member');
      }
    } catch (error) {
      console.error('Error removing member:', error);
      setToastMessage('Error removing member');
    }
  };

  const handleUpdatePermissions = async () => {
    try {
      const response = await fetch(`/api/projects/${project.id}/permissions`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ permissions }),
      });
      if (response.ok) {
        // Refresh the project data after successfully updating permissions
        const updatedProject = await response.json();
        setProject(updatedProject);
        setIsModalOpen(false);
        setToastMessage('Permissions updated successfully');
      } else {
        console.error('Error updating permissions:', response.statusText);
        setToastMessage('Error updating permissions');
      }
    } catch (error) {
      console.error('Error updating permissions:', error);
      setToastMessage('Error updating permissions');
    }
  };

  const handleSetMembers = (users: User[]) => {
    setNewMembers(users);
  };

  if(isLoading) {
    return <Spinner/>
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="container rounded-lg mx-auto my-auto mt-2 px-4 py-8 dark:bg-gray-900 dark:text-white"
    >
      <Breadcrumbs items={[{ label: 'Projects', href: '/projects/all-projects' }, { label: project?.name, href: '' }]} className='mb-4' />
      <Card className="mb-4">
        <div className="flex flex-col md:flex-row justify-between items-center mb-4">
          <div className="flex flex-col md:flex-row items-center mb-4 md:mb-0">
            <Avatar src={project?.owner?.avatar || ''} alt={''} size="large" className="mb-2 md:mb-0 md:mr-4" />
            <div>
              <h1 className="text-2xl md:text-3xl font-semibold">{project?.name}</h1>
              <p className="text-gray-600 dark:text-gray-400">Created by <Link href={`/profile/${project?.owner?.username}`}>{project?.owner?.username}</Link></p>
              <p className="text-gray-500 dark:text-gray-400 text-sm">
                {formatDate(project?.createdAt?.toString())}
              </p>
            </div>
            <div>
              <p className="text-gray-500 dark:text-gray-400 text-sm">Views: {project?.views}</p>
            </div>
          </div>
          <div className="flex items-center">
            <Button variant="secondary" onClick={handleEditProject} className="mr-2">
              <FiEdit className="" />
            </Button>
            <Button variant="danger" onClick={handleDeleteProject}>
              <FiTrash className="" />
            </Button>
          </div>
        </div>
        <p className="text-gray-800 dark:text-gray-200 mb-8" dangerouslySetInnerHTML={{ __html: project?.description?.toString() }} />
      </Card>
      <div className="block md:hidden mb-4">
        <Popover
          trigger={
            <Button>
              <FiMenu className="mr-2" />
              Menu
            </Button>
          }
          content={
            <div className="p-4">
              <ul className="space-y-2">
                <li>
                  <Button onClick={() => setActiveTab('files')}>
                    <FiFile className="mr-2" />
                    Files
                  </Button>
                </li>
                <li>
                  <Button onClick={() => setActiveTab('members')}>
                    <FiUsers className="mr-2" />
                    Members
                  </Button>
                </li>
                <li>
                  <Button onClick={() => setActiveTab('activity')}>
                    <FiActivity className="mr-2" />
                    Activity
                  </Button>
                </li>
                <li>
                  <Button onClick={() => setActiveTab('reports')}>
                    <FiCheckCircle className="mr-2" />
                    Reports
                  </Button>
                </li>
                <li>
                  <Button onClick={() => setIsModalOpen(true)}>
                    <FiLock className="mr-2" />
                    Configure Permissions
                  </Button>
                </li>
              </ul>
            </div>
          }
        />
      </div>
      <div className="hidden md:block">
        <div className="hidden md:block">
          <Tabs
            tabs={[
              {
                label: 'Files',
                icon: <FiFile className="mr-2" />,
                content: (
                  <div>
                    <div className="mb-4">
                      {project?.files?.length === 0 ? (
                        <EmptyState
                          title="No files uploaded"
                          description="Start uploading files to share with your team."
                        />
                      ) : (
                        <FileGrid files={project?.files} />
                      )}
                    </div>
                    <div>
                      <FileUpload
                        onFileUpload={handleFileUpload}
                        onFileSelect={() => setSelectedFiles}
                        accept=".pdf,.doc,.docx,.xls,.xlsx,.jpg,.jpeg,.png"
                        maxFiles={10}
                        className="mb-2"
                      />
                    </div>
                  </div>
                ),
              },
              {
                label: 'Members',
                icon: <FiUsers className="mr-2" />,
                content: (
                  <div>
                    <div className="mb-6 h-10 w-full flex justify-between align-center">
                      <UserPicker
                        selectedUsers={newMembers}
                        onChange={handleSetMembers}
                        placeholder="Enter member usernames..."
                        className="fill md:w-1/2 h-auto flex-grow mr-4"
                      />
                      <Button onClick={handleAddMembers} className="flex flex-shrink">
                        <div className="flex items-center">
                          <FiUserPlus className="mr-2" />
                          Add
                        </div>
                      </Button>
                    </div>
                    {project?.collaborators?.length > 0 && (<MembersList
                      members={project?.collaborators}
                      onRemoveMember={(member) => handleRemoveMember(member)}
                    />)}
                  </div>
                ),
              },
              {
                label: 'Activity',
                icon: <FiActivity className="mr-2" />,
                content: (
                  <div>
                    {/* Activity timeline component */}
                  </div>
                ),
              },
              {
                label: 'Reports',
                icon: <FiCheckCircle className="mr-2" />,
                content: (
                  <div>
                    {/* Report dashboard component */}
                  </div>
                ),
              },
            ]}
          />
        </div>
      </div>
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Configure Permissions" className="w-full md:w-1/2">
        <div className="mb-4">
          <Select
            options={[
              { value: 'view', label: 'View' },
              { value: 'edit', label: 'Edit' },
              { value: 'delete', label: 'Delete' },
            ]}
            value={permissions.toString()}
            onChange={(selectedPermissions) =>
              setPermissions(Array.isArray(selectedPermissions) ? selectedPermissions.map((p) => p.value) : [])
            }
            placeholder="Select permissions..."
            className="w-full"
          />
        </div>
        <Button onClick={handleUpdatePermissions}>Update Permissions</Button>
      </Modal>
      <Toast message={toastMessage} variant={toastVariant} onClose={() => setToastMessage('')} className="fixed bottom-4 right-4 md:bottom-8 md:right-8" />
    </motion.div>
  );
};

export default ProjectDetailPage;