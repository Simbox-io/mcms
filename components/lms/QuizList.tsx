import { Quiz } from '@/lib/prisma';
import QuizItem from './QuizItem';

type QuizListProps = {
  quizzes: Quiz[];
  lessonId: string;
};

export default function QuizList({ quizzes, lessonId }: QuizListProps) {
  return (
    <div className="mb-8">
      <h2 className="text-2xl font-semibold mb-4 text-gray-800 dark:text-white">Quizzes</h2>
      <ul className="space-y-4">
        {quizzes.map((quiz) => (
          <QuizItem key={quiz.id} quiz={quiz} lessonId={lessonId} />
        ))}
      </ul>
    </div>
  );
}