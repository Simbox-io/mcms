'use client'
import { Assignment } from '@/lib/prisma';
import { useState } from 'react';

type AssignmentItemProps = {
  assignment: Assignment;
  lessonId: string;
};

export default function AssignmentItem({ assignment, lessonId }: AssignmentItemProps) {
  const [submitted, setSubmitted] = useState(false);
  const [solution, setSolution] = useState('');

  const handleSubmit = async () => {
    try {
      const res = await fetch(`/api/lms/assignments/${assignment.id}/submit`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ solution }),
      });

      if (res.ok) {
        setSubmitted(true);
      } else {
        console.error('Failed to submit assignment');
      }
    } catch (error) {
      console.error('Failed to submit assignment', error);
    }
  };

  return (
    <li className="bg-white dark:bg-zinc-800 shadow p-4 rounded-md">
      <h3 className="text-xl font-semibold mb-2 text-zinc-800 dark:text-white">{assignment.title}</h3>
      <p className="text-zinc-600 dark:text-zinc-400 mb-4">{assignment.description}</p>
      <textarea
        className="w-full px-3 py-2 text-zinc-700 border rounded-lg focus:outline-none"
        rows={4}
        value={solution}
        onChange={(e) => setSolution(e.target.value)}
        disabled={submitted}
      />
      <button
        className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition duration-200"
        onClick={handleSubmit}
        disabled={submitted}
      >
        {submitted ? 'Submitted' : 'Submit'}
      </button>
    </li>
  );
}