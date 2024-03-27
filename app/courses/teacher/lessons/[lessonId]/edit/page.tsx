// app/cms/lessons/[lessonId]/edit/page.tsx
'use client'
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { Course, Lesson } from '@/lib/prisma';
import LessonSidebar from '@/components/lms/LessonSidebar';
import instance from '@/utils/api';
import dynamic from 'next/dynamic';

const ContentEditor = dynamic(() => import('@/components/lms/ContentEditor'), {
  ssr: false,
});

interface CourseLesson extends Lesson {
  lesson: Lesson;
  course: Course;
}

async function getLesson(lessonId: string): Promise<CourseLesson> {
  const res = await instance.get(`/api/lms/lessons/${lessonId}`);
  if (res.status !== 200) {
    throw new Error('Failed to fetch lesson');
  }
  return res.data;
}

async function updateLessonContent(lessonId: string, content: string): Promise<CourseLesson> {
  const res = await instance.put(`/api/lms/lessons/${lessonId}/content`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ content }),
  });
  if (res.status !== 200) {
    throw new Error('Failed to update lesson content');
  }
  return res.data;
}

export default function EditLessonPage({ params }: { params: { lessonId: string } }) {
  const router = useRouter();
  const { lessonId } = params;
  const [lesson, setLesson] = useState<CourseLesson | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchLesson = async () => {
    try {
      const fetchedLesson = await getLesson(lessonId);
      setLesson(fetchedLesson);
    } catch (error) {
      console.error('Failed to fetch lesson', error);
      setError('Failed to fetch lesson');
    }
  };

  const handleSave = async (content: string) => {
    setIsSaving(true);
    setError(null);

    try {
      const updatedLesson = await updateLessonContent(lessonId, content);
      setLesson(updatedLesson);
      router.push(`/lms/lessons/${lessonId}`);
    } catch (error) {
      console.error('Failed to update lesson content', error);
      setError('Failed to update lesson content');
    }

    setIsSaving(false);
  };

  // Fetch lesson data on component mount
  useEffect(() => {
    fetchLesson();
  }, []);

  if (!lesson) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container mx-auto">
      <div className="w-full flex flex-col justify-between">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-semibold text-gray-800 dark:text-white">Edit Lesson</h1>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="md:col-span-2">
            <div className="bg-white dark:bg-gray-800 shadow-md rounded-md p-6">
              <h1 className="text-2xl font-semibold mb-4 text-gray-800 dark:text-white">{lesson?.title}</h1>
              {error && <p className="text-red-500 mb-4">{error}</p>}
              <ContentEditor initialContent={lesson?.content || ''} onSave={handleSave} />
              {isSaving && <p className="mt-4 text-gray-600 dark:text-gray-400">Saving...</p>}
            </div>
          </div>
          <div className="md:col-span-1">
            {lesson && <LessonSidebar lesson={lesson} />}
          </div>
        </div>
      </div>
    </div>
  );
}