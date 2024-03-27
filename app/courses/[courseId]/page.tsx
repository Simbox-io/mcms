import { Course } from '@prisma/client';
import { notFound } from 'next/navigation';
import EnrollButton from '@/components/lms/EnrollButton';
import LessonList from '@/components/lms/LessonList';
import instance from '@/utils/api';

async function getCourse(courseId: string) {
  const res = await instance.get(`/api/lms/courses/${courseId}`);
  if (res.status === 404) {
    notFound();
  }
  return res.data as Promise<Course & {
    instructor: { name: string };
    categories: { name: string }[];
    tags: { name: string }[];
    lessons: { id: string; title: string; description: string }[];
    reviews: { id: string; rating: number; comment: string; author: { name: string } }[];
  }>;
}

export default async function CourseDetailsPage({ params }: { params: { courseId: string } }) {
  const course = await getCourse(params.courseId);

  return (
    <div className="container mx-auto py-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <img src={course.image} alt={course.title} className="w-full h-auto mb-4 rounded-lg shadow" />
          <h1 className="text-3xl font-semibold mb-2 text-gray-800 dark:text-white">{course.title}</h1>
          <p className="text-gray-600 dark:text-gray-400 mb-2">Instructor: {course.instructor.name}</p>
          <p className="text-gray-600 dark:text-gray-400 mb-4">{course.description}</p>
          <EnrollButton courseId={course.id} />
        </div>
        <div>
          <h2 className="text-2xl font-semibold mb-4 text-gray-800 dark:text-white">Lessons</h2>
          <LessonList lessons={course.lessons} />
        </div>
      </div>
    </div>
  );
}