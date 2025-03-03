#!/bin/sh
set -e

# Script to create the PostgreSQL extensions before running migrations
echo "🔧 Creating PostgreSQL extensions..."
PGPASSWORD=postgres psql -h postgres -U postgres -d mcms_db -c "CREATE EXTENSION IF NOT EXISTS \"uuid-ossp\";"
PGPASSWORD=postgres psql -h postgres -U postgres -d mcms_db -c "CREATE EXTENSION IF NOT EXISTS \"citext\";"
echo "✅ PostgreSQL extensions created!"
