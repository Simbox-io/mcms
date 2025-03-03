#!/bin/bash

# MCMS Deployment Script
# This script helps with deploying the MCMS application

# Check if the directory exists, if not create it
if [ ! -d "./scripts" ]; then
  mkdir -p ./scripts
fi

# Display menu
echo "MCMS Deployment Script"
echo "======================"
echo "1. Deploy with Docker"
echo "2. Deploy to Vercel"
echo "3. Setup local development environment"
echo "4. Exit"
echo ""
read -p "Enter your choice [1-4]: " choice

case $choice in
  1)
    echo "Deploying with Docker..."
    if [ -f "docker-compose.yml" ]; then
      docker-compose up -d
      echo "MCMS is now running at http://localhost:3000"
    else
      echo "Error: docker-compose.yml not found"
      exit 1
    fi
    ;;
  2)
    echo "Deploying to Vercel..."
    if command -v vercel &> /dev/null; then
      vercel
    else
      echo "Vercel CLI not found. Installing..."
      npm install -g vercel
      vercel
    fi
    ;;
  3)
    echo "Setting up local development environment..."
    npm install
    
    # Check if .env.local exists
    if [ ! -f ".env.local" ]; then
      echo "Creating .env.local file from example..."
      cp .env.local.example .env.local
      echo "Please update the .env.local file with your credentials"
    fi
    
    # Generate Prisma client
    npx prisma generate
    
    echo "Starting development server..."
    npm run dev
    ;;
  4)
    echo "Exiting..."
    exit 0
    ;;
  *)
    echo "Invalid option. Exiting..."
    exit 1
    ;;
esac
