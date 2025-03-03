-- PostgreSQL Schema for MCMS
-- This script creates all tables needed for the CMS

-- Create extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "citext";

-- Drop tables if they exist (for clean install)
DROP TABLE IF EXISTS "navigation_item" CASCADE;
DROP TABLE IF EXISTS "navigation_menu" CASCADE;
DROP TABLE IF EXISTS "module_config" CASCADE;
DROP TABLE IF EXISTS "user_role" CASCADE;
DROP TABLE IF EXISTS "file_settings" CASCADE;
DROP TABLE IF EXISTS "download_settings" CASCADE;
DROP TABLE IF EXISTS "expiration_settings" CASCADE;
DROP TABLE IF EXISTS "versioning_settings" CASCADE;
DROP TABLE IF EXISTS "metadata_settings" CASCADE;
DROP TABLE IF EXISTS "admin_settings" CASCADE;
DROP TABLE IF EXISTS "tag" CASCADE;
DROP TABLE IF EXISTS "post" CASCADE;
DROP TABLE IF EXISTS "comment" CASCADE;
DROP TABLE IF EXISTS "file" CASCADE;
DROP TABLE IF EXISTS "project" CASCADE;
DROP TABLE IF EXISTS "user" CASCADE;
DROP TABLE IF EXISTS "category" CASCADE;
DROP TYPE IF EXISTS "user_role_enum" CASCADE;
DROP TYPE IF EXISTS "navigation_item_type" CASCADE;

-- Create ENUM types
CREATE TYPE "user_role_enum" AS ENUM ('ADMIN', 'EDITOR', 'MODERATOR', 'USER', 'GUEST');
CREATE TYPE "navigation_item_type" AS ENUM ('LINK', 'DROPDOWN', 'HEADING', 'DIVIDER');

-- User table
CREATE TABLE "user" (
  "id" UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  "username" VARCHAR(50) UNIQUE NOT NULL,
  "email" VARCHAR(100) UNIQUE NOT NULL,
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
  "email_verified" BOOLEAN DEFAULT FALSE,
  "is_active" BOOLEAN DEFAULT TRUE,
  "is_deleted" BOOLEAN DEFAULT FALSE,
  "last_login" TIMESTAMP WITH TIME ZONE,
  "role" user_role_enum DEFAULT 'USER',
  "reset_token" VARCHAR(255),
  "reset_token_expires" TIMESTAMP WITH TIME ZONE,
  "notification_preferences" JSONB DEFAULT '{}',
  "theme_preference" VARCHAR(50) DEFAULT 'system',
  "created_at" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  "updated_at" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- User Role table
CREATE TABLE "user_role" (
  "id" UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  "name" VARCHAR(50) UNIQUE NOT NULL,
  "description" TEXT,
  "permissions" JSONB NOT NULL,
  "created_at" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  "updated_at" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Category table
CREATE TABLE "category" (
  "id" UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  "name" VARCHAR(100) NOT NULL,
  "slug" VARCHAR(150) UNIQUE NOT NULL,
  "description" TEXT,
  "parent_id" UUID REFERENCES "category" ("id") ON DELETE SET NULL,
  "created_at" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  "updated_at" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Tag table
CREATE TABLE "tag" (
  "id" UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  "name" VARCHAR(100) UNIQUE NOT NULL,
  "created_at" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  "updated_at" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Post table
CREATE TABLE "post" (
  "id" UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  "title" VARCHAR(255) NOT NULL,
  "slug" VARCHAR(300) UNIQUE NOT NULL,
  "content" TEXT NOT NULL,
  "excerpt" TEXT,
  "featured_image" TEXT,
  "author_id" UUID NOT NULL REFERENCES "user" ("id") ON DELETE CASCADE,
  "category_id" UUID REFERENCES "category" ("id") ON DELETE SET NULL,
  "status" VARCHAR(20) DEFAULT 'draft',
  "visibility" VARCHAR(20) DEFAULT 'public',
  "published_at" TIMESTAMP WITH TIME ZONE,
  "is_featured" BOOLEAN DEFAULT FALSE,
  "allow_comments" BOOLEAN DEFAULT TRUE,
  "views" INTEGER DEFAULT 0,
  "likes" INTEGER DEFAULT 0,
  "settings" JSONB DEFAULT '{}',
  "meta_title" VARCHAR(255),
  "meta_description" TEXT,
  "created_at" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  "updated_at" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Post-Tag relationship table
CREATE TABLE "post_tags" (
  "post_id" UUID REFERENCES "post" ("id") ON DELETE CASCADE,
  "tag_id" UUID REFERENCES "tag" ("id") ON DELETE CASCADE,
  "created_at" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY ("post_id", "tag_id")
);

-- Comment table
CREATE TABLE "comment" (
  "id" UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  "content" TEXT NOT NULL,
  "author_id" UUID NOT NULL REFERENCES "user" ("id") ON DELETE CASCADE,
  "post_id" UUID REFERENCES "post" ("id") ON DELETE CASCADE,
  "parent_id" UUID REFERENCES "comment" ("id") ON DELETE CASCADE,
  "is_approved" BOOLEAN DEFAULT TRUE,
  "likes" INTEGER DEFAULT 0,
  "created_at" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  "updated_at" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- File table
CREATE TABLE "file" (
  "id" UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  "name" VARCHAR(255) NOT NULL,
  "description" TEXT,
  "filepath" VARCHAR(500) NOT NULL,
  "mimetype" VARCHAR(100) NOT NULL,
  "size" BIGINT NOT NULL,
  "user_id" UUID REFERENCES "user" ("id") ON DELETE SET NULL,
  "is_public" BOOLEAN DEFAULT FALSE,
  "download_count" INTEGER DEFAULT 0,
  "expiration_date" TIMESTAMP WITH TIME ZONE,
  "metadata" JSONB DEFAULT '{}',
  "storage_provider" VARCHAR(50) DEFAULT 'local',
  "external_url" VARCHAR(500),
  "created_at" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  "updated_at" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- File-Tag relationship table
CREATE TABLE "file_tags" (
  "file_id" UUID REFERENCES "file" ("id") ON DELETE CASCADE,
  "tag_id" UUID REFERENCES "tag" ("id") ON DELETE CASCADE,
  "created_at" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY ("file_id", "tag_id")
);

-- Project table
CREATE TABLE "project" (
  "id" UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  "name" VARCHAR(255) NOT NULL,
  "slug" VARCHAR(300) UNIQUE NOT NULL,
  "description" TEXT,
  "readme" TEXT,
  "owner_id" UUID NOT NULL REFERENCES "user" ("id") ON DELETE CASCADE,
  "visibility" VARCHAR(20) DEFAULT 'private',
  "status" VARCHAR(20) DEFAULT 'active',
  "star_count" INTEGER DEFAULT 0,
  "fork_count" INTEGER DEFAULT 0,
  "forked_from_id" UUID REFERENCES "project" ("id") ON DELETE SET NULL,
  "default_branch" VARCHAR(100) DEFAULT 'main',
  "settings" JSONB DEFAULT '{}',
  "created_at" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  "updated_at" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Project-Tag relationship table
CREATE TABLE "project_tags" (
  "project_id" UUID REFERENCES "project" ("id") ON DELETE CASCADE,
  "tag_id" UUID REFERENCES "tag" ("id") ON DELETE CASCADE,
  "created_at" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY ("project_id", "tag_id")
);

-- Module Configuration table
CREATE TABLE "module_config" (
  "id" UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  "name" VARCHAR(100) NOT NULL,
  "slug" VARCHAR(100) UNIQUE NOT NULL,
  "description" TEXT,
  "is_enabled" BOOLEAN DEFAULT TRUE,
  "icon" VARCHAR(50),
  "admin_route" VARCHAR(255),
  "display_order" INTEGER DEFAULT 0,
  "settings" JSONB DEFAULT '{}',
  "permissions" JSONB DEFAULT '{}',
  "required_role" VARCHAR(50),
  "created_at" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  "updated_at" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Navigation Menu table
CREATE TABLE "navigation_menu" (
  "id" UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  "name" VARCHAR(100) NOT NULL,
  "description" TEXT,
  "location" VARCHAR(100) NOT NULL,
  "created_at" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  "updated_at" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Navigation Item table
CREATE TABLE "navigation_item" (
  "id" UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  "title" VARCHAR(100) NOT NULL,
  "url" VARCHAR(500),
  "icon" VARCHAR(50),
  "item_type" navigation_item_type DEFAULT 'LINK',
  "order" INTEGER DEFAULT 0,
  "parent_id" UUID REFERENCES "navigation_item" ("id") ON DELETE CASCADE,
  "menu_id" UUID NOT NULL REFERENCES "navigation_menu" ("id") ON DELETE CASCADE,
  "target_module" VARCHAR(100),
  "is_enabled" BOOLEAN DEFAULT TRUE,
  "open_in_new_tab" BOOLEAN DEFAULT FALSE,
  "requires_auth" BOOLEAN DEFAULT FALSE,
  "created_at" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  "updated_at" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Admin Settings table
CREATE TABLE "admin_settings" (
  "id" SERIAL PRIMARY KEY,
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
  "allowed_file_types" VARCHAR(255)[] NOT NULL,
  "require_email_verification" BOOLEAN DEFAULT FALSE,
  "require_account_approval" BOOLEAN DEFAULT FALSE,
  "enable_user_registration" BOOLEAN DEFAULT TRUE,
  "require_login_to_download" BOOLEAN DEFAULT FALSE,
  "auto_delete_files" BOOLEAN DEFAULT FALSE,
  "file_expiration_period" INTEGER DEFAULT 30,
  "enable_versioning" BOOLEAN DEFAULT FALSE,
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
  "created_at" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  "updated_at" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- File Settings table
CREATE TABLE "file_settings" (
  "id" SERIAL PRIMARY KEY,
  "max_file_size" INTEGER NOT NULL DEFAULT 10,
  "allowed_file_types" VARCHAR(255)[] DEFAULT ARRAY['.jpg', '.png', '.pdf', '.doc', '.docx'],
  "storage_provider" VARCHAR(50) DEFAULT 'local',
  "require_login_to_download" BOOLEAN DEFAULT FALSE,
  "created_at" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  "updated_at" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for performance
CREATE INDEX "idx_post_author_id" ON "post" ("author_id");
CREATE INDEX "idx_post_slug" ON "post" ("slug");
CREATE INDEX "idx_comment_post_id" ON "comment" ("post_id");
CREATE INDEX "idx_file_user_id" ON "file" ("user_id");
CREATE INDEX "idx_project_owner_id" ON "project" ("owner_id");
CREATE INDEX "idx_project_slug" ON "project" ("slug");
CREATE INDEX "idx_navigation_item_menu_id" ON "navigation_item" ("menu_id");
CREATE INDEX "idx_module_config_slug" ON "module_config" ("slug");

-- Add Full-Text Search indexes
CREATE INDEX "idx_post_fts" ON "post" USING gin(to_tsvector('english', "title" || ' ' || "content"));
CREATE INDEX "idx_project_fts" ON "project" USING gin(to_tsvector('english', "name" || ' ' || "description"));
CREATE INDEX "idx_file_fts" ON "file" USING gin(to_tsvector('english', "name" || ' ' || COALESCE("description", '')));

-- Default admin settings
INSERT INTO "admin_settings" (
  "site_title", 
  "site_description", 
  "logo", 
  "accent_color", 
  "max_file_size", 
  "allowed_file_types", 
  "email_provider", 
  "database_type", 
  "database_url"
) VALUES (
  'MCMS', 
  'Modern Content Management System', 
  '', 
  '#3B82F6', 
  50, 
  ARRAY['.jpg', '.jpeg', '.png', '.gif', '.pdf', '.doc', '.docx', '.xls', '.xlsx', '.zip'], 
  'smtp', 
  'postgresql', 
  'postgres://user:password@localhost:5432/mcms'
);

-- Default user roles
INSERT INTO "user_role" ("id", "name", "description", "permissions") VALUES
(uuid_generate_v4(), 'ADMIN', 'Administrator with full access', '{"all": ["*"]}'),
(uuid_generate_v4(), 'EDITOR', 'Can create and edit content', '{"content": ["create", "read", "update"], "users": ["read"], "settings": ["read"]}'),
(uuid_generate_v4(), 'MODERATOR', 'Can moderate user content', '{"content": ["read", "update"], "comments": ["read", "update", "delete"], "users": ["read"]}'),
(uuid_generate_v4(), 'USER', 'Regular user', '{"content": ["read"], "comments": ["create", "read"]}'),
(uuid_generate_v4(), 'GUEST', 'Unauthenticated user', '{"content": ["read"]}');

-- Set up foreign key constraints with proper cascade behavior
ALTER TABLE "user" ADD CONSTRAINT "fk_user_role" FOREIGN KEY ("role") REFERENCES "user_role" ("name") ON DELETE SET NULL;

-- Set up triggers for updating the updated_at timestamp
CREATE OR REPLACE FUNCTION update_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = CURRENT_TIMESTAMP;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create update triggers for all tables with updated_at
CREATE TRIGGER trigger_user_update BEFORE UPDATE ON "user" FOR EACH ROW EXECUTE FUNCTION update_timestamp();
CREATE TRIGGER trigger_post_update BEFORE UPDATE ON "post" FOR EACH ROW EXECUTE FUNCTION update_timestamp();
CREATE TRIGGER trigger_category_update BEFORE UPDATE ON "category" FOR EACH ROW EXECUTE FUNCTION update_timestamp();
CREATE TRIGGER trigger_tag_update BEFORE UPDATE ON "tag" FOR EACH ROW EXECUTE FUNCTION update_timestamp();
CREATE TRIGGER trigger_comment_update BEFORE UPDATE ON "comment" FOR EACH ROW EXECUTE FUNCTION update_timestamp();
CREATE TRIGGER trigger_file_update BEFORE UPDATE ON "file" FOR EACH ROW EXECUTE FUNCTION update_timestamp();
CREATE TRIGGER trigger_project_update BEFORE UPDATE ON "project" FOR EACH ROW EXECUTE FUNCTION update_timestamp();
CREATE TRIGGER trigger_module_config_update BEFORE UPDATE ON "module_config" FOR EACH ROW EXECUTE FUNCTION update_timestamp();
CREATE TRIGGER trigger_navigation_menu_update BEFORE UPDATE ON "navigation_menu" FOR EACH ROW EXECUTE FUNCTION update_timestamp();
CREATE TRIGGER trigger_navigation_item_update BEFORE UPDATE ON "navigation_item" FOR EACH ROW EXECUTE FUNCTION update_timestamp();
CREATE TRIGGER trigger_admin_settings_update BEFORE UPDATE ON "admin_settings" FOR EACH ROW EXECUTE FUNCTION update_timestamp();
CREATE TRIGGER trigger_file_settings_update BEFORE UPDATE ON "file_settings" FOR EACH ROW EXECUTE FUNCTION update_timestamp();
CREATE TRIGGER trigger_user_role_update BEFORE UPDATE ON "user_role" FOR EACH ROW EXECUTE FUNCTION update_timestamp();
