// app/profile/page.tsx

'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import Card from '../../components/Card';
import Avatar from '../../components/Avatar';
import Button from '../../components/Button';
import Spinner from '../../components/Spinner';
import { formatDate } from '../../utils/dateUtils';
import { getImageUrl } from '../../utils/imageUtils';
import { useToken } from '../../lib/useToken';
import { User, Project, Post } from '@/lib/prisma';

const UserProfilePage: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [projects, setProjects] = useState<Project[]>([]);
  const [posts, setPosts] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const { data: session } = useSession();
  const token = useToken();
  const sessionUser = session?.user as User;

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        if (!session) {
          router.push('/login');
          return;
        }

        const response = await fetch(`/api/users/${sessionUser.id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.ok) {
          const userData: User = await response.json();
          setUser(userData);

          const projectsResponse = await fetch(`/api/users/${userData.id}/projects`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });

          if (projectsResponse.ok) {
            const projectsData: Project[] = await projectsResponse.json();
            setProjects(projectsData);
          }

          const postsResponse = await fetch(`/api/users/${userData.id}/posts`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });

          if (postsResponse.ok) {
            const postsData: Post[] = await postsResponse.json();
            setPosts(postsData);
          }
        } else {
          router.push('/login');
        }
      } catch (error) {
        console.error('Error fetching user profile:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserProfile();
  }, [session, router, token, sessionUser.id]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Spinner size="large" />
      </div>
    );
  }

  if (!user) {
    return null;
  }
  return (
    <div className="container mx-auto px-4 py-8">
      <Card className="max-w-4xl mx-auto">
        <div className="flex justify-between mb-4">
        <div className="flex flex-col md:flex-row items-center mb-8">
          <Avatar src={getImageUrl(user.avatar)} alt={user.username} className="mb-4 md:mb-0 md:mr-8 h-24 w-24" />
          <div>
            <h1 className="text-3xl font-semibold my-1 text-gray-800 dark:text-white">{user.username}</h1>
            <h2 className="text-2xl mt-2 mb-1 text-gray-800 dark:text-white">{user.firstName} {user.lastName}</h2>
            <p className="text-gray-600 dark:text-gray-400">{user.email}</p>
            <p className="text-gray-600 dark:text-gray-400">Joined on {formatDate(user.createdAt.toString())}</p>
          </div>
        </div>
        <div className="flex justify-end h-10">
          <Button variant="primary" onClick={() => router.push('/profile/edit')}>
            Edit Profile
          </Button>
        </div>
        </div>
        {user.bio && (
          <div className="mb-8">
            <h2 className="text-2xl font-semibold mb-4 text-gray-800 dark:text-white">Bio</h2>
            <p className="text-gray-700 dark:text-gray-300">{user.bio}</p>
          </div>
        )}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <h2 className="text-2xl font-semibold mb-4 text-gray-800 dark:text-white">Projects</h2>
            {projects.length > 0 ? (
              <ul className="space-y-4">
                {projects.map((project) => (
                  <li key={project.id}>
                    <Card className="hover:shadow-md transition-shadow duration-300">
                      <h3 className="text-xl font-semibold mb-2 text-gray-800 dark:text-white">{project.name}</h3>
                      <p className="text-gray-700 dark:text-gray-300">{project.description}</p>
                    </Card>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-600 dark:text-gray-400">No projects found.</p>
            )}
          </div>
          <div>
            <h2 className="text-2xl font-semibold mb-4 text-gray-800 dark:text-white">Posts</h2>
            {posts.length > 0 ? (
              <ul className="space-y-4">
                {posts.map((post) => (
                  <li key={post.id}>
                    <Card className="hover:shadow-md transition-shadow duration-300">
                      <h3 className="text-xl font-semibold mb-2 text-gray-800 dark:text-white">{post.title}</h3>
                      <p className="text-gray-700 dark:text-gray-300">{post.content}</p>
                      <p className="text-gray-500 dark:text-gray-400 mt-2">Posted on {formatDate(post.createdAt.toString())}</p>
                    </Card>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-600 dark:text-gray-400">No posts found.</p>
            )}
          </div>
        </div>
      </Card>
    </div>
  );
}

export default UserProfilePage;