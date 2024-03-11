// app/onboarding/preferences/page.tsx

'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Checkbox from '../../../components/Checkbox';
import Button from '../../../components/Button';
import { useToken } from '../../../lib/useToken';

const PreferencesPage: React.FC = () => {
  const [receiveNotifications, setReceiveNotifications] = useState(true);
  const [receiveUpdates, setReceiveUpdates] = useState(true);
  const router = useRouter();
  const token = useToken();

  ('token', token);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await fetch('/api/onboarding/preferences', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ receiveNotifications, receiveUpdates }),
      });

      if (response.ok) {
        router.push('/dashboard');
      } else {
        console.error('Error updating preferences:', response.statusText);
      }
    } catch (error) {
      console.error('Error updating preferences:', error);
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4 text-gray-800 dark:text-white">Preferences</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <Checkbox
            label="Receive Notifications"
            checked={receiveNotifications}
            onChange={setReceiveNotifications}
          />
        </div>
        <div className="mb-4">
          <Checkbox
            label="Receive Updates"
            checked={receiveUpdates}
            onChange={setReceiveUpdates}
          />
        </div>
        <Button type="submit" variant="primary">
          Complete Onboarding
        </Button>
      </form>
    </div>
  );
};

export default PreferencesPage;