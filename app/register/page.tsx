// app/register/page.tsx

'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Input from '@/components/next-gen/Input';
import Button from '@/components/next-gen/Button';

const RegistrationPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password, username }),
      });

      if (response.ok) {
        router.push('/login');
      } else {
        const errorData = await response.json();
        setError(errorData.message);
      }
    } catch (error) {
      console.error('Registration error:', error);
      setError('An error occurred during registration.');
    }

    setIsLoading(false);
  };

  return (
    <div className="h-full flex items-center justify-center bg-gray-100 dark:bg-gray-900">
      <div className="max-w-md w-full px-6 py-8 bg-white dark:bg-gray-800 shadow-md rounded-lg">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-800 dark:text-white">Register</h2>
          <p className="text-gray-600 dark:text-gray-400">Create your account to get started.</p>
        </div>
        {error && <p className="text-red-500 mb-4">{error}</p>}
        <form onSubmit={handleSubmit}>
          <div className="mb-6">
            <Input
              label='Email'
              type="email"
              value={email}
              onChange={setEmail}
              placeholder="Enter your email"
              className="w-full"
            />
          </div>
          <div className="mb-6">
            <Input
              label="Username"
              type="text"
              value={username}
              onChange={setUsername}
              placeholder="Enter your username"
              className="w-full"
            /> 
          </div>
          <div className="mb-6">
            <Input
              label="Password"
              type="password"
              value={password}
              onChange={setPassword}
              placeholder="Enter your password"
              className="w-full"
            />
          </div>
          <div className="mb-6">
            <Input
              label="Confirm Password"
              type="password"
              value={confirmPassword}
              onChange={setConfirmPassword}
              placeholder="Confirm your password"
              className="w-full"
            />
          </div>
          <Button className="w-full mb-4" disabled={isLoading}>
            {isLoading ? 'Registering...' : 'Register'}
          </Button>
        </form>
        <p className="text-center text-gray-600 dark:text-gray-400">
          Already have an account?{' '}
          <Link href="/login" className="text-blue-500 hover:underline">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
};

export default RegistrationPage;