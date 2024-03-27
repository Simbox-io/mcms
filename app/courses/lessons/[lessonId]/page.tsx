import { Lesson, Quiz, Assignment } from '@/lib/prisma';
import { notFound } from 'next/navigation';
import LessonContent from '@/components/lms/LessonContent';
import QuizList from '@/components/lms/QuizList';
import AssignmentList from '@/components/lms/AssignmentList';
import instance from '@/utils/api';

async function getLesson(lessonId: string) {
  const res = await instance.get(`/api/lms/lessons/${lessonId}`);
  if (res.status !== 200) {
    notFound();
  }
  return res.data as Promise<Lesson & {
    quizzes: Quiz[];
    assignments: Assignment[];
  }>;
}

async function getLessonContent(lessonId: string) {
    const res = await instance.get(`/api/lms/lessons/${lessonId}/content`);
    if (res.status !== 200) {
      throw new Error('Failed to fetch lesson content');
    }
    return res.data;
  }

export default async function LessonPage({ params }: { params: { courseId: string; lessonId: string } }) {
  const lesson = await getLesson(params.lessonId);
  const { content } = await getLessonContent(params.lessonId);

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-semibold mb-4 text-gray-800 dark:text-white">{lesson.title}</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <LessonContent content={content} />
        </div>
        <div>
          <QuizList quizzes={lesson.quizzes} lessonId={lesson.id} />
          <AssignmentList assignments={lesson.assignments} lessonId={lesson.id} />
        </div>
      </div>
    </div>
  );
}