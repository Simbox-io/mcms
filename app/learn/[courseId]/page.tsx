import EnrollButton from '@/components/learn/EnrollButton';
import LessonList from '@/components/learn/LessonList';
import { getCourse } from '@/app/actions/actions';

export default async function CourseDetailsPage({ params }: { params: { courseId: string } }) {
  const course = await getCourse(params.courseId);

  if (!course) {
    return <div>Course not found</div>;
  }

  return (
    <div className="container mx-auto py-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <img src={course.image} alt={course.title} className="w-full h-auto mb-4 rounded-lg shadow" />
          <h1 className="text-3xl font-semibold mb-2 text-zinc-800 dark:text-white">{course.title}</h1>
          <p className="text-zinc-600 dark:text-zinc-400 mb-2">Instructor: {course.instructor.firstName} {course.instructor.lastName}</p>
          <p className="text-zinc-600 dark:text-zinc-400 mb-4">{course.description}</p>
          <EnrollButton courseId={course.id} />
        </div>
        <div>
          <h2 className="text-2xl font-semibold mb-4 text-zinc-800 dark:text-white">Lessons</h2>
          <LessonList lessons={course.lessons} />
        </div>
      </div>
    </div>
  );
}