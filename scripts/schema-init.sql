-- Create enum types
DO $$
BEGIN
  -- Create Role enum if it doesn't exist
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'role') THEN
    CREATE TYPE "public"."Role" AS ENUM ('ADMIN', 'USER', 'EDITOR', 'STUDENT');
  END IF;
  
  -- Create SchoolRole enum if it doesn't exist
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'schoolrole') THEN
    CREATE TYPE "public"."SchoolRole" AS ENUM ('TEACHER', 'STUDENT', 'STAFF');
  END IF;
  
  -- Create other enums from your schema
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'navigation_item_type') THEN
    CREATE TYPE "navigation_item_type" AS ENUM ('LINK', 'DROPDOWN', 'HEADING', 'DIVIDER');
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'user_role_enum') THEN
    CREATE TYPE "user_role_enum" AS ENUM ('ADMIN', 'EDITOR', 'MODERATOR', 'USER', 'GUEST');
  END IF;
END
$$; 