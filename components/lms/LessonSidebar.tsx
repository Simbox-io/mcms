// components/LessonSidebar.tsx
import { Course, Lesson } from '@/lib/prisma';

type LessonSidebarProps = {
  lesson: Lesson & {
    course: Course;
  };
};

export default function LessonSidebar({ lesson }: LessonSidebarProps) {
  return (
    <div className="bg-white dark:bg-gray-800 shadow-md rounded-md p-4">
      <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white">Lesson Details</h2>
      <p className="text-gray-600 dark:text-gray-400 mb-2">
        <strong>Course:</strong> {lesson.course?.title}
      </p>
      <p className="text-gray-600 dark:text-gray-400 mb-2">
        <strong>Duration:</strong> {lesson.duration} minutes
      </p>
      <p className="text-gray-600 dark:text-gray-400 mb-2">
        <strong>Published:</strong> {lesson.published ? true : false}
      </p>
      {/* Add more lesson details as needed */}
    </div>
  );
}