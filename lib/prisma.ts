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
  firstName?: string | null;
  lastName?: string | null;
  avatar?: string | null;
  bio?: string | null;
  role: 'ADMIN' | 'MODERATOR' | 'USER';
  posts: Post[];
  comments: Comment[];
  files: File[];
  ownedProjects: Project[];
  memberProjects: Project[];
  followedBy: User[];
  following: User[];
  permissions: Permission[];
  grantedPermissions: Permission[];
  likedPosts: Post[];
  likedComments: Comment[];
  likedFiles: File[];
  likedProjects: Project[];
  likedSpaces: Space[];
  likedPages: Page[];
  likedTags: Tag[];
  followedPosts: Post[];
  followedProjects: Project[];
  followedSpaces: Space[];
  followedTags: Tag[];
  spaces: Space[];
  viewedSpaces: SpaceView[];
  notifications: Notification[];
  activities: Activity[];
  createdAt: Date;
  updatedAt: Date;
  profile?: Profile | null;
  points: number;
  badges: Badge[];
  level: number;
  receiveNotifications: boolean;
  receiveUpdates: boolean;
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
  author: User;
  tags: Tag[];
  comments: Comment[];
  likes: number;
  views: number;
  isFeatured: boolean;
  isPinned: boolean;
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
  author: User;
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
  uploadedBy: User;
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
  image?: string | null;
  files: File[];
  members: User[];
  spaces: Space[];
  owner: User;
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

export type Space = {
  id: number;
  title: string;
  description?: string | null;
  content?: string | null;
  authorId: string;
  author: User;
  projectId?: number | null;
  project?: Project | null;
  pages: Page[];
  createdAt: Date;
  updatedAt: Date;
  views: SpaceView[];
}

export type Page = {
  id: number;
  title: string;
  content: string;
  spaceId: number;
  createdAt: Date;
  updatedAt: Date;
}

export type SpaceView = {
  id: number;
  spaceId: number;
  userId: string;
  viewedAt: Date;
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