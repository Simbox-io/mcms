// app/admin/users/page.tsx
'use client';
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import Table from '../../../components/Table';
import Card from '../../../components/base/Card';
import Button from '../../../components/Button';
import Spinner from '../../../components/Spinner';
import { User } from '@/lib/prisma';
import { Menu, Transition } from '@headlessui/react';
import { createPortal } from 'react-dom';

const ActionsMenu: React.FC<{ user: User; onDelete: (userId: string) => void }> = ({ user, onDelete }) => {
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);
  const [impersonating, setImpersonating] = useState(false);

  useEffect(() => {
    const impersonate = async () => {
      try {
        const response = await fetch(`/api/users/${user.id}/impersonate`, {
          method: 'POST',
        });
        if (response.ok) {
          router.push('/');
        } else {
          console.error('Error impersonating user:', response.statusText);
        }
      } catch (error) {
        console.error('Error impersonating user:', error);
      }
    };

    if (impersonating) {
      impersonate();
    }
  }, [impersonating, user.id, router]);

  return (
    <Menu as="div" className="relative inline-block text-left">
      {({ open }) => (
        <>
          <div>
            <Menu.Button
              className="inline-flex justify-center w-full px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75"
              onClick={() => setMenuOpen(true)}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
              </svg>
            </Menu.Button>
          </div>
          {menuOpen &&
            createPortal(
              <div className="fixed inset-0 z-10">
                <div className="fixed inset-0 bg-black opacity-25" onClick={() => setMenuOpen(false)}></div>
                <Transition
                  show={open}
                  as={React.Fragment}
                  enter="transition ease-out duration-100"
                  enterFrom="transform opacity-0 scale-95"
                  enterTo="transform opacity-100 scale-100"
                  leave="transition ease-in duration-75"
                  leaveFrom="transform opacity-100 scale-100"
                  leaveTo="transform opacity-0 scale-95"
                >
                  <Menu.Items static className="absolute right-0 w-56 mt-2 origin-top-right bg-white dark:bg-gray-800 divide-y divide-gray-100 dark:divide-gray-700 rounded-md shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                    <div className="px-1 py-1">
                      <Menu.Item>
                        {({ active }) => (
                          <button
                            className={`${active ? 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white' : 'text-gray-700 dark:text-gray-200'
                              } group flex rounded-md items-center w-full px-2 py-2 text-sm`}
                            onClick={() => router.push(`/admin/users/${user.id}`)}
                          >
                            Edit
                          </button>
                        )}
                      </Menu.Item>
                      <Menu.Item>
                        {({ active }) => (
                          <button
                            className={`${active ? 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white' : 'text-gray-700 dark:text-gray-200'
                              } group flex rounded-md items-center w-full px-2 py-2 text-sm`}
                            onClick={() => router.push(`/admin/users/${user.id}/reset-password`)}
                          >
                            Reset Password
                          </button>
                        )}
                      </Menu.Item>
                      <Menu.Item>
                        {({ active }) => (
                          <button
                            className={`${
                              active ? 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white' : 'text-gray-700 dark:text-gray-200'
                            } group flex rounded-md items-center w-full px-2 py-2 text-sm`}
                            onClick={() => {
                              setMenuOpen(false);
                              setImpersonating(true);
                            }}
                          >
                            Impersonate
                          </button>
                        )}
                      </Menu.Item>
                      <Menu.Item>
                        {({ active }) => (
                          <button
                            className={`${active ? 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white' : 'text-gray-700 dark:text-gray-200'
                              } group flex rounded-md items-center w-full px-2 py-2 text-sm`}
                            onClick={() => router.push(`/admin/users/${user.id}/activity`)}
                          >
                            Activity
                          </button>
                        )}
                      </Menu.Item>
                      <Menu.Item>
                        {({ active }) => (
                          <button
                            className={`${active ? 'bg-red-100 dark:bg-red-700 text-red-900 dark:text-red-200' : 'text-red-700 dark:text-red-200'
                              } group flex rounded-md items-center w-full px-2 py-2 text-sm`}
                            onClick={() => {
                              setMenuOpen(false);
                              onDelete(user.id);
                            }}
                          >
                            Delete
                          </button>
                        )}
                      </Menu.Item>
                    </div>
                  </Menu.Items>
                </Transition>
              </div>,
              document.body
            )}
        </>
      )}
    </Menu>
  );
};

const UserManagementPage: React.FC = () => {
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const { data: session, status } = useSession();
  const user = session?.user as User;
  const [users, setUsers] = useState<User[]>([]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch('/api/users');
        if (response.ok) {
          const data = await response.json();
          setUsers(data);
        } else {
          console.error('Error fetching users:', response.statusText);
        }
      } catch (error) {
        console.error('Error fetching users:', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchUsers();
  }, []);

  const handleDeleteUser = async (userId: string) => {
    try {
      const response = await fetch(`/api/users/${userId}`, {
        method: 'DELETE',
      });
      if (response.ok) {
        setUsers((prevUsers) => prevUsers.filter((user) => user.id !== userId));
      } else {
        console.error('Error deleting user:', response.statusText);
      }
    } catch (error) {
      console.error('Error deleting user:', error);
    }
  };

  if (status === 'loading') {
    return <div>Loading...</div>;
  }

  if (status === 'unauthenticated') {
    router.push('/login');
    return null;
  }

  if (user?.role !== 'ADMIN') {
    router.push('/');
    return null;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-semibold mb-8 text-gray-800 dark:text-white">User Management</h1>
      {isLoading ? (
        <div className="flex justify-center items-center h-screen">
          <Spinner size="large" />
        </div>
      ) : (
        <>
          <div className="hidden sm:block">
            <Table
              columns={[
                { header: 'Username', accessor: 'username' },
                { header: 'Email', accessor: 'email' },
                { header: 'Role', accessor: 'role' },
                {
                  header: 'Actions',
                  accessor: (row: User) => <ActionsMenu user={row} onDelete={handleDeleteUser} />,
                } as any,
              ]}
              data={users}
            />
          </div>
          <div className="sm:hidden">
            <div className="grid grid-cols-1 gap-4">
              {users.map((user) => (
                <Card
                  key={user.id}
                  content={
                    <div>
                      <h2 className="text-xl font-semibold mb-2 text-gray-800 dark:text-white">{user.username}</h2>
                      <p className="text-gray-600 dark:text-gray-400">{user.email}</p>
                      <p className="text-gray-600 dark:text-gray-400">{user.role}</p>
                    </div>
                  }
                  footer={<ActionsMenu user={user} onDelete={handleDeleteUser} />}
                />
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default UserManagementPage;