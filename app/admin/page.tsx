'use client';
import React, { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import axios from 'axios';
import { FiUsers, FiFileText, FiMessageSquare, FiFolder, FiBarChart2 } from 'react-icons/fi';
import AdminLayout from '@/components/admin/AdminLayout';
import Card from '@/components/next-gen/Card';
import Spinner from '@/components/base/Spinner';
import { User } from '@/lib/prisma';

interface DashboardStats {
  users: number;
  posts: number;
  forumTopics: number;
  files: number;
  projects: number;
}

const AdminConfigurationPage: React.FC = () => {
  const { data: session } = useSession();
  const user = session?.user as User;
  const [stats, setStats] = useState<DashboardStats>({
    users: 0,
    posts: 0,
    forumTopics: 0,
    files: 0,
    projects: 0,
  });
  const [loading, setLoading] = useState(true);
  const [recentActivity, setRecentActivity] = useState<any[]>([]);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        // In a real implementation, you would fetch actual stats from an API
        // This is just a placeholder
        const response = await axios.get('/api/admin/dashboard/stats').catch(() => ({ data: null }));
        if (response.data) {
          setStats(response.data);
        } else {
          // Set some sample data for demonstration
          setStats({
            users: 42,
            posts: 156,
            forumTopics: 38,
            files: 215,
            projects: 27,
          });
        }
        
        // Fetch recent activity
        const activityResponse = await axios.get('/api/admin/dashboard/activity').catch(() => ({ data: null }));
        if (activityResponse.data) {
          setRecentActivity(activityResponse.data);
        } else {
          setRecentActivity([
            { id: 1, type: 'post', action: 'created', user: 'John Doe', timestamp: new Date().toISOString(), title: 'Getting Started with MCMS' },
            { id: 2, type: 'user', action: 'registered', user: 'Jane Smith', timestamp: new Date().toISOString() },
            { id: 3, type: 'file', action: 'uploaded', user: 'Mike Johnson', timestamp: new Date().toISOString(), title: 'Project Proposal.pdf' },
          ]);
        }
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  const StatCard = ({ title, value, icon, color }: { title: string; value: number; icon: React.ReactNode; color: string }) => (
    <Card className="p-6">
      <div className="flex items-center">
        <div className={`p-3 rounded-full ${color} text-white mr-4`}>
          {icon}
        </div>
        <div>
          <p className="text-sm font-medium text-gray-600 dark:text-gray-400">{title}</p>
          <p className="text-3xl font-semibold text-gray-800 dark:text-white">{value}</p>
        </div>
      </div>
    </Card>
  );

  return (
    <AdminLayout title="Dashboard" description="Overview of your site's performance and activity">
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <Spinner size="large" />
        </div>
      ) : (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <StatCard 
              title="Total Users" 
              value={stats.users} 
              icon={<FiUsers className="h-6 w-6" />} 
              color="bg-blue-500" 
            />
            <StatCard 
              title="Published Posts" 
              value={stats.posts} 
              icon={<FiFileText className="h-6 w-6" />} 
              color="bg-green-500" 
            />
            <StatCard 
              title="Forum Topics" 
              value={stats.forumTopics} 
              icon={<FiMessageSquare className="h-6 w-6" />} 
              color="bg-yellow-500" 
            />
            <StatCard 
              title="Files" 
              value={stats.files} 
              icon={<FiFolder className="h-6 w-6" />} 
              color="bg-purple-500" 
            />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="p-6">
              <h2 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">Recent Activity</h2>
              {recentActivity.length > 0 ? (
                <div className="space-y-4">
                  {recentActivity.map((activity) => (
                    <div key={activity.id} className="flex items-start">
                      <div className="flex-shrink-0 mr-3">
                        {activity.type === 'post' && <FiFileText className="h-5 w-5 text-blue-500" />}
                        {activity.type === 'user' && <FiUsers className="h-5 w-5 text-green-500" />}
                        {activity.type === 'file' && <FiFolder className="h-5 w-5 text-purple-500" />}
                      </div>
                      <div>
                        <p className="text-sm text-gray-800 dark:text-gray-200">
                          <span className="font-medium">{activity.user}</span>{' '}
                          {activity.action} {activity.type}
                          {activity.title && <span> "{activity.title}"</span>}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          {new Date(activity.timestamp).toLocaleString()}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 dark:text-gray-400">No recent activity</p>
              )}
            </Card>

            <Card className="p-6">
              <h2 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">Quick Actions</h2>
              <div className="grid grid-cols-2 gap-4">
                <a
                  href="/admin/posts/editor"
                  className="flex flex-col items-center p-4 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
                >
                  <FiFileText className="h-8 w-8 text-blue-500 mb-2" />
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-200">Create Post</span>
                </a>
                <a
                  href="/admin/users"
                  className="flex flex-col items-center p-4 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
                >
                  <FiUsers className="h-8 w-8 text-green-500 mb-2" />
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-200">Manage Users</span>
                </a>
                <a
                  href="/admin/files"
                  className="flex flex-col items-center p-4 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
                >
                  <FiFolder className="h-8 w-8 text-purple-500 mb-2" />
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-200">Upload Files</span>
                </a>
                <a
                  href="/admin/analytics"
                  className="flex flex-col items-center p-4 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
                >
                  <FiBarChart2 className="h-8 w-8 text-yellow-500 mb-2" />
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-200">View Analytics</span>
                </a>
              </div>
            </Card>
          </div>
        </div>
      )}
    </AdminLayout>
  );
};

export default AdminConfigurationPage;