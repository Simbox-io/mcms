import LessonContent from '@/components/lms/LessonContent';
import QuizList from '@/components/lms/QuizList';
import AssignmentList from '@/components/lms/AssignmentList';
import { getLesson, getLessonContent } from '@/lib/utils';
import { Quiz } from '@/lib/prisma';

export default async function LessonPage({ params }: { params: { courseId: string; lessonId: string } }) {
  const lesson = await getLesson(params.lessonId);
  const content = await getLessonContent(params.lessonId);

  if (!lesson || !content) {
    return <div>Lesson not found</div>;
  }

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-semibold mb-4 text-zinc-800 dark:text-white">{lesson.title}</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <LessonContent content={content.content} />
        </div>
        <div>
          <QuizList quizzes={lesson.quizzes as Quiz[]} lessonId={lesson.id} />
          <AssignmentList assignments={lesson.assignments} lessonId={lesson.id} />
        </div>
      </div>
    </div>
  );
}