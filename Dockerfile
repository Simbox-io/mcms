FROM node:18-alpine AS builder

# Install required dependencies for building, including specific OpenSSL and PostgreSQL client
RUN apk add --no-cache \
    libc6-compat \
    openssl \
    openssl-dev \
    python3 \
    make \
    g++ \
    postgresql-client

WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./
COPY prisma ./prisma/

# Install dependencies with explicit architecture flags
ENV BCRYPT_FORCE_REBUILD=1
ENV PRISMA_CLI_BINARY_TARGETS=linux-musl

# Install dependencies and generate Prisma client
RUN npm install && \
    npm uninstall bcrypt && \
    npm install bcryptjs --save && \
    npm cache clean --force && \
    npx prisma generate

# Second stage to run the application
FROM node:18-alpine

# Install runtime dependencies including openssl
RUN apk add --no-cache \
    netcat-openbsd \
    libc6-compat \
    openssl \
    postgresql-client

WORKDIR /app

# Copy node_modules and prisma from builder stage
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/prisma ./prisma

# Copy the rest of the application
COPY . .

# Generate Prisma client in the final stage to ensure .prisma exists
RUN npx prisma generate

# Make entrypoint script executable
COPY scripts/entrypoint.sh /entrypoint.sh
RUN chmod +x /entrypoint.sh

# Set environment variables
ENV NODE_ENV=development
ENV NEXT_TELEMETRY_DISABLED=1
ENV PRISMA_CLI_BINARY_TARGETS=linux-musl

ENTRYPOINT ["/entrypoint.sh"]
