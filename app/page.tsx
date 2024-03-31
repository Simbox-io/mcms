// app/page.tsx
import React from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { FaRegComments, FaCloudUploadAlt, FaCodeBranch, FaUsers, FaChartBar, FaPlug, FaUser } from "react-icons/fa";

const LandingPage: React.FC = () => {
  return (
    <div className="flex flex-col min-h-screen bg-white dark:bg-zinc-900">
      <main className="flex-grow">
        <section className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-24">
          <div className="container mx-auto px-4">
            <h1 className="text-5xl font-bold mb-8 text-center">Welcome to MCMS</h1>
            <p className="text-xl mb-12 text-center">
              The ultimate content management system for developers and coding enthusiasts.
            </p>
            <div className="flex justify-center">
              <Link href="/register">
                <Button variant="default" size="lg" className='mr-4'>
                  Get Started
                </Button>
              </Link>
              <Link href="/features">
                <Button variant="outline" size="lg">
                  Learn More
                </Button>
              </Link>
            </div>
          </div>
        </section>
        <section className="py-24">
          <div className="container mx-auto px-4">
            <h2 className="text-4xl font-semibold mb-16 text-center text-zinc-800 dark:text-white">Key Features</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
              <Card className="bg-white dark:bg-zinc-800 shadow-lg transition duration-300 ease-in-out transform hover:-translate-y-2 hover:shadow-xl">
                <CardHeader>
                  <FaRegComments className="w-8 h-8 text-blue-500" />
                  <CardTitle className="text-xl font-semibold text-zinc-800 dark:text-white">Developer Forum</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-zinc-600 dark:text-zinc-400">
                    Engage in discussions, ask questions, and share knowledge with fellow developers.
                  </CardDescription>
                </CardContent>
              </Card>
              <Card className="bg-white dark:bg-zinc-800 shadow-lg transition duration-300 ease-in-out transform hover:-translate-y-2 hover:shadow-xl">
                <CardHeader>
                  <FaCloudUploadAlt className="w-8 h-8 text-blue-500" />
                  <CardTitle className="text-xl font-semibold text-zinc-800 dark:text-white">File Management</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-zinc-600 dark:text-zinc-400">
                    Easily upload, organize, and manage your project files with support for multiple storage providers.
                  </CardDescription>
                </CardContent>
              </Card>
              <Card className="bg-white dark:bg-zinc-800 shadow-lg transition duration-300 ease-in-out transform hover:-translate-y-2 hover:shadow-xl">
                <CardHeader>
                  <FaCodeBranch className="w-8 h-8 text-blue-500" />
                  <CardTitle className="text-xl font-semibold text-zinc-800 dark:text-white">Version Control Integration</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-zinc-600 dark:text-zinc-400">
                    Seamlessly integrate with popular version control systems like GitHub, Bitbucket, and GitLab.
                  </CardDescription>
                </CardContent>
              </Card>
              <Card className="bg-white dark:bg-zinc-800 shadow-lg transition duration-300 ease-in-out transform hover:-translate-y-2 hover:shadow-xl">
                <CardHeader>
                  <FaUsers className="w-8 h-8 text-blue-500" />
                  <CardTitle className="text-xl font-semibold text-zinc-800 dark:text-white">Collaboration Tools</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-zinc-600 dark:text-zinc-400">
                    Work together with your team using project management features and real-time collaboration.
                  </CardDescription>
                </CardContent>
              </Card>
              <Card className="bg-white dark:bg-zinc-800 shadow-lg transition duration-300 ease-in-out transform hover:-translate-y-2 hover:shadow-xl">
                <CardHeader>
                  <FaChartBar className="w-8 h-8 text-blue-500" />
                  <CardTitle className="text-xl font-semibold text-zinc-800 dark:text-white">Analytics and Insights</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-zinc-600 dark:text-zinc-400">
                    Gain valuable insights into your projects and user engagement with detailed analytics.
                  </CardDescription>
                </CardContent>
              </Card>
              <Card className="bg-white dark:bg-zinc-800 shadow-lg transition duration-300 ease-in-out transform hover:-translate-y-2 hover:shadow-xl">
                <CardHeader>
                  <FaPlug className="w-8 h-8 text-blue-500" />
                  <CardTitle className="text-xl font-semibold text-zinc-800 dark:text-white">Extensibility</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-zinc-600 dark:text-zinc-400">
                    Extend the functionality of MCMS with a powerful plugin system and API support.
                  </CardDescription>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>
        <section className="bg-zinc-100 dark:bg-zinc-800 py-24">
          <div className="container mx-auto px-4">
            <h2 className="text-4xl font-semibold mb-16 text-center text-zinc-800 dark:text-white">Open Source and Community-Driven</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
              <div>
                <h3 className="text-3xl font-semibold mb-6 text-zinc-800 dark:text-white">GitHub Repository</h3>
                <p className="mb-6 text-zinc-600 dark:text-zinc-400">
                  MCMS is an open-source project hosted on GitHub, allowing developers to collaborate, contribute, and customize the application to suit their needs.
                </p>
                <p className="text-zinc-600 dark:text-zinc-400">
                  By leveraging the power of the open-source community, MCMS benefits from continuous improvements, bug fixes, and new features contributed by developers worldwide.
                </p>
                <div className="mt-8">
                  <Link href="https://github.com/Simbox-io/mcms" target="_blank" rel="noopener noreferrer">
                    <Button variant="default">
                      Visit GitHub Repository
                    </Button>
                  </Link>
                </div>
              </div>
              <div>
                <h3 className="text-3xl font-semibold mb-6 text-zinc-800 dark:text-white">Community Support</h3>
                <p className="mb-6 text-zinc-600 dark:text-zinc-400">
                  MCMS has an active and vibrant community of developers who provide support, share knowledge, and collaborate on the project.
                </p>
                <p className="text-zinc-600 dark:text-zinc-400">
                  Join our community forums, participate in discussions, and get help from experienced developers who are passionate about MCMS and its mission.
                </p>
                <div className="mt-8">
                  <Link href="/community" target="_blank" rel="noopener noreferrer">
                    <Button variant="outline" size="lg">
                      Join the Community
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>
        <section className="py-24">
          <div className="container mx-auto px-4">
            <h2 className="text-4xl font-semibold mb-16 text-center text-zinc-800 dark:text-white">Get Started with MCMS</h2>
            <div className="text-center">
              <p className="text-xl mb-12 text-zinc-600 dark:text-zinc-400">
                Ready to revolutionize your coding project management? Sign up for MCMS today and experience the difference.
              </p>
              <Link href="/register">
                <Button variant="default" size="lg">
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