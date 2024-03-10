// app/page.tsx

import React from 'react';
import Link from 'next/link';
import Button from '@/components/Button';
import Feature from '@/components/Feature';
import CommentsIcon from '@/components/icons/CommentsIcon';
import CloudUploadIcon from '@/components/icons/CloudUploadIcon';
import CodeBranchIcon from '@/components/icons/CodeBranchIcon';
import UsersIcon from '@/components/icons/UsersIcon';
import ChartBarIcon from '@/components/icons/ChartBarIcon';
import PlugIcon from '@/components/icons/PlugIcon';

const LandingPage: React.FC = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-grow">
        <section className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-20">
          <div className="container mx-auto px-4">
            <h1 className="text-4xl font-bold mb-6">Welcome to MCMS</h1>
            <p className="text-xl mb-8">
              The ultimate content management system for developers and coding enthusiasts.
            </p>
            <div>
              <Link href="/register">
                <Button variant="primary" className="mr-4 shadow-lg">
                  Get Started
                </Button>
              </Link>
              <Link href="/features">
                <Button variant="secondary" className='shadow-lg'>Learn More</Button>
              </Link>
            </div>
          </div>
        </section>

        <section className="py-20">
          <div className="container mx-auto px-4 dark:text-white">
            <h2 className="text-3xl font-semibold mb-12 text-center">Key Features</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              <Feature
                icon={<CommentsIcon />}
                title="Developer Forum"
                description="Engage in discussions, ask questions, and share knowledge with fellow developers."
              />
              <Feature
                icon={<CloudUploadIcon />}
                title="File Management"
                description="Easily upload, organize, and manage your project files with support for multiple storage providers."
              />
              <Feature
                icon={<CodeBranchIcon />}
                title="Version Control Integration"
                description="Seamlessly integrate with popular version control systems like GitHub, Bitbucket, and GitLab."
              />
              <Feature
                icon={<UsersIcon />}
                title="Collaboration Tools"
                description="Work together with your team using project management features and real-time collaboration."
              />
              <Feature
                icon={<ChartBarIcon />}
                title="Analytics and Insights"
                description="Gain valuable insights into your projects and user engagement with detailed analytics."
              />
              <Feature
                icon={<PlugIcon />}
                title="Extensibility"
                description="Extend the functionality of MCMS with a powerful plugin system and API support."
              />
            </div>
          </div>
        </section>

        <section className="bg-gray-100 dark:bg-gray-800 py-20">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-semibold mb-12 text-center text-gray-800 dark:text-white">
              Open Source and Community-Driven
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-2xl font-semibold mb-4 text-gray-800 dark:text-white">GitHub Repository</h3>
                <p className="mb-4 text-gray-600 dark:text-gray-400">
                  MCMS is an open-source project hosted on GitHub, allowing developers to collaborate, contribute, and customize the application to suit their needs.
                </p>
                <p className="text-gray-600 dark:text-gray-400">
                  By leveraging the power of the open-source community, MCMS benefits from continuous improvements, bug fixes, and new features contributed by developers worldwide.
                </p>
                <div className="mt-6">
                  <Link href="https://github.com/Simbox-io/mcms" target="_blank" rel="noopener noreferrer">
                    <Button variant="primary">Visit GitHub Repository</Button>
                  </Link>
                </div>
              </div>
              <div>
                <h3 className="text-2xl font-semibold mb-4 text-gray-800 dark:text-white">Community Support</h3>
                <p className="mb-4 text-gray-600 dark:text-gray-400">
                  MCMS has an active and vibrant community of developers who provide support, share knowledge, and collaborate on the project.
                </p>
                <p className="text-gray-600 dark:text-gray-400">
                  Join our community forums, participate in discussions, and get help from experienced developers who are passionate about MCMS and its mission.
                </p>
                <div className="mt-6">
                  <Link href="/community" target="_blank" rel="noopener noreferrer">
                    <Button variant="secondary">Join the Community</Button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="py-20">
          <div className="container mx-auto px-4 dark:text-white">
            <h2 className="text-3xl font-semibold mb-12 text-center">Get Started with MCMS</h2>
            <div className="text-center">
              <p className="text-xl mb-8">
                Ready to revolutionize your coding project management? Sign up for MCMS today and experience the difference.
              </p>
              <Link href="/register">
                <Button variant="primary" size="large">
                  Sign Up Now
                </Button>
              </Link>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default LandingPage;