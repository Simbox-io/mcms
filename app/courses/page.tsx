'use client'
import React, { useEffect, useState } from 'react';
import { Course, CourseCategory, Tag, User } from '@/lib/prisma';
import { FiGrid, FiList } from 'react-icons/fi';
import { IoMdAdd } from 'react-icons/io';
import { Button } from '@/components/ui/button';
import CourseCard from '@/components/lms/CourseCard';

interface CourseWithDetails extends Course {
  instructor: User;
  categories: CourseCategory[];
  tags: Tag[];
}

export default function CoursesPage({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const page = searchParams.page ? parseInt(searchParams.page as string) : 1;
  const perPage = 9;
  const category = searchParams.category as CourseCategory['name'];
  const tag = searchParams.tags ? (searchParams.tags as Tag['name'][]) : [];
  const search = searchParams.search as string;
  const view = 'grid';
  const [courses, setCourses] = useState<(CourseWithDetails)[]>([]);
  const [totalCount, setTotalCount] = useState(0);

  useEffect(() => {
    async function getCourses(page: number, perPage: number, category: string, tags: string[], search: string) {
      const queryParams = new URLSearchParams();
      queryParams.append('page', page.toString());
      queryParams.append('perPage', perPage.toString());
      if (category) queryParams.append('category', category);
      if (tags.length > 0) queryParams.append('tags', tags.join(','));
      if (search) queryParams.append('search', search);

      const res = await fetch(`/api/lms/courses?${queryParams.toString()}`);
      if (res.status !== 200) {
        throw new Error('Failed to fetch courses');
      }
      return await res.json() as Promise<{
        courses: (Course & {
          instructor: User;
          categories: CourseCategory[];
          tags: Tag[];
        })[];
        totalCount: number;
      }>;
    }
    getCourses(page, perPage, category, tag, search).then((data) => {
      setCourses(data.courses);
      setTotalCount(data.totalCount);
    }, console.error);
  }, [page, perPage, search]);

  return (
    <div className="container mx-auto">
      <div className="w-full flex flex-col justify-between">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-semibold text-gray-800 dark:text-white">Courses</h1>
          <div className="flex items-center space-x-4">
            <Button variant="default">
              <IoMdAdd />
            </Button>
            <Button variant="secondary">
              {view === 'grid' ? <FiList /> : <FiGrid />}
            </Button>
          </div>
        </div>
        <div className="mb-8">
          <div className="flex justify-between">
            <div className="flex-grow mr-4 ">
              <span className="text-gray-500 dark:text-gray-400 mb-6">Filter courses...</span>
            </div>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 ml-4">
          {courses.map((course) => (
            <CourseCard key={course.id} course={course} />
          ))}
        </div>
      </div>
    </div>
  );
}