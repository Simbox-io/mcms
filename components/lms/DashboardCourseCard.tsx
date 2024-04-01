// components/DashboardCourseCard.tsx
import { Course, Enrollment } from '@/lib/prisma';
import Link from 'next/link';

type CourseCardProps = {
    course: Enrollment & { course: Course };
};

export default function DashboardCourseCard({ course }: CourseCardProps) {
  if (!course) {
    return (
      <div className="bg-white dark:bg-zinc-700 shadow-md rounded-md p-4 mb-4">
        <p className="text-zinc-600">No enrolled courses found.</p>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-zinc-700 shadow-md rounded-md p-4 mb-4">
      <h3 className="text-xl font-semibold mb-2">{course.course.title}</h3>
      <p className="text-zinc-600 dark:text-zinc-400 mb-4">{course.course.description}</p>
      <div className="mb-4">
        <div className="h-4 bg-zinc-300 dark:bg-zinc-400 rounded-full">
          <div
            className="h-4 bg-blue-500 rounded-full"
            style={{ width: `${course.progress}%` }}
          ></div>
        </div>
        <span className="text-zinc-500 text-sm">{`${course.progress}% completed`}</span>
      </div>
      <div className="flex justify-between items-center">
        <Link href={`/courses/${course.id}`}>
          <span className="text-blue-500 hover:underline">Resume Course</span>
        </Link>
      </div>
    </div>
  );
}