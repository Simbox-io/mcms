import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
import prisma, { Post } from "./prisma"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const getUser = async (username: string) => {
  const user = await prisma.user.findUnique({
    where: {
      username
    },
  });
  return user || null;
};

export const updateUser = async (userId: string, data: any) => {
  await prisma.user.update({
    where: {
      id: userId,
    },
    data: {
      ...data
    }
  });
};

export const getProjects = async () => {
  const projects = await prisma.project.findMany({
    include: {
      owner: true,
    },
  });
  return projects;
};

export const getOwnedProjects = async (userId: string) => {
  const projects = await prisma.project.findMany({
    where: {
      ownerId: userId,
    },
  });
  return projects;
};

export const getNotifications = async (userId: string) => {
  const notifications = await prisma.notification.findMany({
    where: {
      userId: userId,
    },
  });
  return notifications;
};

export const getActivities = async () => {
  const activities = await prisma.activity.findMany({
    include: {
      user: true,
    },
  });
  return activities;
};

export const getActivitiesByUser = async (userId: string) => {
  const activities = await prisma.activity.findMany({
    where: {
      userId: userId,
    },
  });
  return activities;
};

export const getPosts = async () => {
  const posts = await prisma.post.findMany({
    include: {
      author: true,
      comments: true,
    },
  }) as unknown as Post[];
  return posts;
};

export const getPost = async (id: string) => {
  const post = await prisma.post.findUnique({
    where: {
      id: id,
    },
    include: {
      author: true,
      comments: true,
    },
  });
  return post;
};

export const getPostsByUser = async (userId: string) => {
  const posts = await prisma.post.findMany({
    where: {
      authorId: userId,
    },
  });
  return posts;
};

export const getFiles = async () => {
  const files = await prisma.file.findMany({
    include: {
      uploadedBy: true,
    },
  });
  return files;
};

export const getFilesByUser = async (userId: string) => {
  const files = await prisma.file.findMany({
    where: {
      uploadedById: userId,
    },
  });
  return files;
};

export const getSpaces = async () => {
  const spaces = await prisma.space.findMany({
    include: {
      owner: true,
    },
  });
  return spaces;
};

export const getSpacesByUser = async (userId: string) => {
  const spaces = await prisma.space.findMany({
    where: {
      ownerId: userId,
    },
  });
  return spaces;
};

export const getCourse = async (courseId: string) => {
  const course = await prisma.course.findUnique({
    where: {
      id: courseId,
    },
    include: {
      instructor: true,
      categories: true,
      tags: true,
      lessons: true,
    }
  });
  return course;
}

export const getLesson = async (lessonId: string) => {
  const lesson = await prisma.lesson.findUnique({
    where: {
      id: lessonId,
    },
    include: {
      quizzes: true,
      assignments: true,
    }
  });
  return lesson;
}

export const getLessonContent = async (lessonId: string) => {
  const lesson = await prisma.lesson.findUnique({
    where: { id: lessonId },
    select: { content: true },
  });
  return lesson;
}

