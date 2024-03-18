'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { User, UserSettings, NotificationPreferences, PrivacySettings, ThemePreference, Visibility } from '@/lib/prisma';

export default function UserSettingsPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [settings, setSettings] = useState<UserSettings | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (status === 'authenticated') {
      fetchUserSettings();
    } else {
      setIsLoading(false);
    }
  }, [status]);

  const fetchUserSettings = async () => {
    try {
      const res = await fetch(`/api/user`);
      if (res.ok) {
        const userData = await res.json();
        setUser(userData);
        setSettings(userData.settings);
      } else {
        console.error('Failed to fetch user settings');
      }
    } catch (error) {
      console.error('Error fetching user settings:', error);
    }
    setIsLoading(false);
  };

  const updateSettings = async () => {
    setIsSaving(true);
    try {
      const res = await fetch(`/api/users/${user?.id}/settings`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(settings),
      });
      if (res.ok) {
        const updatedSettings = await res.json();
        setSettings(updatedSettings);
      } else {
        console.error('Failed to update user settings');
      }
    } catch (error) {
      console.error('Error updating user settings:', error);
    }
    setIsSaving(false);
  };

  const handleNotificationChange = (field: keyof NotificationPreferences) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setSettings((prevSettings) => {
      if (!prevSettings) {
        return null;
      }
      return {
        ...prevSettings,
        notificationPreferences: {
          ...prevSettings.notificationPreferences,
          [field]: e.target.checked,
        } as NotificationPreferences,
      };
    });
  };
  
  const handlePrivacyChange = (field: keyof PrivacySettings) => (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSettings((prevSettings) => {
      if (!prevSettings) {
        return null;
      }
      return {
        ...prevSettings,
        privacySettings: {
          ...prevSettings.privacySettings,
          [field]: e.target.value as Visibility,
        } as PrivacySettings,
      };
    });
  };

  const handleThemeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSettings((prevSettings) => ({
      ...prevSettings!,
      themePreference: e.target.value as ThemePreference,
    }));
  };

  if (status === 'unauthenticated') {
    router.push('/login');
    return null;
  }

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">User Settings</h1>

      <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6 mb-8">
        <h2 className="text-xl font-semibold mb-4">Notification Preferences</h2>
        <div className="space-y-4">
          <div className="flex items-center">
            <input
              type="checkbox"
              id="emailNotifications"
              checked={settings?.notificationPreferences?.email}
              onChange={handleNotificationChange('email')}
              className="mr-2"
            />
            <label htmlFor="emailNotifications" className="text-gray-700 dark:text-gray-300">
              Email Notifications
            </label>
          </div>
          <div className="flex items-center">
            <input
              type="checkbox"
              id="pushNotifications"
              checked={settings?.notificationPreferences?.push}
              onChange={handleNotificationChange('push')}
              className="mr-2"
            />
            <label htmlFor="pushNotifications" className="text-gray-700 dark:text-gray-300">
              Push Notifications
            </label>
          </div>
          <div className="flex items-center">
            <input
              type="checkbox"
              id="inAppNotifications"
              checked={settings?.notificationPreferences?.inApp}
              onChange={handleNotificationChange('inApp')}
              className="mr-2"
            />
            <label htmlFor="inAppNotifications" className="text-gray-700 dark:text-gray-300">
              In-App Notifications
            </label>
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6 mb-8">
        <h2 className="text-xl font-semibold mb-4">Privacy Settings</h2>
        <div className="space-y-4">
          <div>
            <label htmlFor="profileVisibility" className="block text-gray-700 dark:text-gray-300 mb-1">
              Profile Visibility
            </label>
            <select
              id="profileVisibility"
              value={settings?.privacySettings?.profileVisibility}
              onChange={handlePrivacyChange('profileVisibility')}
              className="w-full border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 focus:outline-none focus:ring-indigo-500"
            >
              <option value="PUBLIC">Public</option>
              <option value="PRIVATE">Private</option>
            </select>
          </div>
          <div>
            <label htmlFor="activityVisibility" className="block text-gray-700 dark:text-gray-300 mb-1">
              Activity Visibility
            </label>
            <select
              id="activityVisibility"
              value={settings?.privacySettings?.activityVisibility}
              onChange={handlePrivacyChange('activityVisibility')}
              className="w-full border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 focus:outline-none focus:ring-indigo-500"
            >
              <option value="PUBLIC">Public</option>
              <option value="PRIVATE">Private</option>
            </select>
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6 mb-8">
        <h2 className="text-xl font-semibold mb-4">Theme Preference</h2>
        <div>
          <select
            id="themePreference"
            value={settings?.themePreference?.toString()}
            onChange={handleThemeChange}
            className="w-full border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 focus:outline-none focus:ring-indigo-500"
          >
            <option value="LIGHT">Light</option>
            <option value="DARK">Dark</option>
          </select>
        </div>
      </div>

      <button
        onClick={updateSettings}
        disabled={isSaving}
        className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 px-4 rounded"
      >
        {isSaving ? 'Saving...' : 'Save Changes'}
      </button>
    </div>
  );
}