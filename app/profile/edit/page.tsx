// app/profile/edit/page.tsx

'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import Input from '../../../components/Input';
import Textarea from '../../../components/Textarea';
import Button from '../../../components/Button';
import Card from '../../../components/Card';
import Spinner from '../../../components/Spinner';
import { getImageUrl } from '../../../utils/imageUtils';
import { useToken } from '../../../lib/useToken';

interface User {
  id: number;
  username: string;
  email: string;
  avatar: string;
  bio: string;
}

const EditProfilePage: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [bio, setBio] = useState('');
  const [avatar, setAvatar] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const router = useRouter();
  const { data: session, update: updateSession } = useSession();
  const token = useToken();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        if (!session) {
          router.push('/login');
          return;
        }

        const response = await fetch('/api/user', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.ok) {
          const userData: User = await response.json();
          setUser(userData);
          setUsername(userData.username);
          setEmail(userData.email);
          setBio(userData.bio);
        } else {
          router.push('/login');
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUser();
  }, [session, router, token]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);

    try {
      const formData = new FormData();
      formData.append('username', username);
      formData.append('email', email);
      formData.append('bio', bio);
      if (avatar) {
        formData.append('avatar', avatar);
      }

      const response = await fetch(`/api/user`, {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      if (response.ok) {
        const updatedUser: User = await response.json();
        updateSession({
          user: {
            ...session?.user,
            username: updatedUser.username,
            email: updatedUser.email,
            avatar: updatedUser.avatar,
          },
        });
        router.push('/profile');
      } else {
        console.error('Error updating profile:', response.statusText);
      }
    } catch (error) {
      console.error('Error updating profile:', error);
    }

    setIsSaving(false);
  };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setAvatar(e.target.files[0]);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Spinner size="large" />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Card>
        <h1 className="text-3xl font-semibold mb-8 text-gray-800 dark:text-white">Edit Profile</h1>
        <form onSubmit={handleSubmit}>
          <div className="mb-6">
            <Input
              label="Username"
              name="username"
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              className="w-full"
            />
          </div>
          <div className="mb-6">
            <Input
              label="Email"
              name="email"
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full"
            />
          </div>
          <div className="mb-6">
            <label htmlFor="bio" className="block mb-2 font-medium text-gray-700 dark:text-gray-300">
              Bio
            </label>
            <Textarea
              id="bio"
              value={bio}
              onChange={setBio}
              rows={4}
            />
          </div>
          <div className="mb-6">
            <label htmlFor="avatar" className="block mb-2 font-medium text-gray-700 dark:text-gray-300">
              Avatar
            </label>
            <div className="flex items-center">
              <img
                src={avatar ? URL.createObjectURL(avatar) : getImageUrl(user?.avatar)}
                alt="Avatar"
                className="w-16 h-16 rounded-full mr-4"
              />
              <input
                type="file"
                id="avatar"
                accept="image/*"
                onChange={handleAvatarChange}
                className="hidden"
              />
              <label
                htmlFor="avatar"
                className="px-4 py-2 text-sm font-medium text-white bg-blue-500 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 cursor-pointer"
              >
                Change Avatar
              </label>
            </div>
          </div>
          <div className="flex justify-end">
            <Button type="submit" variant="primary" disabled={isSaving}>
              {isSaving ? 'Saving...' : 'Save'}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
};

export default EditProfilePage;