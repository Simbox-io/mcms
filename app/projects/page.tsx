// app/projects/page.tsx
'use client';
import React from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import AllProjectsPage from './all-projects/page';
import CreateProjectPage from './create/page';
import ProjectDetailsPage from './[id]/page';

const ProjectsPage: React.FC = () => {
  const router = useRouter();
  const { data: session, status } = useSession();

  if (status === 'loading') {
    return <div>Loading...</div>;
  }

  if (status === 'unauthenticated') {
    router.push('/login');
    return null;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-semibold text-gray-800 dark:text-white mb-8">Projects</h1>
      {/* Render the child components */}
      {/* You can use Next.js' nested routing here */}
      {/* For example: */}
      <AllProjectsPage />
      {/* <CreateProjectPage /> */}
      {/* <ProjectDetailsPage /> */}
    </div>
  );
};

export default ProjectsPage;
