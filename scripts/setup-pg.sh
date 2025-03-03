#!/bin/sh
set -e

echo "Setting up PostgreSQL for MCMS..."

# Wait for PostgreSQL to be ready
echo "⏳ Waiting for PostgreSQL to be ready..."
while ! nc -z postgres 5432; do
  sleep 1
  echo "  Still waiting for PostgreSQL..."
done
echo "✅ PostgreSQL is ready!"

# Create required extensions
echo "🔧 Creating PostgreSQL extensions..."
PGPASSWORD=postgres psql -h postgres -U postgres -d mcms_db -c "CREATE EXTENSION IF NOT EXISTS \"uuid-ossp\";"
PGPASSWORD=postgres psql -h postgres -U postgres -d mcms_db -c "CREATE EXTENSION IF NOT EXISTS \"citext\";"
echo "✅ PostgreSQL extensions created!"

# For testing, also run the SQL migration directly if needed
if [ "$DIRECT_SQL" = "true" ]; then
  echo "📝 Running SQL schema directly..."
  PGPASSWORD=postgres psql -h postgres -U postgres -d mcms_db -f /app/db/migrations/01_init_schema.sql
  echo "✅ SQL schema applied directly!"
fi
