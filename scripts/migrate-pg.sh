#!/bin/bash

# Script to run PostgreSQL migrations manually

# Configuration
DB_USER="postgres"
DB_PASSWORD="postgres"
DB_HOST="localhost"
DB_PORT="5432"
DB_NAME="mcms_db"
MIGRATIONS_DIR="./db/migrations"

# Check if psql is installed
if ! command -v psql &> /dev/null; then
    echo "PostgreSQL client not found. Please install PostgreSQL client."
    exit 1
fi

# Check if migrations directory exists
if [ ! -d "$MIGRATIONS_DIR" ]; then
    echo "Migrations directory not found at $MIGRATIONS_DIR"
    exit 1
fi

# Function to run a single migration file
run_migration() {
    local file=$1
    echo "Running migration: $file"
    PGPASSWORD=$DB_PASSWORD psql -h $DB_HOST -p $DB_PORT -U $DB_USER -d $DB_NAME -f "$file"
    
    if [ $? -eq 0 ]; then
        echo "Migration successful: $file"
    else
        echo "Migration failed: $file"
        exit 1
    fi
}

# Run all migration files in order
echo "Starting database migrations..."
for file in $(find "$MIGRATIONS_DIR" -name "*.sql" | sort); do
    run_migration "$file"
done

echo "All migrations completed successfully!"
