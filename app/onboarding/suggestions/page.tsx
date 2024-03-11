// app/onboarding/suggestions/page.tsx

'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Card from '../../../components/Card';
import Button from '../../../components/Button';
import { useToken } from '../../../lib/useToken';

interface Wiki {
  id: number;
  title: string;
}

interface User {
  id: number;
  username: string;
  avatar: string;
}

const SuggestionsPage: React.FC = () => {
  const [suggestedWikis, setSuggestedWikis] = useState<Wiki[]>([]);
  const [suggestedUsers, setSuggestedUsers] = useState<User[]>([]);
  const router = useRouter();
  const token = useToken();

  useEffect(() => {
    const fetchSuggestions = async () => {
      try {
        const response = await fetch('/api/onboarding/suggestions', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.ok) {
          const data = await response.json();
          setSuggestedWikis(data.wikis);
          setSuggestedUsers(data.users);
        } else {
          console.error('Error fetching suggestions:', response.statusText);
        }
      } catch (error) {
        console.error('Error fetching suggestions:', error);
      }
    };

    if (token) {
      fetchSuggestions();
    }
  }, [token]);

  const handleFollow = async (type: 'wiki' | 'user', id: number) => {
    try {
      const response = await fetch(`/api/onboarding/follow`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ type, id }),
      });

      if (response.ok) {
        // Update the suggested wikis or users state to reflect the followed item
        if (type === 'wiki') {
          setSuggestedWikis((prevWikis) => prevWikis.filter((wiki) => wiki.id !== id));
        } else if (type === 'user') {
          setSuggestedUsers((prevUsers) => prevUsers.filter((user) => user.id !== id));
        }
      } else {
        console.error('Error following suggestion:', response.statusText);
      }
    } catch (error) {
      console.error('Error following suggestion:', error);
    }
  };

  const handleComplete = () => {
    router.push('/dashboard');
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4 text-gray-800 dark:text-white">Suggested Wikis</h2>
      <div className="grid grid-cols-1 gap-4 mb-8">
        {suggestedWikis.map((wiki) => (
          <Card key={wiki.id}>
            <h3 className="text-xl font-semibold mb-2">{wiki.title}</h3>
            <Button variant="primary" onClick={() => handleFollow('wiki', wiki.id)}>
              Follow
            </Button>
          </Card>
        ))}
      </div>

      <h2 className="text-2xl font-bold mb-4 text-gray-800 dark:text-white">Suggested Users</h2>
      <div className="grid grid-cols-1 gap-4 mb-8">
        {suggestedUsers.map((user) => (
          <Card key={user.id}>
            <div className="flex items-center">
              <img src={user.avatar} alt={user.username} className="w-10 h-10 rounded-full mr-4" />
              <h3 className="text-xl font-semibold">{user.username}</h3>
            </div>
            <Button variant="primary" onClick={() => handleFollow('user', user.id)}>
              Follow
            </Button>
          </Card>
        ))}
      </div>

      <Button variant="primary" onClick={handleComplete}>
        Complete Onboarding
      </Button>
    </div>
  );
};

export default SuggestionsPage;