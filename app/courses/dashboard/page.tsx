// app/dashboard/page.tsx
import { getServerSession } from 'next-auth/next';
import authOptions from '@/app/api/auth/[...nextauth]/options';
import { Enrollment, Notification, User, Course, Assignment, Quiz, Achievement, UserAchievement, CourseRecommendation } from '@/lib/prisma';
import DashboardCourseCard from '@/components/lms/DashboardCourseCard';
import NotificationList from '@/components/lms/NotificationList';
import UpcomingDeadlines from '@/components/lms/UpcomingDeadlines';
import UserAchievements from '@/components/lms/UserAchievements';
import RecommendedCourses from '@/components/lms/RecommendedCourses';
import instance from '@/utils/api';

interface EnrolledCourse extends Enrollment {
  course: Course;
}

async function getEnrolledCourses(userId: string): Promise<EnrolledCourse[]> {
  const res = await instance.get(`/api/users/${userId}/enrolledCourses`);
  if (res.status !== 200) {
    throw new Error('Failed to fetch enrolled courses');
  }
  return res.data;
}

async function getNotifications(id: string): Promise<Notification[]> {
  const res = await instance.get(`/api/users/${id}/notifications`);
  if (res.status !== 200) {
    throw new Error('Failed to fetch notifications');
  }
  return res.data?.notifications || [];
}

async function getUpcomingAssignments(userId: string): Promise<Assignment[]> {
  const res = await instance.get(`/api/users/${userId}/upcomingAssignments`);
  if (res.status !== 200) {
    throw new Error('Failed to fetch upcoming assignments');
  }
  return res.data;
}

async function getUpcomingQuizzes(userId: string): Promise<Quiz[]> {
  const res = await instance.get(`/api/users/${userId}/upcomingQuizzes`);
  if (res.status !== 200) {
    throw new Error('Failed to fetch upcoming quizzes');
  }
  return res.data;
}

async function getUserAchievements(userId: string): Promise<(UserAchievement & { achievement: Achievement })[]> {
  const res = await instance.get(`/api/users/${userId}/achievements`);
  if (res.status !== 200) {
    throw new Error('Failed to fetch user achievements');
  }
  return res.data;
}

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);
  if (!session) {
    // Handle unauthorized access
    return <div>Access Denied</div>;
  }

  async function getCourseRecommendations(userId: string): Promise<(CourseRecommendation & { course: Course })[]> {
    const res = await instance.get(`/api/users/${userId}/courseRecommendations`);
    if (res.status !== 200) {
      throw new Error('Failed to fetch course recommendations');
    }
    return res.data;
  }

  const user = session.user as User;
  const [enrolledCourses, upcomingAssignments, upcomingQuizzes, userAchievements, courseRecommendations] = await Promise.all([
    getEnrolledCourses(user.id),
    //getNotifications(user.id),
    getUpcomingAssignments(user.id),
    getUpcomingQuizzes(user.id),
    getUserAchievements(user.id),
    getCourseRecommendations(user.id),
  ]);

  return (
    <div className="bg-white dark:bg-gray-900 min-h-screen">
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8 text-gray-800 dark:text-white">Student Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white">Enrolled Courses</h2>
          {enrolledCourses.map((course) => (
            <DashboardCourseCard key={course.id} course={course} />
          ))}
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white">Upcoming Deadlines</h2>
          <UpcomingDeadlines assignments={upcomingAssignments} quizzes={upcomingQuizzes} />
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white">Achievements</h2>
          <UserAchievements userAchievements={userAchievements} />
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white">Recommended Courses</h2>
          <RecommendedCourses courseRecommendations={courseRecommendations} />
        </div>
      </div>
    </div>
  </div>
  );
}