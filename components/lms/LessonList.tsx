'use client'
import { useRouter } from "next/navigation";

type LessonListProps = {
    lessons: {
      id: string;
      title: string;
      description: string;
    }[];
  };
  
  export default function LessonList({ lessons }: LessonListProps) {
    const router = useRouter();
    return (
      <ul className="space-y-4">
        {lessons.map((lesson) => (
          <li key={lesson.id} className="bg-white dark:bg-gray-800 shadow p-4 rounded-md" onClick={() => router.push(`/courses/lessons/${lesson.id}`)}>
            <h3 className="text-xl font-semibold mb-2 text-gray-800 dark:text-white">{lesson.title}</h3>
            <p className="text-gray-600 dark:text-gray-400">{lesson.description}</p>
          </li>
        ))}
      </ul>
    );
  }