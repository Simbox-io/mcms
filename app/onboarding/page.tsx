// app/onboarding/page.tsx

'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import Button from '../../components/Button';

const OnboardingPage: React.FC = () => {
  const router = useRouter();

  const handleGetStarted = () => {
    router.push('/onboarding/profile');
  };

  return (
    <div className="text-center">
      <p className="text-lg text-gray-600 dark:text-gray-400 mb-8">
        Let&apos;s get started by setting up your profile and configuring your preferences.
      </p>
      <Button variant="primary" onClick={handleGetStarted}>
        Get Started
      </Button>
    </div>
  );
};

export default OnboardingPage;