// lib/prisma.ts

import { PrismaClient } from '@prisma/client';

declare global {
  var prisma: PrismaClient | undefined;
}

export type User = {
  id: string;
  username: string;
  email: string;
  passwordHash: string;
  avatar?: string | null;
  bio?: string | null;
  role: 'ADMIN' | 'MODERATOR' | 'USER';
  posts: Post[];
  comments: Comment[];
  files: File[];
  ownedProjects: Project[];
  memberProjects: Project[];
  wikis: Wiki[];
  followedBy: User[];
  following: User[];
  permissions: Permission[];
  grantedPermissions: Permission[];
  notifications: Notification[];
  activities: Activity[];
  createdAt: Date;
  updatedAt: Date;
  profile?: Profile | null;
  points: number;
  badges: Badge[];
  level: number;
}


export type Profile = {
  id: number;
  userId: string;
  bio?: string | null;
  location?: string | null;
  website?: string | null;
  socialLinks: SocialLink[];
  skills: Skill[];
  gamificationStats?: GamificationStats | null;
}

export type SocialLink = {
  id: number;
  profileId: number;
  platform: string;
  url: string;
}

export type Skill = {
  id: number;
  profileId: number;
  name: string;
}

export type GamificationStats = {
  id: number;
  profileId: number;
  points: number;
  level: number;
  badges: Badge[];
}

export type Badge = {
  id: number;
  gamificationStatsId: number;
  name: string;
  description: string;
  earnedAt: Date;
  userId?: string | null;
}

export type Post = {
  id: number;
  title: string;
  content: string;
  authorId: string;
  tags: Tag[];
  comments: Comment[];
  forum: boolean;
  isPublished: boolean;
  publishedAt?: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

export type Comment = {
  id: number;
  content: string;
  postId: number;
  authorId: string;
  createdAt: Date;
  updatedAt: Date;
}

export type File = {
  id: number;
  name: string;
  url: string;
  description?: string | null;
  isPublic: boolean;
  projectId?: number | null;
  uploadedById: string;
  tags: Tag[];
  createdAt: Date;
  updatedAt: Date;
}

export type Project = {
  id: number;
  ownerId: string;
  name: string;
  description?: string | null;
  repository?: string | null;
  files: File[];
  members: User[];
  wikis: Wiki[];
  createdAt: Date;
  updatedAt: Date;
}

export type Wiki = {
  id: number;
  title: string;
  content: string;
  projectId: number;
  authorId: string;
  createdAt: Date;
  updatedAt: Date;
}

export type Tag = {
  id: number;
  name: string;
  posts: Post[];
  files: File[];
}

export type Notification = {
  id: number;
  userId: string;
  message: string;
  link?: string | null;
  read: boolean;
  createdAt: Date;
}

export type Activity = {
  id: number;
  userId: string;
  type: string;
  message: string;
  itemId: number;
  createdAt: Date;
}

export type Permission = {
  id: number;
  userId: string;
  resource: string;
  action: string;
  grantedById: string;
  grantedAt: Date;
}

export type AdminSettings = {
  id: number;
  siteTitle: string;
  siteDescription: string;
  logo?: string | null;
  accentColor: string;
  customCSS?: string | null;
  customJS?: string | null;
  emailDigestSubject?: string | null;
  emailSignature?: string | null;
  emailProvider: string;
  fileStorageProvider: string;
  createdAt: Date;
  updatedAt: Date;
}

export type Image = {
  id: number;
  fileName: string;
  url: string;
  contentType: string;
  data: Buffer;
  createdAt: Date;
  updatedAt: Date;
}

export type Plugin = {
  id: number;
  name: string;
  description: string;
  version: string;
  createdAt: Date;
  updatedAt: Date;
}

export enum Role {
  ADMIN = 'ADMIN',
  MODERATOR = 'MODERATOR',
  USER = 'USER',
}



const prisma = global.prisma || new PrismaClient();

if (process.env.NODE_ENV !== 'production') {
  global.prisma = prisma;
}

export default prisma;