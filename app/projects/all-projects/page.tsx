// app/projects/page.tsx
'use client';
import React, { useEffect, useState, useRef, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import Card from '../../../components/Card';
import Button from '../../../components/Button';
import Spinner from '../../../components/Spinner';
import { formatDate } from '../../../utils/dateUtils';
import { motion, AnimatePresence } from 'framer-motion';
import { FiGrid, FiList, FiFilter } from 'react-icons/fi';
import { IoMdAdd } from 'react-icons/io';
import Input from '../../../components/Input';
import CategoryFilter from '@/components/CategoryFilter';
import Accordion from '@/components/Accordion';

interface Project {
  id: number;
  name: string;
  description: string;
  createdAt: string;
  updatedAt: string;
  owner: {
    id: number;
    username: string;
  };
  members: {
    id: number;
    username: string;
  }[];
}

const ProjectListPage: React.FC = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [filteredProjects, setFilteredProjects] = useState<Project[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [view, setView] = useState<'grid' | 'list'>('grid');
  const [filterQuery, setFilterQuery] = useState('');
  const [hasMore, setHasMore] = useState(true);
  const router = useRouter();
  const { data: session, status } = useSession();
  const observerRef = useRef<IntersectionObserver | null>(null);

  const fetchProjects = useCallback(async () => {
    try {
      const response = await fetch(`/api/projects?page=${currentPage}`);
      if (response.ok) {
        const data = await response.json();
        if (currentPage === 1) {
          setProjects(data.projects);
          setFilteredProjects(data.projects);
        }
        else {
          setProjects((prevProjects) => [...prevProjects, ...data.projects]);
          setFilteredProjects((prevProjects) => [...prevProjects, ...data.projects]);
          setHasMore(data.projects.length > 0);
        }
      } else {
        console.error('Error fetching projects:', response.statusText);
      }
    } catch (error) {
      console.error('Error fetching projects:', error);
    } finally {
      setIsLoading(false);
    }
  }, [currentPage]);

  useEffect(() => {
    fetchProjects();
  }, [fetchProjects]);

  useEffect(() => {
    const filtered = projects.filter(
      (project) =>
        project.name.toLowerCase().includes(filterQuery.toLowerCase()) ||
        project.description.toLowerCase().includes(filterQuery.toLowerCase())
    );
    setFilteredProjects(filtered);
  }, [filterQuery, projects]);

  useEffect(() => {
    if (isLoading) return;

    if (observerRef.current) {
      observerRef.current.disconnect();
    }

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore) {
          setCurrentPage((prevPage) => prevPage + 1);
        }
      },
      { threshold: 1 }
    );

    const sentinel = document.querySelector('#sentinel');
    if (filteredProjects.length > 0 && sentinel) {
      observer.observe(sentinel);
    }

    observerRef.current = observer;

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [isLoading, hasMore, filteredProjects]);

  const handleCreateProject = () => {
    router.push('/projects/create');
  };

  const handleSelectProject = (project: Project) => {
    router.push(`/projects/${project.id}`);
  };

  const handleChangeCategory = (category: string) => {
    console.log(category);
  };

  const toggleView = () => {
    setView(view === 'grid' ? 'list' : 'grid');
  };

  if (status === 'loading') {
    return <div>Loading...</div>;
  }

  if (status === 'unauthenticated') {
    router.push('/login');
    return null;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="container mx-auto px-4 py-8"
    >
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-semibold text-gray-800 dark:text-white">Projects</h1>
        <div className="flex items-center space-x-4">
          <Button variant="primary" onClick={handleCreateProject}>
            <IoMdAdd />
          </Button>
          <Button variant="secondary" onClick={toggleView}>
            {view === 'grid' ? <FiList /> : <FiGrid />}
          </Button>
        </div>
      </div>
      <div className="mb-8">
        <div className="flex justify-between">
          <div className="flex-grow mr-4 ">
            <Input
              name=''
              id=''
              type="text"
              placeholder="Filter projects..."
              value={filterQuery}
              onChange={(e) => setFilterQuery(e.target.value)}
              className=""
            />
          </div>
          <CategoryFilter onSelect={handleChangeCategory} options={[{ label: 'test' }, { label: 'test2' }]} className=''/>
        </div>
      </div>
      <AnimatePresence mode="wait">
        {view === 'grid' ? (
          <motion.div
            key="grid"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            {filteredProjects.map((project) => (
              <motion.div
                key={project.id}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => handleSelectProject(project)}
              >
                <Card className='h-72'>
                  <div className="p-4">
                    <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-2">
                      {project.name}
                    </h2>
                    <p className="text-gray-600 dark:text-gray-400 mb-4" dangerouslySetInnerHTML={{ __html: project.description }} />
                    <div className="flex justify-between items-center">
                      
                    </div>
                    <div className="mt-4">
                      {project.members && (<><p className="text-gray-600 dark:text-gray-400 mb-2">Members:</p>
                      <ul className="list-disc list-inside">
                        {project.members?.map((member) => (
                          <li key={member.id} className="text-gray-600 dark:text-gray-400">
                            {member.username}
                          </li>
                        ))}
                      </ul></>)}
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        ) : (
          <motion.div
            key="list"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="space-y-4"
          >
            {filteredProjects.map((project) => (
              <motion.div
                key={project.id}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => handleSelectProject(project)}
              >
                <Card>
                  <div className="flex items-center p-4">
                    <div className="flex-1">
                      <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-2">
                        {project.name}
                      </h2>
                      <p className="text-gray-600 dark:text-gray-400 mb-4" dangerouslySetInnerHTML={{ __html: project.description }} />
                      <div className="flex items-center space-x-4">
                        <p className="text-gray-600 dark:text-gray-400">
                          Created by {project.owner.username}
                        </p>
                        <p className="text-gray-600 dark:text-gray-400">
                          {formatDate(project.createdAt)}
                        </p>
                      </div>
                    </div>
                    <div className="ml-4">
                      <p className="text-gray-600 dark:text-gray-400 mb-2">Members:</p>
                      <ul className="list-disc list-inside">
                        {project.members.map((member) => (
                          <li key={member.id} className="text-gray-600 dark:text-gray-400">
                            {member.username}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
      <div id="sentinel" className="h-4"></div>
      {isLoading && (
        <div className="flex justify-center items-center mt-8">
          <Spinner size="large" />
        </div>
      )}
      {!isLoading && filteredProjects.length === 0 && (
        <p className="text-center text-gray-600 dark:text-gray-400 mt-8">No projects found.</p>
      )}
      {!hasMore && filteredProjects.length > 0 && (
        <p className="text-center text-gray-600 dark:text-gray-400 mt-8">No more projects to load.</p>
      )}
    </motion.div>
  );
};

export default ProjectListPage;