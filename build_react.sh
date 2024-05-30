#!/bin/bash

# Define frontend directory
FRONTEND_DIR=~/generic-react-app/frontend/my-app

# Function to handle errors
handle_error() {
  echo "Error occurred in $1"
  exit 1
}

# Build the React app
echo "Building React app..."
cd $FRONTEND_DIR || handle_error "cd to $FRONTEND_DIR"

# Install dependencies if not already installed
npm ci || handle_error "npm ci"
echo "npm install successfully."

# Set the NODE_OPTIONS environment variable to use less memory
# This is the only way i can get to work on rasp pi
# export NODE_OPTIONS="--max-old-space-size=256"

# Build the React app
npm run build || handle_error "npm run build"
echo "Build completed successfully."
