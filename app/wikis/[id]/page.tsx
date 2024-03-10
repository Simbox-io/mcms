'use client';

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Card from '@/components/Card';
import Button from '@/components/Button';

interface Wiki {
  id: number;
  title: string;
  content: string;
  createdAt: string;
}

const WikiDetailPage: React.FC = () => {
  const { id } = useParams();
  const [wiki, setWiki] = useState<Wiki | null>(null);

  useEffect(() => {
    const fetchWiki = async () => {
      try {
        const response = await fetch(`/api/wikis/${id}`);

        if (response.ok) {
          const data = await response.json();
          setWiki(data);
        } else {
          console.error('Error fetching wiki:', response.statusText);
        }
      } catch (error) {
        console.error('Error fetching wiki:', error);
      }
    };

    fetchWiki();
  }, [id]);

  if (!wiki) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Card>
        <h1 className="text-3xl font-semibold mb-4 text-gray-800 dark:text-white">
          {wiki.title}
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mb-8">{wiki.content}</p>
        <div className="mt-8">
          <Button>Edit</Button>
          <Button variant="danger" className="ml-4">
            Delete
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default WikiDetailPage;