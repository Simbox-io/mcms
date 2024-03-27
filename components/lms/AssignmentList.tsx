import { Assignment } from '@/lib/prisma';
import AssignmentItem from './AssignmentItem';

type AssignmentListProps = {
  assignments: Assignment[];
  lessonId: string;
};

export default function AssignmentList({ assignments, lessonId }: AssignmentListProps) {
  return (
    <div>
      <h2 className="text-2xl font-semibold mb-4 text-gray-800 dark:text-white">Assignments</h2>
      <ul className="space-y-4">
        {assignments.map((assignment) => (
          <AssignmentItem key={assignment.id} assignment={assignment} lessonId={lessonId} />
        ))}
      </ul>
    </div>
  );
}