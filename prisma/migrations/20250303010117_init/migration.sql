-- Enable extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "citext";

-- CreateEnum
CREATE TYPE "navigation_item_type" AS ENUM ('LINK', 'DROPDOWN', 'HEADING', 'DIVIDER');

-- CreateEnum
CREATE TYPE "user_role_enum" AS ENUM ('ADMIN', 'EDITOR', 'MODERATOR', 'USER', 'GUEST');

-- CreateTable
CREATE TABLE "admin_settings" (
    "id" SERIAL NOT NULL,
    "site_title" VARCHAR(255) NOT NULL,
    "site_description" TEXT NOT NULL,
    "logo" TEXT,
    "accent_color" VARCHAR(10) NOT NULL,
    "file_storage_provider" VARCHAR(50) DEFAULT 'local',
    "s3_access_key" VARCHAR(255),
    "s3_secret_key" VARCHAR(255),
    "s3_bucket_name" VARCHAR(255),
    "s3_region" VARCHAR(50),
    "ftp_host" VARCHAR(255),
    "ftp_user" VARCHAR(255),
    "ftp_password" VARCHAR(255),
    "ftp_directory" VARCHAR(255),
    "email_digest_subject" VARCHAR(255),
    "email_signature" TEXT,
    "max_file_size" INTEGER NOT NULL,
    "allowed_file_types" VARCHAR(255)[],
    "require_email_verification" BOOLEAN DEFAULT false,
    "require_account_approval" BOOLEAN DEFAULT false,
    "enable_user_registration" BOOLEAN DEFAULT true,
    "require_login_to_download" BOOLEAN DEFAULT false,
    "auto_delete_files" BOOLEAN DEFAULT false,
    "file_expiration_period" INTEGER DEFAULT 30,
    "enable_versioning" BOOLEAN DEFAULT false,
    "email_provider" VARCHAR(50) NOT NULL,
    "smtp_host" VARCHAR(255),
    "smtp_port" INTEGER,
    "smtp_secure" BOOLEAN,
    "smtp_auth_user" VARCHAR(255),
    "smtp_auth_pass" VARCHAR(255),
    "ses_region" VARCHAR(50),
    "ses_access_key" VARCHAR(255),
    "ses_secret_access_key" VARCHAR(255),
    "email_from" VARCHAR(255),
    "footer_text" TEXT,
    "copyright_text" TEXT,
    "database_type" VARCHAR(50) NOT NULL,
    "database_url" VARCHAR(500) NOT NULL,
    "created_at" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "admin_settings_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "category" (
    "id" UUID NOT NULL DEFAULT uuid_generate_v4(),
    "name" VARCHAR(100) NOT NULL,
    "slug" VARCHAR(150) NOT NULL,
    "description" TEXT,
    "parent_id" UUID,
    "created_at" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "category_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "comment" (
    "id" UUID NOT NULL DEFAULT uuid_generate_v4(),
    "content" TEXT NOT NULL,
    "author_id" UUID NOT NULL,
    "post_id" UUID,
    "parent_id" UUID,
    "is_approved" BOOLEAN DEFAULT true,
    "likes" INTEGER DEFAULT 0,
    "created_at" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "comment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "file" (
    "id" UUID NOT NULL DEFAULT uuid_generate_v4(),
    "name" VARCHAR(255) NOT NULL,
    "description" TEXT,
    "filepath" VARCHAR(500) NOT NULL,
    "mimetype" VARCHAR(100) NOT NULL,
    "size" BIGINT NOT NULL,
    "user_id" UUID,
    "is_public" BOOLEAN DEFAULT false,
    "download_count" INTEGER DEFAULT 0,
    "expiration_date" TIMESTAMPTZ(6),
    "metadata" JSONB DEFAULT '{}',
    "storage_provider" VARCHAR(50) DEFAULT 'local',
    "external_url" VARCHAR(500),
    "created_at" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "file_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "file_settings" (
    "id" SERIAL NOT NULL,
    "max_file_size" INTEGER NOT NULL DEFAULT 10,
    "allowed_file_types" VARCHAR(255)[] DEFAULT ARRAY['.jpg', '.png', '.pdf', '.doc', '.docx']::VARCHAR(255)[],
    "storage_provider" VARCHAR(50) DEFAULT 'local',
    "require_login_to_download" BOOLEAN DEFAULT false,
    "created_at" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "file_settings_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "file_tags" (
    "file_id" UUID NOT NULL,
    "tag_id" UUID NOT NULL,
    "created_at" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "file_tags_pkey" PRIMARY KEY ("file_id","tag_id")
);

-- CreateTable
CREATE TABLE "module_config" (
    "id" UUID NOT NULL DEFAULT uuid_generate_v4(),
    "name" VARCHAR(100) NOT NULL,
    "slug" VARCHAR(100) NOT NULL,
    "description" TEXT,
    "is_enabled" BOOLEAN DEFAULT true,
    "icon" VARCHAR(50),
    "admin_route" VARCHAR(255),
    "display_order" INTEGER DEFAULT 0,
    "settings" JSONB DEFAULT '{}',
    "permissions" JSONB DEFAULT '{}',
    "required_role" VARCHAR(50),
    "created_at" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "module_config_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "navigation_item" (
    "id" UUID NOT NULL DEFAULT uuid_generate_v4(),
    "title" VARCHAR(100) NOT NULL,
    "url" VARCHAR(500),
    "icon" VARCHAR(50),
    "item_type" "navigation_item_type" DEFAULT 'LINK',
    "order" INTEGER DEFAULT 0,
    "parent_id" UUID,
    "menu_id" UUID NOT NULL,
    "target_module" VARCHAR(100),
    "is_enabled" BOOLEAN DEFAULT true,
    "open_in_new_tab" BOOLEAN DEFAULT false,
    "requires_auth" BOOLEAN DEFAULT false,
    "created_at" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "navigation_item_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "navigation_menu" (
    "id" UUID NOT NULL DEFAULT uuid_generate_v4(),
    "name" VARCHAR(100) NOT NULL,
    "description" TEXT,
    "location" VARCHAR(100) NOT NULL,
    "created_at" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "navigation_menu_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "post" (
    "id" UUID NOT NULL DEFAULT uuid_generate_v4(),
    "title" VARCHAR(255) NOT NULL,
    "slug" VARCHAR(300) NOT NULL,
    "content" TEXT NOT NULL,
    "excerpt" TEXT,
    "featured_image" TEXT,
    "author_id" UUID NOT NULL,
    "category_id" UUID,
    "status" VARCHAR(20) DEFAULT 'draft',
    "visibility" VARCHAR(20) DEFAULT 'public',
    "published_at" TIMESTAMPTZ(6),
    "is_featured" BOOLEAN DEFAULT false,
    "allow_comments" BOOLEAN DEFAULT true,
    "views" INTEGER DEFAULT 0,
    "likes" INTEGER DEFAULT 0,
    "settings" JSONB DEFAULT '{}',
    "meta_title" VARCHAR(255),
    "meta_description" TEXT,
    "created_at" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "post_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "post_tags" (
    "post_id" UUID NOT NULL,
    "tag_id" UUID NOT NULL,
    "created_at" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "post_tags_pkey" PRIMARY KEY ("post_id","tag_id")
);

-- CreateTable
CREATE TABLE "project" (
    "id" UUID NOT NULL DEFAULT uuid_generate_v4(),
    "name" VARCHAR(255) NOT NULL,
    "slug" VARCHAR(300) NOT NULL,
    "description" TEXT,
    "readme" TEXT,
    "owner_id" UUID NOT NULL,
    "visibility" VARCHAR(20) DEFAULT 'private',
    "status" VARCHAR(20) DEFAULT 'active',
    "star_count" INTEGER DEFAULT 0,
    "fork_count" INTEGER DEFAULT 0,
    "forked_from_id" UUID,
    "default_branch" VARCHAR(100) DEFAULT 'main',
    "settings" JSONB DEFAULT '{}',
    "created_at" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "project_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "project_tags" (
    "project_id" UUID NOT NULL,
    "tag_id" UUID NOT NULL,
    "created_at" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "project_tags_pkey" PRIMARY KEY ("project_id","tag_id")
);

-- CreateTable
CREATE TABLE "tag" (
    "id" UUID NOT NULL DEFAULT uuid_generate_v4(),
    "name" VARCHAR(100) NOT NULL,
    "created_at" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "tag_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user" (
    "id" UUID NOT NULL DEFAULT uuid_generate_v4(),
    "username" VARCHAR(50) NOT NULL,
    "email" VARCHAR(100) NOT NULL,
    "password_hash" VARCHAR(255) NOT NULL,
    "first_name" VARCHAR(50),
    "last_name" VARCHAR(50),
    "avatar" TEXT,
    "bio" TEXT,
    "job_title" VARCHAR(100),
    "company" VARCHAR(100),
    "website" VARCHAR(255),
    "location" VARCHAR(100),
    "social_links" JSONB DEFAULT '{}',
    "email_verified" BOOLEAN DEFAULT false,
    "is_active" BOOLEAN DEFAULT true,
    "is_deleted" BOOLEAN DEFAULT false,
    "last_login" TIMESTAMPTZ(6),
    "role" "user_role_enum" DEFAULT 'USER',
    "reset_token" VARCHAR(255),
    "reset_token_expires" TIMESTAMPTZ(6),
    "notification_preferences" JSONB DEFAULT '{}',
    "theme_preference" VARCHAR(50) DEFAULT 'system',
    "created_at" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "user_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user_role" (
    "id" UUID NOT NULL DEFAULT uuid_generate_v4(),
    "name" VARCHAR(50) NOT NULL,
    "description" TEXT,
    "permissions" JSONB NOT NULL,
    "created_at" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "user_role_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "category_slug_key" ON "category"("slug");

-- CreateIndex
CREATE INDEX "idx_comment_post_id" ON "comment"("post_id");

-- CreateIndex
CREATE INDEX "idx_file_user_id" ON "file"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "module_config_slug_key" ON "module_config"("slug");

-- CreateIndex
CREATE INDEX "idx_module_config_slug" ON "module_config"("slug");

-- CreateIndex
CREATE INDEX "idx_navigation_item_menu_id" ON "navigation_item"("menu_id");

-- CreateIndex
CREATE UNIQUE INDEX "post_slug_key" ON "post"("slug");

-- CreateIndex
CREATE INDEX "idx_post_author_id" ON "post"("author_id");

-- CreateIndex
CREATE INDEX "idx_post_slug" ON "post"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "project_slug_key" ON "project"("slug");

-- CreateIndex
CREATE INDEX "idx_project_owner_id" ON "project"("owner_id");

-- CreateIndex
CREATE INDEX "idx_project_slug" ON "project"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "tag_name_key" ON "tag"("name");

-- CreateIndex
CREATE UNIQUE INDEX "user_username_key" ON "user"("username");

-- CreateIndex
CREATE UNIQUE INDEX "user_email_key" ON "user"("email");

-- CreateIndex
CREATE UNIQUE INDEX "user_role_name_key" ON "user_role"("name");

-- AddForeignKey
ALTER TABLE "category" ADD CONSTRAINT "category_parent_id_fkey" FOREIGN KEY ("parent_id") REFERENCES "category"("id") ON DELETE SET NULL ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "comment" ADD CONSTRAINT "comment_author_id_fkey" FOREIGN KEY ("author_id") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "comment" ADD CONSTRAINT "comment_parent_id_fkey" FOREIGN KEY ("parent_id") REFERENCES "comment"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "comment" ADD CONSTRAINT "comment_post_id_fkey" FOREIGN KEY ("post_id") REFERENCES "post"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "file" ADD CONSTRAINT "file_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE SET NULL ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "file_tags" ADD CONSTRAINT "file_tags_file_id_fkey" FOREIGN KEY ("file_id") REFERENCES "file"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "file_tags" ADD CONSTRAINT "file_tags_tag_id_fkey" FOREIGN KEY ("tag_id") REFERENCES "tag"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "navigation_item" ADD CONSTRAINT "navigation_item_menu_id_fkey" FOREIGN KEY ("menu_id") REFERENCES "navigation_menu"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "navigation_item" ADD CONSTRAINT "navigation_item_parent_id_fkey" FOREIGN KEY ("parent_id") REFERENCES "navigation_item"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "post" ADD CONSTRAINT "post_author_id_fkey" FOREIGN KEY ("author_id") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "post" ADD CONSTRAINT "post_category_id_fkey" FOREIGN KEY ("category_id") REFERENCES "category"("id") ON DELETE SET NULL ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "post_tags" ADD CONSTRAINT "post_tags_post_id_fkey" FOREIGN KEY ("post_id") REFERENCES "post"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "post_tags" ADD CONSTRAINT "post_tags_tag_id_fkey" FOREIGN KEY ("tag_id") REFERENCES "tag"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "project" ADD CONSTRAINT "project_forked_from_id_fkey" FOREIGN KEY ("forked_from_id") REFERENCES "project"("id") ON DELETE SET NULL ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "project" ADD CONSTRAINT "project_owner_id_fkey" FOREIGN KEY ("owner_id") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "project_tags" ADD CONSTRAINT "project_tags_project_id_fkey" FOREIGN KEY ("project_id") REFERENCES "project"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "project_tags" ADD CONSTRAINT "project_tags_tag_id_fkey" FOREIGN KEY ("tag_id") REFERENCES "tag"("id") ON DELETE CASCADE ON UPDATE NO ACTION;
