// app/spaces/page.tsx
'use client';
import React from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import AllSpacesPage from './all/page';

const SpacesPage: React.FC = () => {
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
      <h1 className="text-3xl font-semibold text-gray-800 dark:text-white mb-8">Spaces</h1>
      <AllSpacesPage />
    </div>
  );
};

export default SpacesPage;
