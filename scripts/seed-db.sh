#!/bin/bash

# Script to seed the database directly

echo "🧪 Starting database seeding..."

# Check if database is available
if [[ -z "${DATABASE_URL}" ]]; then
  echo "ℹ️ No DATABASE_URL found, using default localhost PostgreSQL"
  export DATABASE_URL="postgresql://postgres:postgres@localhost:5432/mcms_db?schema=public"
fi

echo "📝 Running Prisma migrations..."
npx prisma migrate dev --name initial-migration

echo "🌱 Seeding the database..."
npx prisma db seed

echo "✅ Database seeding complete!"
