import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { User, Badge } from '@/types';
import { getUser } from '@/lib/api';
import Avatar from '@/components/Avatar';
import Button from '@/components/Button';
import Badge from '@/components/Badge';

interface ProfilePageProps {
  params: {
    id: string;
  };
}

const ProfilePage: React.FC<ProfilePageProps> = ({ params }) => {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const fetchedUser = await getUser(params.id);
        setUser(fetchedUser);
        setIsLoading(false);
      } catch (error) {
        console.error('Error fetching user:', error);
        setIsLoading(false);
      }
    };

    fetchUser();
  }, [params.id]);

  if (status === 'loading') {
    return <div>Loading...</div>;
  }

  if (status === 'unauthenticated') {
    router.push('/login');
    return null;
  }

  if (isLoading) {
    return <div>Loading user...</div>;
  }

  if (!user) {
    return <div>User not found.</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center mb-8">
        <Avatar src={user.avatar} alt={user.username} size="large" />
        <div className="ml-4">
          <h1 className="text-3xl font-semibold text-gray-800 dark:text-white">
            {user.username}
          </h1>
          <p className="text-gray-600 dark:text-gray-400">{user.email}</p>
        </div>
      </div>
      <div className="mb-8">
        <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-2">Bio</h2>
        <p className="text-gray-600 dark:text-gray-400">{user.bio}</p>
      </div>
      <div className="mb-8">
        <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-2">Skills</h2>
        <div className="flex flex-wrap gap-2">
          {user.skills.map((skill) => (
            <Button key={skill} variant="secondary">
              {skill}
            </Button>
          ))}
        </div>
      </div>
      <div className="mb-4">
        <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-2">Badges</h2>
        {user.badges && user.badges.length > 0 ? (
          <div className="flex flex-wrap gap-2">
            {user.badges.map((badge) => (
              <Badge key={badge.id} variant="primary">
                {badge.name}
              </Badge>
            ))}
          </div>
        ) : (
          <div>No badges earned yet.</div>
        )}
      </div>
    </div>
  );
};

export default ProfilePage;
