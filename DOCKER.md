# Docker Setup for MCMS

This document explains how to use Docker and Docker Compose to run the MCMS application.

## Quick Start

```bash
# Start the application with Docker Compose
docker-compose up -d

# View logs
docker-compose logs -f app

# Stop the application
docker-compose down
```

## Environment Variables

The following environment variables can be set in docker-compose.yml:

- `DATABASE_URL`: PostgreSQL connection string
- `NEXTAUTH_URL`: The URL of your application (for NextAuth.js)
- `NEXTAUTH_SECRET`: Secret for NextAuth.js
- `NODE_ENV`: Set to "development" or "production"
- `SEED_DATABASE`: Set to "true" to seed the database on startup
- `RESET_DATABASE`: Set to "true" to reset the database on startup

## Development Workflow

1. Make changes to your code
2. The changes will be automatically applied thanks to volume mounting
3. Next.js will hot reload the application

## Database Management

- The PostgreSQL database data is persisted in a Docker volume
- You can connect to the database using:
  ```bash
  docker-compose exec postgres psql -U postgres -d mcms_db
  ```

- To run migrations manually:
  ```bash
  docker-compose exec app npx prisma migrate dev
  ```

- To reset the database:
  ```bash
  docker-compose exec app npx prisma migrate reset
  ```

## Troubleshooting

If you encounter issues:

1. Check the logs:
   ```bash
   docker-compose logs app
   docker-compose logs postgres
   ```

2. Restart the containers:
   ```bash
   docker-compose restart
   ```

3. Rebuild the containers:
   ```bash
   docker-compose up -d --build
   ```

4. Reset the database:
   ```bash
   docker-compose exec app npx prisma migrate reset --force
   ```
