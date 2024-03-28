import instance from '@/utils/api';
import { Course, CourseCategory, Tag } from '@/lib/prisma';
import { FiGrid, FiList } from 'react-icons/fi';
import { IoMdAdd } from 'react-icons/io';
import Button from '@/components/next-gen/Button';
import CourseCard from '@/components/lms/CourseCard';
import axios from 'axios';

interface CourseWithDetails extends Course {
  instructor: {
    firstName: string;
    lastName: string;
    username: string;
  };
  categories: CourseCategory[];
  tags: Tag[];
}

async function getCourses(page: number, perPage: number, category: string, tags: string[], search: string) {
  const queryParams = new URLSearchParams();

  if (page) queryParams.append('page', page.toString());
  if (perPage) queryParams.append('perPage', perPage.toString());
  if (category) queryParams.append('category', category);
  if (tags.length > 0) queryParams.append('tags', tags.join(','));
  if (search) queryParams.append('search', search);

  try {
    const res = await axios.get(`/api/lms/courses?${queryParams.toString()}`);
    if (res.status !== 200) {
      throw new Error('Failed to fetch courses');
    }
    return res.data as Promise<{
      courses: CourseWithDetails[];
      totalCount: number;
    }>;
  } catch (error) {
    console.error('Failed to fetch courses', error);
    throw new Error('Failed to fetch courses');
  }
}

async function getCategories() {
  try {
    const res = await axios.get('/api/lms/categories');
    if (res.status !== 200) {
      throw new Error('Failed to fetch categories');
    }
    return res.data as Promise<CourseCategory[]>;
  } catch (error) {
    console.error('Failed to fetch categories', error);
    throw new Error('Failed to fetch categories');
  }
}

async function getTags() {
  try {
    const res = await axios.get('/api/lms/tags');
    if (res.status !== 200) {
      throw new Error('Failed to fetch tags');
    }
    return res.data as Promise<Tag[]>;
  } catch (error) {
    console.error('Failed to fetch tags', error);
    throw new Error('Failed to fetch tags');
  }
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

  try {
    const { courses, totalCount } = await getCourses(page, perPage, category, tag, search);

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
  } catch (error) {
    console.error('Failed to render CoursesPage', error);
    return <div>Failed to render courses page. Please try again later.</div>;
  }
}
