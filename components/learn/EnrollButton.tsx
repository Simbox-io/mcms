'use client'
import { useState } from 'react';

type EnrollButtonProps = {
  courseId: string;
};

export default function EnrollButton({ courseId }: EnrollButtonProps) {
  const [enrolled, setEnrolled] = useState(false);

  const handleEnroll = async () => {
    try {
      const res = await fetch(`/api/lms/courses/${courseId}/enroll`, {
        method: 'POST',
      });

      if (res.ok) {
        setEnrolled(true);
      } else {
        console.error('Failed to enroll in course');
      }
    } catch (error) {
      console.error('Failed to enroll in course', error);
    }
  };

  return (
    <button
      className={`px-4 py-2 rounded-md ${
        enrolled ? 'bg-green-500 hover:bg-green-600' : 'bg-blue-500 hover:bg-blue-600'
      } text-white transition duration-200`}
      onClick={handleEnroll}
      disabled={enrolled}
    >
      {enrolled ? 'Enrolled' : 'Enroll Now'}
    </button>
  );
}