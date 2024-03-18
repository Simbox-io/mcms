'use client';
import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Card from '@/components/Card';
import Button from '@/components/Button';
import Tabs from '@/components/Tabs';
import FileGrid from '@/components/FileGrid';
import Avatar from '@/components/Avatar';
import { formatDate } from '@/utils/dateUtils';
import { motion } from 'framer-motion';
import { FiEdit, FiTrash, FiUpload, FiUsers, FiSettings, FiActivity, FiMessageCircle, FiCheckCircle, FiMenu, FiFile, FiUserPlus, FiLock } from 'react-icons/fi';
import FileUpload from '@/components/FileUpload';
import MembersList from '@/components/MembersList';
import Modal from '@/components/Modal';
import Select from '@/components/Select';
import TagInput from '@/components/TagInput';
import ProgressRing from '@/components/ProgressRing';
import Tooltip from '@/components/Tooltip';
import ActivityTimeline from '@/components/ActivityTimeline';
import ReportDashboard from '@/components/ReportDashboard';
import ThemeToggle from '@/components/ThemeToggle';
import Toast from '@/components/Toast';
import Popover from '@/components/Popover';
import { File as CustomFile, Project } from '@/lib/prisma';
import EmptyState from '@/components/EmptyState';
import Breadcrumbs from '@/components/Breadcrumbs';

const ProjectDetailPage: React.FC = () => {
  const { id } = useParams();
  const [project, setProject] = useState<Project | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [newMembers, setNewMembers] = useState<string[]>([]);
  const [permissions, setPermissions] = useState<string[]>([]);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastVariant, setToastVariant] = useState<'success' | 'error' | 'warning' | 'info'>('info');
  const [activeTab, setActiveTab] = useState('files');

  useEffect(() => {
    const fetchProject = async () => {
      try {
        const response = await fetch(`/api/projects/${id}`);
        if (response.ok) {
          const data = await response.json();
          setProject(data);
        } else {
          console.error('Error fetching project:', response.statusText);
        }
      } catch (error) {
        console.error('Error fetching project:', error);
      }
    };
    fetchProject();
  }, [id]);

  if (!project) {
    return <div>Loading...</div>;
  }

  const handleEditProject = () => {
    // Logic for editing the project
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
      const response = await fetch(`/api/projects/${project.id}/members`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ members: newMembers }),
      });
      if (response.ok) {
        // Refresh the project data after successfully adding members
        const updatedProject = await response.json();
        setProject(updatedProject);
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

  const handleRemoveMember = async (memberId: number) => {
    try {
      const response = await fetch(`/api/projects/${project.id}/members/${memberId}`, {
        method: 'DELETE',
      });
      if (response.ok) {
        // Refresh the project data after successfully removing a member
        const updatedProject = await response.json();
        setProject(updatedProject);
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

  const renderTabContent = () => {
    switch (activeTab) {
      case 'files':
        return (
          <div>
            <div className="mb-4">
              {project.files.length === 0 ? (
                <EmptyState
                  title="No files uploaded"
                  description="Start uploading files to share with your team."
                />
              ) : (
                <FileGrid files={project.files} />
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
        );
      case 'members':
        return (
          <div>
            <div className="mb-6 h-10 w-full flex justify-between align-center">
              <TagInput
                tags={newMembers}
                onChange={setNewMembers}
                placeholder="Enter member usernames..."
                className='fill md:w-1/2 h-auto flex-grow mr-4'
              />
              <Button onClick={handleAddMembers} className="flex flex-shrink">
                <div className="flex items-center">
                  <FiUserPlus className="mr-2" />
                  Add
                </div>
              </Button>
            </div>
            {/*<MembersList
              members={project.collaborators}
              onRemoveMember={handleRemoveMember}
        />*/}
          </div>
        );
      case 'activity':
        return (
          <div>
            {/*Activity timeline component*/}
          </div>
        );
      case 'reports':
        return (
          <div>
            {/*Report dashboard component*/}
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="container rounded-lg mx-auto my-auto mt-2 px-4 py-8 dark:bg-gray-900 dark:text-white"
    >
      <Breadcrumbs items={[{ label: 'Projects', href: '/projects' }, { label: project.name, href: '' }]} className='mb-4'/>
      <Card className="mb-4">
        <div className="flex flex-col md:flex-row justify-between items-center mb-4">
          <div className="flex flex-col md:flex-row items-center mb-4 md:mb-0">
            <Avatar src={project.owner.avatar || ''} alt={project.owner.username} size="large" className="mb-2 md:mb-0 md:mr-4" />
            <div>
              <h1 className="text-2xl md:text-3xl font-semibold">{project.name}</h1>
              <p className="text-gray-600 dark:text-gray-400">Created by {project.owner.username}</p>
              <p className="text-gray-500 dark:text-gray-400 text-sm">
                {formatDate(project.createdAt.toString())}
              </p>
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
        <p className="text-gray-800 dark:text-gray-200 mb-8" dangerouslySetInnerHTML={{ __html: project.description.toString()}} />
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
        <Tabs
          tabs={[
            {
              id: 'files',
              label: 'Files',
              icon: <FiFile className="mr-2" />,
              content: renderTabContent(),
            },
            {
              id: 'members',
              label: 'Members',
              icon: <FiUsers className="mr-2" />,
              content: renderTabContent(),
            },
            {
              id: 'activity',
              label: 'Activity',
              icon: <FiActivity className="mr-2" />,
              content: renderTabContent(),
            },
            {
              id: 'reports',
              label: 'Reports',
              icon: <FiCheckCircle className="mr-2" />,
              content: renderTabContent(),
            },
          ]}
        />
      </div>
      <div className="block md:hidden">
        {renderTabContent()}
      </div>
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Configure Permissions" className="w-full md:w-1/2">
        <div className="mb-4">
          <Select
            options={['Read', 'Write', 'Admin']}
            value={permissions}
            onChange={() => setPermissions}
            isMulti
          />
        </div>
        <Button onClick={handleUpdatePermissions}>Update Permissions</Button>
      </Modal>
      <Toast message={toastMessage} variant={toastVariant} onClose={() => setToastMessage('')} className="fixed bottom-4 right-4 md:bottom-8 md:right-8" />
    </motion.div>
  );
};

export default ProjectDetailPage;