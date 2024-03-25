// app/projects/page.tsx
'use client';
import React from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import AllProjectsPage from './all-projects/page';
import TrendingProjectsPage from './trending/page';
import RecentProjectsPage from './recent/page';
     
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
      {/* Render the child components */}
      {/* You can use Next.js' nested routing here */}
      {/* For example: */}
      <AllProjectsPage />
      <TrendingProjectsPage />
      <RecentProjectsPage />
      {/* <CreateProjectPage /> */}
      {/* <ProjectDetailsPage /> */}
    </div>
  );
};

export default ProjectsPage;
