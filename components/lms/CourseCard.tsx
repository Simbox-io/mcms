'use client'
import { Course, CourseCategory, Tag } from '@/lib/prisma';
import Link from 'next/link';

type CourseCardProps = {
  course: Course & {
    instructor: {
      firstName: string;
      lastName: string;
      username: string;
    };
    categories: {
      name: string;
    }[];
    tags: {
      name: string;
    }[];
  };
};

export default function CourseCard({ course }: CourseCardProps) {
  return (
    <div className="bg-white dark:bg-gray-800 shadow rounded-lg overflow-hidden">
      <img src={course.image} alt={course.title} className="w-full h-48 object-cover" />
      <div className="p-4">
        <h3 className="text-xl font-semibold mb-2 text-gray-800 dark:text-white">{course.title}</h3>
        <p className="text-gray-600 dark:text-gray-400 mb-2">
          Instructor: {course.instructor.firstName} {course.instructor.lastName}
        </p>
        <p className="text-gray-600 dark:text-gray-400 mb-2">
          Categories: {course.categories.map((category) => category.name).join(', ')}
        </p>
        <p className="text-gray-600 dark:text-gray-400 mb-4">
          Tags: {course.tags.map((tag) => tag.name).join(', ')}
        </p>
        <Link href={`/courses/${course.id}`}>
          <span className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition duration-200">
            View Course
          </span>
        </Link>
      </div>
    </div>
  );
}
