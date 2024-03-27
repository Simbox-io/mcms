// app/dashboard/page.tsx
import { getServerSession } from 'next-auth/next';
import authOptions from '@/app/api/auth/[...nextauth]/options';
import { Enrollment, Notification, User, Course, Assignment, Quiz } from '@/lib/prisma';
import DashboardCourseCard from '@/components/lms/DashboardCourseCard';
import NotificationList from '@/components/lms/NotificationList';
import UpcomingDeadlines from '@/components/lms/UpcomingDeadlines';
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


export default async function DashboardPage() {
  const session = await getServerSession(authOptions);
  if (!session) {
    // Handle unauthorized access
    return <div>Access Denied</div>;
  }

  const user = session.user as User;
  const [enrolledCourses, upcomingAssignments, upcomingQuizzes] = await Promise.all([
    getEnrolledCourses(user.id),
    //getNotifications(user.id),
    getUpcomingAssignments(user.id),
    getUpcomingQuizzes(user.id),
  ]);

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-semibold mb-4">Student Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <h2 className="text-2xl font-semibold mb-4">Enrolled Courses</h2>
          {enrolledCourses?.length > 0 && enrolledCourses.map((course) => (
            <DashboardCourseCard key={course.id} course={course} />
          )) || <p>No courses found</p>}
        </div>
        {/*<div>
          <h2 className="text-2xl font-semibold mb-4">Notifications</h2>
          notifications?.length > 0 && <NotificationList notifications={notifications} />
        </div>*/}
        <div className="">
          <h2 className="text-2xl font-semibold mb-4">Upcoming Deadlines</h2>
          <UpcomingDeadlines assignments={upcomingAssignments || []} quizzes={upcomingQuizzes || []} />
        </div>
      </div>
    </div>
  );
}