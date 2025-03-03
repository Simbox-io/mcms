#!/bin/sh
set -e

# Setup PostgreSQL and create extensions first
echo "🛠️ Setting up PostgreSQL..."
/bin/sh /app/scripts/setup-pg.sh

# Reset database if needed
if [ "$RESET_DATABASE" = "true" ]; then
  echo "🗑️ Resetting database..."
  npx prisma migrate reset --force --skip-seed
elif [ "$DIRECT_SQL" = "true" ]; then
  echo "📝 Direct SQL mode enabled, skipping Prisma migrations..."
else
  # Run migrations normally
  echo "🔄 Running database migrations..."
  npx prisma migrate deploy
fi

# Generate Prisma client
echo "🔧 Generating Prisma client..."
npx prisma generate

# Run seed if specified
if [ "$SEED_DATABASE" = "true" ]; then
  echo "🌱 Seeding database..."
  node /app/scripts/seed.cjs
  echo "✅ Database seeded!"
fi

# Create health check endpoint
mkdir -p /app/app/api/health
cat > /app/app/api/health/route.ts << EOL
import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({ status: 'ok', timestamp: new Date().toISOString() });
}
EOL

echo "🚀 Starting application..."
npm run dev