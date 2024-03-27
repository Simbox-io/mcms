// app/onboarding/profile/page.tsx

'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Input from '../../../components/next-gen/Input';
import Button from '../../../components/next-gen/Button';
import { useToken } from '../../../lib/useToken';
import Avatar from '../../../components/next-gen/Avatar';
import { useSession } from 'next-auth/react';
import { User } from '@/lib/prisma';
import { getImageUrl } from '@/utils/imageUtils';

const ProfileSetupPage: React.FC = () => {
  const [username, setUsername] = useState('');
  const [avatar, setAvatar] = useState<File | null>(null);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [bio, setBio] = useState('');
  const router = useRouter();
  const token = useToken();
  const session = useSession();
  const user = session.data?.user as User;

  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      setAvatar(file);
    }
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
  
    const formData = new FormData();
    formData.append('username', username);
    formData.append('firstName', firstName);
    formData.append('lastName', lastName);
    formData.append('bio', bio);
    if (avatar) {
      formData.append('avatar', avatar);
    }
  
    try {
      const response = await fetch('/api/onboarding/profile', {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });
  
      if (response.ok) {
        router.push('/onboarding/preferences');
      } else {
        console.error('Error updating profile:', response.statusText);
      }
    } catch (error) {
      console.error('Error updating profile:', error);
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4 text-gray-800 dark:text-white">Profile Setup</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <Input
            label="Username"
            type="text"
            value={username}
            onChange={setUsername}
            required
            className="w-full"
          />
        </div>
        <div className="mb-4">
          <Input
            label="First Name"
            type="text"
            value={firstName}
            onChange={setFirstName}
            className="w-full"
          />
        </div>
        <div className="mb-4">
          <Input
            label="Last Name"
            type="text"
            value={lastName}
            onChange={setLastName}
            className="w-full"
          />
        </div>
        <div className="mb-4">
          <Input
            label="Bio"
            type="text"
            value={bio}
            onChange={setBio}
            className="w-full"
          />
        </div>
        <label htmlFor="avatar" className="block mb-2 font-medium text-gray-700 dark:text-gray-300">
          Profile Image
        </label>
        <div className="flex items-center mb-6">
          <Avatar
            src={avatar ? URL.createObjectURL(avatar) : getImageUrl(user?.avatar)}
            alt="Profile"
            size="large"
          />
          <input
            type="file"
            id="avatar"
            accept="image/*"
            onChange={handleAvatarChange}
            className="ml-4"
          />
        </div>
        <Button variant="primary">
          Next
        </Button>
      </form>
    </div>
  );
};

export default ProfileSetupPage;