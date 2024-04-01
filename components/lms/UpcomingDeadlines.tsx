// components/UpcomingDeadlines.tsx
import { Assignment, Quiz } from '@prisma/client';

type UpcomingDeadlinesProps = {
  assignments: Assignment[];
  quizzes: Quiz[];
};

export default function UpcomingDeadlines({ assignments, quizzes }: UpcomingDeadlinesProps) {
  if (assignments.length === 0 && quizzes.length === 0) {
    return <p className="text-zinc-600">No upcoming deadlines found.</p>;
  }
  return (
    <div className="bg-white dark:bg-zinc-800 shadow-md rounded-md p-4 mb-4">
      <ul className="space-y-2">
        {assignments.map((assignment) => (
          <li key={assignment.id} className="flex justify-between items-center">
            <span>{assignment.title}</span>
            <span className="text-zinc-500">{/*assignment.dueDate*/} Due tomorrow</span>
          </li>
        ))}
        {quizzes.map((quiz) => (
          <li key={quiz.id} className="flex justify-between items-center">
            <span>{quiz.title}</span>
            <span className="text-zinc-500">{/*quiz.dueDate.toDateString()*/}Due in 3 days</span>
          </li>
        ))}
      </ul>
    </div>
  );
}