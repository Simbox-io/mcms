// lib/prisma.ts

import { PrismaClient } from '@prisma/client';

declare global {
  var prisma: PrismaClient | undefined;
}

let prisma: PrismaClient;

if (process.env.NODE_ENV === 'production') {
  prisma = new PrismaClient();
} else {
  if (!global.prisma) {
    global.prisma = new PrismaClient();
  }
  prisma = global.prisma;
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
  role: Role;
  posts: Post[];
  comments: Comment[];
  files: File[];
  ownedProjects: Project[];
  collaboratedProjects: Project[];
  followedBy: User[];
  following: User[];
  bookmarks: Bookmark[];
  commentReactions: CommentReaction[];
  fileReactions: FileReaction[];
  notifications: Notification[];
  activities: Activity[];
  createdAt: Date;
  updatedAt: Date;
  profile?: Profile | null;
  settings?: UserSettings | null;
  badges: Badge[];
  spaces: Space[];
  collaboratedSpaces: Space[];
  viewedSpaces: SpaceView[];
  tutorials: Tutorial[];
  collaboratedTutorials: Tutorial[];
};

export type UserSettings = {
  id: string;
  user: User;
  userId: string;
  notificationPreferences?: NotificationPreferences | null;
  privacySettings?: PrivacySettings | null;
  languagePreference?: string | null;
  themePreference?: ThemePreference | null;
  emailVerified: boolean;
  passwordResetSettings?: PasswordResetSettings | null;
  accountDeletionSettings?: AccountDeletionSettings | null;
};

export type NotificationPreferences = {
  id: string;
  userSettings: UserSettings;
  userSettingsId: string;
  email: boolean;
  push: boolean;
  inApp: boolean;
};

export type PrivacySettings = {
  id: string;
  userSettings: UserSettings;
  userSettingsId: string;
  profileVisibility: Visibility;
  activityVisibility: Visibility;
};

export type PasswordResetSettings = {
  id: string;
  userSettings: UserSettings;
  userSettingsId: string;
  // Add fields related to password reset settings
};

export type AccountDeletionSettings = {
  id: string;
  userSettings: UserSettings;
  userSettingsId: string;
  // Add fields related to account deletion settings
};

export type Profile = {
  id: string;
  user: User;
  userId: string;
  bio?: string | null;
  location?: string | null;
  website?: string | null;
  socialLinks: SocialLink[];
  skills: Skill[];
  createdAt: Date;
  updatedAt: Date;
};

export type SocialLink = {
  id: string;
  profile: Profile;
  profileId: string;
  platform: string;
  url: string;
  createdAt: Date;
  updatedAt: Date;
};

export type Skill = {
  id: string;
  profile: Profile;
  profileId: string;
  name: string;
  createdAt: Date;
  updatedAt: Date;
};

export type Post = {
  id: string;
  title: string;
  type: "post";
  content: string;
  author: User;
  authorId: string;
  tags: Tag[];
  comments: Comment[];
  likes: number;
  views: number;
  isFeatured: boolean;
  isPinned: boolean;
  isPublished: boolean;
  publishedAt?: Date | null;
  createdAt: Date;
  updatedAt: Date;
  bookmarks: Bookmark[];
  settings?: PostSettings | null;
};

export type PostSettings = {
  id: string;
  post: Post;
  postId: string;
  defaultVisibility: Visibility;
  commentSettings?: CommentSettings | null;
  sharingSettings?: SharingSettings | null;
  revisionHistorySettings?: RevisionHistorySettings | null;
};

export type CommentSettings = {
  id: string;
  postSettings: PostSettings;
  postSettingsId: string;
  allowComments: boolean;
  moderateComments: boolean;
  comment: Comment;
  commentId: string;
  moderationSettings?: ModerationSettings | null;
  notificationSettings?: NotificationSettings | null;
  threadingSettings?: ThreadingSettings | null;
  votingSettings?: VotingSettings | null;
};

export type SharingSettings = {
  id: string;
  postSettings: PostSettings;
  postSettingsId: string;
  allowSharing: boolean;
  sharePlatforms: SharePlatform[];
};

export type RevisionHistorySettings = {
  id: string;
  postSettings: PostSettings;
  postSettingsId: string;
  revisionsToKeep: number;
};

export type Comment = {
  id: string;
  content: string;
  author: User;
  authorId: string;
  post?: Post | null;
  postId?: string | null;
  file?: File | null;
  fileId?: string | null;
  project?: Project | null;
  projectId?: string | null;
  page?: Page | null;
  pageId?: string | null;
  parent?: Comment | null;
  parentId?: string | null;
  tutorial?: Tutorial | null;
  upvotes: number;
  downvotes: number;
  children: Comment[];
  reactions: CommentReaction[];
  createdAt: Date;
  updatedAt: Date;
  settings?: CommentSettings | null;
};

export type ModerationSettings = {
  id: string;
  commentSettings: CommentSettings;
  commentSettingsId: string;
  preModeration: boolean;
  postModeration: boolean;
};

export type NotificationSettings = {
  id: string;
  notification: Notification;
  notificationId: string;
  channels: NotificationChannel[];
  frequency?: NotificationFrequency | null;
  preferences?: any | null;
  templates?: any | null;
  commentSettings: CommentSettings;
  commentSettingsId: string;
  notifyAuthor: boolean;
  notifyCommenters: boolean;
};

export type ThreadingSettings = {
  id: string;
  commentSettings: CommentSettings;
  commentSettingsId: string;
  allowNesting: boolean;
  maxDepth: number;
};

export type VotingSettings = {
  id: string;
  commentSettings: CommentSettings;
  commentSettingsId: string;
  allowVoting: boolean;
  hideThreshold: number;
};

export type CommentReaction = {
  id: string;
  comment: Comment;
  commentId: string;
  user: User;
  userId: string;
  type: ReactionType;
  createdAt: Date;
};

export type File = {
  id: string;
  name: string;
  type: "file";
  contentType: string;
  content: string; // This only exists in the response from the server
  url: string;
  description?: string | null;
  isPublic: boolean;
  project?: Project | null;
  projectId?: string | null;
  uploadedBy: User;
  uploadedById: string;
  tags: Tag[];
  comments: Comment[];
  parent?: File | null;
  parentId?: string | null;
  children: File[];
  reactions: FileReaction[];
  createdAt: Date;
  updatedAt: Date;
  bookmarks: Bookmark[];
  settings?: FileSettings | null;
};

export type FileSettings = {
  id: string;
  file: File;
  fileId: string;
  uploadLimits?: UploadLimits | null;
  downloadSettings?: DownloadSettings | null;
  expirationSettings?: ExpirationSettings | null;
  versioningSettings?: VersioningSettings | null;
  metadataSettings?: MetadataSettings | null;
};

export type UploadLimits = {
  id: string;
  fileSettings: FileSettings;
  fileSettingsId: string;
  maxFileSize: number;
  allowedFileTypes: string[];
};

export type DownloadSettings = {
  id: string;
  fileSettings: FileSettings;
  fileSettingsId: string;
  requireLogin: boolean;
  allowPublicDownload: boolean;
};

export type ExpirationSettings = {
  id: string;
  fileSettings: FileSettings;
  fileSettingsId: string;
  autoDelete: boolean;
  expirationPeriod: number;
};

export type VersioningSettings = {
  id: string;
  fileSettings: FileSettings;
  fileSettingsId: string;
  keepVersions: boolean;
  // Add fields related to versioning settings
};

export type MetadataSettings = {
  id: string;
  fileSettings: FileSettings;
  fileSettingsId: string;
  allowCustomMetadata: boolean;
  // Add fields related to metadata settings
};

export type FileReaction = {
  id: string;
  file: File;
  fileId: string;
  user: User;
  userId: string;
  type: ReactionType;
  createdAt: Date;
};

export type Project = {
  id: string;
  name: string;
  type: "project";
  description: string;
  owner: User;
  ownerId: string;
  collaborators: User[];
  files: File[];
  tags: Tag[];
  comments: Comment[];
  spaces: Space[];
  createdAt: Date;
  updatedAt: Date;
  bookmarks: Bookmark[];
  settings?: ProjectSettings | null;
};

export type ProjectSettings = {
  id: string;
  project: Project;
  projectId: string;
  visibilitySettings?: VisibilitySettings | null;
  collaborationSettings?: CollaborationSettings | null;
  notificationSettings?: ProjectNotificationSettings | null;
};

export type VisibilitySettings = {
  id: string;
  projectSettings: ProjectSettings;
  projectSettingsId: string;
  visibility: Visibility;
};

export type CollaborationSettings = {
  id: string;
  projectSettings: ProjectSettings;
  projectSettingsId: string;
  allowCollaborators: boolean;
  collaboratorRoles: CollaboratorRole[];
};

export type ProjectNotificationSettings = {
  id: string;
  projectSettings: ProjectSettings;
  projectSettingsId: string;
  notifyOnActivity: boolean;
  notifyOnMentions: boolean;
};

export type Tag = {
  id: string;
  name: string;
  posts: Post[];
  files: File[];
  projects: Project[];
  tutorials: Tutorial[];
  createdAt: Date;
  updatedAt: Date;
};

export type Badge = {
  id: string;
  name: string;
  description: string;
  icon: string;
  users: User[];
  createdAt: Date;
  updatedAt: Date;
};

export type Space = {
  id: string;
  name: string;
  type: "space";
  description?: string | null;
  owner: User;
  ownerId: string;
  collaborators: User[];
  pages: Page[];
  project?: Project | null;
  projectId?: string | null;
  views: SpaceView[];
  createdAt: Date;
  updatedAt: Date;
  bookmarks: Bookmark[];
  settings?: SpaceSettings | null;
};

export type SpaceSettings = {
  id: string;
  space: Space;
  spaceId: string;
  accessControlSettings?: AccessControlSettings | null;
  collaborationSettings?: SpaceCollaborationSettings | null;
  versionControlSettings?: VersionControlSettings | null;
  exportSettings?: ExportSettings | null;
  backupSettings?: BackupSettings | null;
};

export type AccessControlSettings = {
  id: string;
  spaceSettings: SpaceSettings;
  spaceSettingsId: string;
  visibility: Visibility;
  password?: string | null;
};

export type SpaceCollaborationSettings = {
  id: string;
  spaceSettings: SpaceSettings;
  spaceSettingsId: string;
  allowCollaborators: boolean;
  collaboratorRoles: CollaboratorRole[];
};

export type VersionControlSettings = {
  id: string;
  spaceSettings: SpaceSettings;
  spaceSettingsId: string;
  enableVersioning: boolean;
  versionNamingConvention: string;
};

export type ExportSettings = {
  id: string;
  spaceSettings: SpaceSettings;
  spaceSettingsId: string;
  allowExport: boolean;
  exportFormats: ExportFormat[];
};

export type BackupSettings = {
  id: string;
  spaceSettings: SpaceSettings;
  spaceSettingsId: string;
  enableAutoBackup: boolean;
  backupFrequency: BackupFrequency;
};

export type Page = {
  id: string;
  title: string;
  content: string;
  space: Space;
  spaceId: string;
  comments: Comment[];
  createdAt: Date;
  updatedAt: Date;
  version: number;
  bookmarks: Bookmark[];
  settings?: PageSettings | null;
};

export type PageSettings = {
  id: string;
  page: Page;
  pageId: string;
  seoSettings?: SeoSettings | null;
  revisionHistorySettings?: PageRevisionHistorySettings | null;
  commentingSettings?: PageCommentingSettings | null;
};

export type SeoSettings = {
  id: string;
  pageSettings: PageSettings;
  pageSettingsId: string;
  metaTitle?: string | null;
  metaDescription?: string | null;
  openGraphTags?: any | null;
};

export type PageRevisionHistorySettings = {
  id: string;
  pageSettings: PageSettings;
  pageSettingsId: string;
  revisionsToKeep: number;
};

export type PageCommentingSettings = {
  id: string;
  pageSettings: PageSettings;
  pageSettingsId: string;
  allowComments: boolean;
  moderateComments: boolean;
};

export type SpaceView = {
  id: string;
  space: Space;
  spaceId: string;
  user: User;
  userId: string;
  createdAt: Date;
};

export type Tutorial = {
  id: string;
  title: string;
  content: string;
  author: User;
  authorId: string;
  collaborators: User[];
  tags: Tag[];
  comments: Comment[];
  likes: number;
  views: number;
  isFeatured: boolean;
  isPinned: boolean;
  isPublished: boolean;
  publishedAt?: Date | null;
  createdAt: Date;
  updatedAt: Date;
  bookmarks: Bookmark[];
  settings?: TutorialSettings | null;
};

export type TutorialSettings = {
  id: string;
  tutorial: Tutorial;
  tutorialId: string;
  difficultyLevel?: DifficultyLevel | null;
  prerequisites: Prerequisite[];
};

export type Prerequisite = {
  id: string;
  tutorialSettings: TutorialSettings;
  tutorialSettingsId: string;
  requiredKnowledge: string;
  requiredTutorial?: Tutorial | null;
  requiredTutorialId?: string | null;
};

export type Notification = {
  id: string;
  user: User;
  userId: string;
  message: string;
  link?: string | null;
  isRead: boolean;
  isHidden: boolean;
  createdAt: Date;
  updatedAt: Date;
  settings?: NotificationSettings;
};

export type Activity = {
  id: string;
  user: User;
  userId: string;
  activityType: ActivityType;
  entityId: string;
  entityType: EntityType;
  createdAt: Date;
  metadata?: any | null;
};

export type Bookmark = {
  id: string;
  user: User;
  userId: string;
  post?: Post | null;
  postId?: string | null;
  file?: File | null;
  fileId?: string | null;
  project?: Project | null;
  projectId?: string | null;
  space?: Space | null;
  spaceId?: string | null;
  page?: Page | null;
  pageId?: string | null;
  tutorial?: Tutorial | null;
  tutorialId?: string | null;
  createdAt: Date;
};

export type AdminSettings = {
  id: number;
  siteTitle: string;
  siteDescription: string;
  logo: string;
  accentColor: string;
  fileStorageProvider: string;
  s3AccessKey: string | null;
  s3SecretKey: string | null;
  s3BucketName: string | null;
  s3Region: string | null;
  ftpHost: string | null;
  ftpUser: string | null;
  ftpPassword: string | null;
  ftpDirectory: string | null;
  maxFileSize: number;
  allowedFileTypes: string[];
  emailDigestSubject: string;
  emailSignature: string;
  requireEmailVerification: boolean;
  requireAccountApproval: boolean;
  enableUserRegistration: boolean;
  requireLoginToDownload: boolean;
  autoDeleteFiles: boolean;
  fileExpirationPeriod: number;
  enableVersioning: boolean;
  emailProvider: string;
  smtpHost: string;
  smtpPort: number;
  smtpSecure: boolean;
  smtpAuthUser: string;
  smtpAuthPass: string;
  sesRegion: string;
  sesAccessKey: string;
  sesSecretAccessKey: string;
  emailFrom: string;
};

export type Plugin = {
  id: number;
  name: string;
  description: string;
  version: string;
};

export type Image = {
  id: number;
  fileName: string;
  url: string;
  contentType: string;
  data: Buffer;
  createdAt: Date;
  updatedAt: Date;
}

export enum Role {
  ADMIN = 'ADMIN',
  USER = 'USER',
}

export enum ReactionType {
  LIKE = 'LIKE',
  LOVE = 'LOVE',
  HAHA = 'HAHA',
  WOW = 'WOW',
  SAD = 'SAD',
  ANGRY = 'ANGRY',
}

export enum ActivityType {
  POST_CREATED = 'POST_CREATED',
  POST_UPDATED = 'POST_UPDATED',
  POST_DELETED = 'POST_DELETED',
  POST_PUBLISHED = 'POST_PUBLISHED',
  POST_UNPUBLISHED = 'POST_UNPUBLISHED',
  POST_FEATURED = 'POST_FEATURED',
  POST_UNFEATURED = 'POST_UNFEATURED',
  POST_PINNED = 'POST_PINNED',
  POST_UNPINNED = 'POST_UNPINNED',
  POST_LIKED = 'POST_LIKED',
  POST_UNLIKED = 'POST_UNLIKED',
  POST_VIEWED = 'POST_VIEWED',
  POST_COMMENTED = 'POST_COMMENTED',
  POST_COMMENT_UPDATED = 'POST_COMMENT_UPDATED',
  POST_COMMENT_DELETED = 'POST_COMMENT_DELETED',
  POST_TAGGED = 'POST_TAGGED',
  POST_UNTAGGED = 'POST_UNTAGGED',
  POST_BOOKMARKED = 'POST_BOOKMARKED',
  POST_UNBOOKMARKED = 'POST_UNBOOKMARKED',
  COMMENT_CREATED = 'COMMENT_CREATED',
  COMMENT_UPDATED = 'COMMENT_UPDATED',
  COMMENT_DELETED = 'COMMENT_DELETED',
  COMMENT_LIKED = 'COMMENT_LIKED',
  COMMENT_UNLIKED = 'COMMENT_UNLIKED',
  COMMENT_REACTED = 'COMMENT_REACTED',
  COMMENT_REACTION_REMOVED = 'COMMENT_REACTION_REMOVED',
  FILE_UPLOADED = 'FILE_UPLOADED',
  FILE_UPDATED = 'FILE_UPDATED',
  FILE_DELETED = 'FILE_DELETED',
  FILE_DOWNLOADED = 'FILE_DOWNLOADED',
  FILE_LIKED = 'FILE_LIKED',
  FILE_UNLIKED = 'FILE_UNLIKED',
  FILE_REACTED = 'FILE_REACTED',
  FILE_REACTION_REMOVED = 'FILE_REACTION_REMOVED',
  FILE_COMMENTED = 'FILE_COMMENTED',
  FILE_COMMENT_UPDATED = 'FILE_COMMENT_UPDATED',
  FILE_COMMENT_DELETED = 'FILE_COMMENT_DELETED',
  FILE_TAGGED = 'FILE_TAGGED',
  FILE_UNTAGGED = 'FILE_UNTAGGED',
  FILE_BOOKMARKED = 'FILE_BOOKMARKED',
  FILE_UNBOOKMARKED = 'FILE_UNBOOKMARKED',
  PROJECT_CREATED = 'PROJECT_CREATED',
  PROJECT_UPDATED = 'PROJECT_UPDATED',
  PROJECT_DELETED = 'PROJECT_DELETED',
  PROJECT_TAGGED = 'PROJECT_TAGGED',
  PROJECT_UNTAGGED = 'PROJECT_UNTAGGED',
  PROJECT_BOOKMARKED = 'PROJECT_BOOKMARKED',
  PROJECT_UNBOOKMARKED = 'PROJECT_UNBOOKMARKED',
  PROJECT_COLLABORATOR_ADDED = 'PROJECT_COLLABORATOR_ADDED',
  PROJECT_COLLABORATOR_REMOVED = 'PROJECT_COLLABORATOR_REMOVED',
  SPACE_CREATED = 'SPACE_CREATED',
  SPACE_UPDATED = 'SPACE_UPDATED',
  SPACE_DELETED = 'SPACE_DELETED',
  SPACE_VIEWED = 'SPACE_VIEWED',
  SPACE_BOOKMARKED = 'SPACE_BOOKMARKED',
  SPACE_UNBOOKMARKED = 'SPACE_UNBOOKMARKED',
  SPACE_COLLABORATOR_ADDED = 'SPACE_COLLABORATOR_ADDED',
  SPACE_COLLABORATOR_REMOVED = 'SPACE_COLLABORATOR_REMOVED',
  PAGE_CREATED = 'PAGE_CREATED',
  PAGE_UPDATED = 'PAGE_UPDATED',
  PAGE_DELETED = 'PAGE_DELETED',
  PAGE_VIEWED = 'PAGE_VIEWED',
  PAGE_VERSIONED = 'PAGE_VERSIONED',
  PAGE_REVERTED = 'PAGE_REVERTED',
  PAGE_BOOKMARKED = 'PAGE_BOOKMARKED',
  PAGE_UNBOOKMARKED = 'PAGE_UNBOOKMARKED',
  PAGE_COMMENTED = 'PAGE_COMMENTED',
  PAGE_COMMENT_UPDATED = 'PAGE_COMMENT_UPDATED',
  PAGE_COMMENT_DELETED = 'PAGE_COMMENT_DELETED',
  TUTORIAL_CREATED = 'TUTORIAL_CREATED',
  TUTORIAL_UPDATED = 'TUTORIAL_UPDATED',
  TUTORIAL_DELETED = 'TUTORIAL_DELETED',
  TUTORIAL_PUBLISHED = 'TUTORIAL_PUBLISHED',
  TUTORIAL_UNPUBLISHED = 'TUTORIAL_UNPUBLISHED',
  TUTORIAL_FEATURED = 'TUTORIAL_FEATURED',
  TUTORIAL_UNFEATURED = 'TUTORIAL_UNFEATURED',
  TUTORIAL_PINNED = 'TUTORIAL_PINNED',
  TUTORIAL_UNPINNED = 'TUTORIAL_UNPINNED',
  TUTORIAL_LIKED = 'TUTORIAL_LIKED',
  TUTORIAL_UNLIKED = 'TUTORIAL_UNLIKED',
  TUTORIAL_VIEWED = 'TUTORIAL_VIEWED',
  TUTORIAL_BOOKMARKED = 'TUTORIAL_BOOKMARKED',
  TUTORIAL_UNBOOKMARKED = 'TUTORIAL_UNBOOKMARKED',
  TUTORIAL_COLLABORATOR_ADDED = 'TUTORIAL_COLLABORATOR_ADDED',
  TUTORIAL_COLLABORATOR_REMOVED = 'TUTORIAL_COLLABORATOR_REMOVED',
  USER_REGISTERED = 'USER_REGISTERED',
  USER_UPDATED = 'USER_UPDATED',
  USER_DELETED = 'USER_DELETED',
  USER_BLOCKED = 'USER_BLOCKED',
  USER_UNBLOCKED = 'USER_UNBLOCKED',
  USER_FOLLOWED = 'USER_FOLLOWED',
  USER_UNFOLLOWED = 'USER_UNFOLLOWED',
  USER_ROLE_CHANGED = 'USER_ROLE_CHANGED',
  ADMIN_USER_CREATED = 'ADMIN_USER_CREATED',
  ADMIN_USER_UPDATED = 'ADMIN_USER_UPDATED',
  ADMIN_USER_DELETED = 'ADMIN_USER_DELETED',
  ADMIN_USER_BLOCKED = 'ADMIN_USER_BLOCKED',
  ADMIN_USER_UNBLOCKED = 'ADMIN_USER_UNBLOCKED',
  ADMIN_USER_ROLE_CHANGED = 'ADMIN_USER_ROLE_CHANGED',
  ADMIN_POST_CREATED = 'ADMIN_POST_CREATED',
  ADMIN_POST_UPDATED = 'ADMIN_POST_UPDATED',
  ADMIN_POST_DELETED = 'ADMIN_POST_DELETED',
  ADMIN_POST_PUBLISHED = 'ADMIN_POST_PUBLISHED',
  ADMIN_POST_UNPUBLISHED = 'ADMIN_POST_UNPUBLISHED',
  ADMIN_POST_FEATURED = 'ADMIN_POST_FEATURED',
  ADMIN_POST_UNFEATURED = 'ADMIN_POST_UNFEATURED',
  ADMIN_POST_PINNED = 'ADMIN_POST_PINNED',
  ADMIN_POST_UNPINNED = 'ADMIN_POST_UNPINNED',
  ADMIN_COMMENT_CREATED = 'ADMIN_COMMENT_CREATED',
  ADMIN_COMMENT_UPDATED = 'ADMIN_COMMENT_UPDATED',
  ADMIN_COMMENT_DELETED = 'ADMIN_COMMENT_DELETED',
  ADMIN_FILE_UPLOADED = 'ADMIN_FILE_UPLOADED',
  ADMIN_FILE_UPDATED = 'ADMIN_FILE_UPDATED',
  ADMIN_FILE_DELETED = 'ADMIN_FILE_DELETED',
  ADMIN_PROJECT_CREATED = 'ADMIN_PROJECT_CREATED',
  ADMIN_PROJECT_UPDATED = 'ADMIN_PROJECT_UPDATED',
  ADMIN_PROJECT_DELETED = 'ADMIN_PROJECT_DELETED',
  ADMIN_SPACE_CREATED = 'ADMIN_SPACE_CREATED',
  ADMIN_SPACE_UPDATED = 'ADMIN_SPACE_UPDATED',
  ADMIN_SPACE_DELETED = 'ADMIN_SPACE_DELETED',
  ADMIN_PAGE_CREATED = 'ADMIN_PAGE_CREATED',
  ADMIN_PAGE_UPDATED = 'ADMIN_PAGE_UPDATED',
  ADMIN_PAGE_DELETED = 'ADMIN_PAGE_DELETED',
  ADMIN_TUTORIAL_CREATED = 'ADMIN_TUTORIAL_CREATED',
  ADMIN_TUTORIAL_UPDATED = 'ADMIN_TUTORIAL_UPDATED',
  ADMIN_TUTORIAL_DELETED = 'ADMIN_TUTORIAL_DELETED',
  ADMIN_TUTORIAL_PUBLISHED = 'ADMIN_TUTORIAL_PUBLISHED',
  ADMIN_TUTORIAL_UNPUBLISHED = 'ADMIN_TUTORIAL_UNPUBLISHED',
  ADMIN_TUTORIAL_FEATURED = 'ADMIN_TUTORIAL_FEATURED',
  ADMIN_TUTORIAL_UNFEATURED = 'ADMIN_TUTORIAL_UNFEATURED',
  ADMIN_TUTORIAL_PINNED = 'ADMIN_TUTORIAL_PINNED',
  ADMIN_TUTORIAL_UNPINNED = 'ADMIN_TUTORIAL_UNPINNED',
  ADMIN_SETTINGS_UPDATED = 'ADMIN_SETTINGS_UPDATED',
}

export enum EntityType {
  POST = 'POST',
  COMMENT = 'COMMENT',
  FILE = 'FILE',
  PROJECT = 'PROJECT',
  SPACE = 'SPACE',
  PAGE = 'PAGE',
  TUTORIAL = 'TUTORIAL',
}

export enum Visibility {
  PUBLIC = 'PUBLIC',
  PRIVATE = 'PRIVATE',
}

export enum ThemePreference {
  LIGHT = 'LIGHT',
  DARK = 'DARK',
}
export enum SharePlatform {
  FACEBOOK = 'FACEBOOK',
  TWITTER = 'TWITTER',
  LINKEDIN = 'LINKEDIN',
}
export enum CollaboratorRole {
  VIEWER = 'VIEWER',
  EDITOR = 'EDITOR',
  ADMIN = 'ADMIN',
}

export enum ExportFormat {
  PDF = 'PDF',
  MARKDOWN = 'MARKDOWN',
  HTML = 'HTML',
}

export enum BackupFrequency {
  DAILY = 'DAILY',
  WEEKLY = 'WEEKLY',
  MONTHLY = 'MONTHLY',
}

export enum DifficultyLevel {
  BEGINNER = 'BEGINNER',
  INTERMEDIATE = 'INTERMEDIATE',
  ADVANCED = 'ADVANCED',
}

export enum NotificationChannel {
  EMAIL = 'EMAIL',
  PUSH = 'PUSH',
  IN_APP = 'IN_APP',
}

export enum NotificationFrequency {
  REAL_TIME = 'REAL_TIME',
  DAILY_DIGEST = 'DAILY_DIGEST',
  WEEKLY_DIGEST = 'WEEKLY_DIGEST',
}

export default prisma;