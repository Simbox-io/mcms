#!/bin/bash
set -e

# Wait for PostgreSQL to be ready
echo "⏳ Waiting for PostgreSQL to be ready..."
while ! nc -z postgres 5432; do
  sleep 0.1
done
echo "✅ PostgreSQL is ready!"

# Install missing dependencies
echo "📦 Installing missing dependencies..."
npm install bcryptjs

# Create PostgreSQL extensions and initialize schema
echo "🔧 Creating PostgreSQL extensions..."
psql -h postgres -U postgres -d mcms_db -c "CREATE EXTENSION IF NOT EXISTS \"uuid-ossp\";" || {
  # If database doesn't exist yet, create it first
  psql -h postgres -U postgres -c "CREATE DATABASE mcms_db;" || true
  psql -h postgres -U postgres -d mcms_db -c "CREATE EXTENSION IF NOT EXISTS \"uuid-ossp\";"
  psql -h postgres -U postgres -d mcms_db -c "CREATE EXTENSION IF NOT EXISTS \"citext\";"
}
echo "✅ PostgreSQL extensions created!"

# Initialize schema with required enum types
echo "🔧 Initializing schema types..."
psql -h postgres -U postgres -d mcms_db -f ./scripts/schema-init.sql
echo "✅ Schema types initialized!"

# Run database migrations
echo "🔄 Running database migrations..."
npx prisma migrate deploy

# Generate Prisma client
echo "🔧 Generating Prisma client..."
npx prisma generate

# Run schema fixes to ensure all tables exist with proper columns
echo "🔧 Running schema fixes..."
node ./scripts/fix-schema.js

# Seed database with initial data
echo "🌱 Seeding database..."
node ./scripts/seed.cjs

echo "🚀 Starting application..."
npm run dev