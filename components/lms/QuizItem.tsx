'use client'
import { Quiz } from '@prisma/client';
import { useState } from 'react';

type QuizItemProps = {
  quiz: Quiz;
  lessonId: string;
};

export default function QuizItem({ quiz, lessonId }: QuizItemProps) {
  const [submitted, setSubmitted] = useState(false);
  const [selectedAnswers, setSelectedAnswers] = useState<string[]>([]);

  const handleSubmit = async () => {
    try {
      const res = await fetch(`/api/lms/quizzes/${quiz.id}/submit`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ answers: selectedAnswers }),
      });

      if (res.ok) {
        setSubmitted(true);
      } else {
        console.error('Failed to submit quiz');
      }
    } catch (error) {
      console.error('Failed to submit quiz', error);
    }
  };

  return (
    <li className="bg-white dark:bg-gray-800 shadow p-4 rounded-md">
      <h3 className="text-xl font-semibold mb-2 text-gray-800 dark:text-white">{quiz.title}</h3>
      <p className="text-gray-600 dark:text-gray-400 mb-4">{quiz.description}</p>
      {/* Render quiz questions and answer options */}
      <button
        className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition duration-200"
        onClick={handleSubmit}
        disabled={submitted}
      >
        {submitted ? 'Submitted' : 'Submit'}
      </button>
    </li>
  );
}