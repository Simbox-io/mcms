// app/onboarding/layout.tsx

import React from 'react';

const OnboardingLayout: React.FC<{children?: React.ReactNode}> = ({ children }) => {
  return (
    <div className="h-full bg-gray-100 dark:bg-gray-900">
      <div className="max-w-md mx-auto py-12 px-4">
        <h1 className="text-3xl font-bold mb-8 text-center text-gray-800 dark:text-white">
          Welcome to MCMS
        </h1>
        {children}
      </div>
    </div>
  );
};

export default OnboardingLayout;