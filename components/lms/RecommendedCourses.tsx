import { Course, CourseRecommendation } from '@/lib/prisma';
import CourseCard from './CourseCard';

type RecommendedCoursesProps = {
  courseRecommendations: (CourseRecommendation & {
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
  })[];
};

export default function RecommendedCourses({ courseRecommendations }: RecommendedCoursesProps) {
  if (courseRecommendations.length === 0) {
    return null;
  }

  return (
    <div>
      <h2 className="text-2xl font-semibold mb-4">Recommended Courses</h2>
      <div className="grid grid-cols-1 gap-4">
        {courseRecommendations.map((recommendation) => (
          <CourseCard key={recommendation.id} course={recommendation.course} />
        ))}
      </div>
    </div>
  );
}
