import { Course, CourseCategory, Tag } from '@/lib/prisma';
import { FiGrid, FiList } from 'react-icons/fi';
import { IoMdAdd } from 'react-icons/io';
import Button from '@/components/next-gen/Button';
import CourseCard from '@/components/lms/CourseCard';
import CacheService from '../../../lib/cacheService';
import axios from 'axios';
import instance from '@/utils/api';

async function getCourses(page: number, perPage: number, category: string, tags: string[], search: string) {
  const queryParams = new URLSearchParams();
  queryParams.append('page', page.toString());
  queryParams.append('perPage', perPage.toString());
  if (category) queryParams.append('category', category);
  if (tags.length > 0) queryParams.append('tags', tags.join(','));
  if (search) queryParams.append('search', search);

  const res = await instance.get(`/api/lms/courses?${queryParams.toString()}`);
  console.log(res);
  if (res.status !== 200) {
    throw new Error('Failed to fetch courses');
  }
  return res.data as Promise<{
    courses: (Course & {
      instructor: { name: string };
      categories: { name: string }[];
      tags: { name: string }[];
    })[];
    totalCount: number;
  }>;
}

async function getCategories() {
  const res = await instance.get('/api/lms/categories');
  if (res.status !== 200) {
    throw new Error('Failed to fetch categories');
  }
  return res.data as Promise<CourseCategory[]>;
}

async function getTags() {
  const res = await instance.get('/api/lms/tags');
  if (res.status !== 200) {
    throw new Error('Failed to fetch tags');
  }
  return res.data as Promise<Tag[]>;
}

export default async function CoursesPage({
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
  const [{ courses, totalCount }] = await Promise.all([
    getCourses(page, perPage, category, tag, search),
  ]);

  return (
    <div className="container mx-auto">
      <div className="w-full flex flex-col justify-between">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-semibold text-gray-800 dark:text-white">Courses</h1>
          <div className="flex items-center space-x-4">
            <Button variant="primary">
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
