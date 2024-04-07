// components/UserAchievements.tsx
import { UserAchievement, Achievement } from '@/lib/prisma';

type UserAchievementsProps = {
  userAchievements: (UserAchievement & { achievement: Achievement })[];
};

export default function UserAchievements({ userAchievements }: UserAchievementsProps) {
  return (
    <div className="bg-white dark:bg-zinc-700 shadow-md rounded-md p-4 mb-4">
      <h2 className="text-xl font-semibold mb-4">Achievements</h2>
      {userAchievements.length === 0 ? (
        <p className="text-zinc-600 dark:text-zinc-400">No achievements earned yet.</p>
      ) : (
        <ul className="grid grid-cols-2 gap-4">
          {userAchievements.map((userAchievement) => (
            <li key={userAchievement.id} className="flex items-center">
              <img
                src={userAchievement.achievement.image}
                alt={userAchievement.achievement.name}
                className="w-10 h-10 mr-2"
              />
              <div>
                <h3 className="font-semibold">{userAchievement.achievement.name}</h3>
                <p className="text-zinc-600 text-sm">{userAchievement.achievement.description}</p>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}