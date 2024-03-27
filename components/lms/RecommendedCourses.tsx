// components/RecommendedCourses.tsx
import { CourseRecommendation, Course } from '@/lib/prisma';
import CourseCard from './CourseCard';

type RecommendedCoursesProps = {
  courseRecommendations: (CourseRecommendation & { course: Course })[];
};

export default function RecommendedCourses({ courseRecommendations }: RecommendedCoursesProps) {
  return (
    <div className="bg-white shadow-md rounded-md p-4 mb-4">
      <h2 className="text-xl font-semibold mb-4">Recommended Courses</h2>
      {courseRecommendations.length === 0 ? (
        <p className="text-gray-600">No course recommendations available.</p>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {courseRecommendations.map((recommendation) => (
            <CourseCard key={recommendation.id} course={recommendation.course} />
          ))}
        </div>
      )}
    </div>
  );
}