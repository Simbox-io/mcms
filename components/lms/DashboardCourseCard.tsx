// components/DashboardCourseCard.tsx
import { Course, Enrollment } from '@/lib/prisma';
import Link from 'next/link';

type CourseCardProps = {
    course: Enrollment & { course: Course };
};

export default function DashboardCourseCard({ course }: CourseCardProps) {
  if (!course) {
    return (
      <div className="bg-white dark:bg-gray-700 shadow-md rounded-md p-4 mb-4">
        <p className="text-gray-600">No enrolled courses found.</p>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-700 shadow-md rounded-md p-4 mb-4">
      <h3 className="text-xl font-semibold mb-2">{course.course.title}</h3>
      <p className="text-gray-600 dark:text-gray-400 mb-4">{course.course.description}</p>
      <div className="mb-4">
        <div className="h-4 bg-gray-300 dark:bg-gray-400 rounded-full">
          <div
            className="h-4 bg-blue-500 rounded-full"
            style={{ width: `${course.progress}%` }}
          ></div>
        </div>
        <span className="text-gray-500 text-sm">{`${course.progress}% completed`}</span>
      </div>
      <div className="flex justify-between items-center">
        <Link href={`/courses/${course.id}`}>
          <span className="text-blue-500 hover:underline">Resume Course</span>
        </Link>
      </div>
    </div>
  );
}