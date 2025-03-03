# PostgreSQL Database for MCMS

This directory contains the database schema and migration scripts for the MCMS application.

## Structure

- `migrations/`: Contains SQL migration files for PostgreSQL
  - `01_init_schema.sql`: Initial schema creation script

## Setting Up the Database

### Using Docker Compose (Recommended)

The easiest way to get started is to use Docker Compose, which is already configured in the project root:

```bash
# Start the PostgreSQL container
docker-compose up -d postgres

# The migrations will automatically run on first startup
# since they're mounted in the docker-entrypoint-initdb.d directory
```

### Manual Setup

If you prefer to run PostgreSQL directly on your machine:

1. Install PostgreSQL on your system
2. Create a database:
   ```bash
   createdb mcms_db
   ```
3. Run the migration script:
   ```bash
   cd /path/to/mcms
   ./scripts/migrate-pg.sh
   ```

## Database Configuration

The database connection is configured through the `DATABASE_URL` environment variable. 
You can set this in your `.env` or `.env.local` file:

```
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/mcms_db?schema=public"
```

## Schema Management with Prisma

This project uses Prisma as the ORM. After making changes to the `schema.prisma` file,
you should generate a new migration:

```bash
npx prisma migrate dev --name <migration_name>
```

## Backup and Restore

### Backup

```bash
pg_dump -h localhost -p 5432 -U postgres -F c -b -v -f mcms_backup.dump mcms_db
```

### Restore

```bash
pg_restore -h localhost -p 5432 -U postgres -d mcms_db -v mcms_backup.dump
```

## Schema Diagram

A visual representation of the database schema can be generated using Prisma's schema visualization tools:

```bash
npx prisma-erd-generator
```
