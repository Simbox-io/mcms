#!/bin/sh
set -e

echo "🔄 Starting database migration process..."

# Generate Prisma client first to ensure binaries are available
echo "🔧 Generating Prisma client..."
npx prisma generate

# Check if migrations folder exists
if [ -d "./prisma/migrations" ]; then
  echo "📁 Migrations folder found, applying existing migrations..."
  npx prisma migrate deploy
else
  echo "📁 No migrations folder found, creating initial migration..."
  npx prisma migrate dev --name init
fi

# Verify that all tables from schema exist in the database
echo "🔍 Verifying database schema..."
npx prisma db pull --schema ./prisma/temp-schema.prisma

# Compare schemas
echo "🔍 Checking for missing tables or fields..."
if npx prisma migrate diff \
  --from-schema-datamodel ./prisma/temp-schema.prisma \
  --to-schema-datamodel ./prisma/schema.prisma \
  --exit-code; then
  echo "✅ Database schema is up to date!"
else
  echo "⚠️ Schema differences found, creating repair migration..."
  npx prisma migrate dev --name repair_schema
fi

# Clean up temporary schema file
if [ -f "./prisma/temp-schema.prisma" ]; then
  rm ./prisma/temp-schema.prisma
fi

echo "✅ Migration process completed!"
