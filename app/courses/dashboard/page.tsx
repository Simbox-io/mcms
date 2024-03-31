// app/dashboard/page.tsx
'use client'
import React, { useEffect, useState } from 'react';
import { useUser } from '@clerk/nextjs'
import { Enrollment, Notification, User, Course, Assignment, Quiz, Achievement, UserAchievement, CourseRecommendation, CourseCategory, Tag } from '@/lib/prisma';
import DashboardCourseCard from '@/components/lms/DashboardCourseCard';
import NotificationList from '@/components/lms/NotificationList';
import UpcomingDeadlines from '@/components/lms/UpcomingDeadlines';
import UserAchievements from '@/components/lms/UserAchievements';
import RecommendedCourses from '@/components/lms/RecommendedCourses';

interface EnrolledCourse extends Enrollment {
  course: Course;
}

interface CourseWithDetails extends Pick<Course, Exclude<keyof Course, 'categories' | 'tags'>> {
  instructor: {
    firstName: string;
    lastName: string;
    username: string;
  };
  categories: CourseCategory[];
  tags: Tag[];
}

interface CourseRecommendationWithDetails extends CourseRecommendation {
  course: CourseWithDetails;
}

export default function DashboardPage() {
  const [enrolledCourses, setEnrolledCourses] = useState<EnrolledCourse[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [upcomingAssignments, setUpcomingAssignments] = useState<Assignment[]>([]);
  const [upcomingQuizzes, setUpcomingQuizzes] = useState<Quiz[]>([]);
  const [userAchievements, setUserAchievements] = useState<(UserAchievement & { achievement: Achievement })[]>([]);
  const [courseRecommendations, setCourseRecommendations] = useState<CourseRecommendationWithDetails[]>([]);
  const { user } = useUser();

  useEffect(() => {
    if (!user) {
      return;
    }
    async function getEnrolledCourses(userId: string): Promise<EnrolledCourse[]> {
      const res = await fetch(`/api/users/${userId}/enrolledCourses`);
      if (res.status !== 200) {
        throw new Error('Failed to fetch enrolled courses');
      }
      return await res.json();
    }
    
    async function getNotifications(id: string): Promise<Notification[]> {
      const res = await fetch(`/api/users/${id}/notifications`);
      if (res.status !== 200) {
        throw new Error('Failed to fetch notifications');
      }
      return await res.json();
    }
    
    async function getUpcomingAssignments(userId: string): Promise<Assignment[]> {
      const res = await fetch(`/api/users/${userId}/upcomingAssignments`);
      if (res.status !== 200) {
        throw new Error('Failed to fetch upcoming assignments');
      }
      return await res.json();
    }
    
    async function getUpcomingQuizzes(userId: string): Promise<Quiz[]> {
      const res = await fetch(`/api/users/${userId}/upcomingQuizzes`);
      if (res.status !== 200) {
        throw new Error('Failed to fetch upcoming quizzes');
      }
      return await res.json();
    }
    
    async function getUserAchievements(userId: string): Promise<(UserAchievement & { achievement: Achievement })[]> {
      const res = await fetch(`/api/users/${userId}/achievements`);
      if (res.status !== 200) {
        throw new Error('Failed to fetch user achievements');
      }
      return await res.json();
    }
    
    async function getCourseRecommendations(userId: string): Promise<CourseRecommendationWithDetails[]> {
      const res = await fetch(`/api/users/${userId}/courseRecommendations`);
      if (res.status !== 200) {
        throw new Error('Failed to fetch course recommendations');
      }
      return await res.json();
    }

    getEnrolledCourses(user.id).then(setEnrolledCourses).catch(console.error);
    //getNotifications(user.id).then(setNotifications).catch(console.error);
    getUpcomingAssignments(user.id).then(setUpcomingAssignments).catch(console.error);
    getUpcomingQuizzes(user.id).then(setUpcomingQuizzes).catch(console.error);
    getUserAchievements(user.id).then(setUserAchievements).catch(console.error);
    getCourseRecommendations(user.id).then(setCourseRecommendations).catch(console.error);
  } , [user]);

  if (!user) {
    // Handle unauthorized access
    return <div>Access Denied</div>;
  }

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
