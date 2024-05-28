#!/bin/bash

# Define frontend directory
FRONTEND_DIR=~/generic-react-app/frontend/my-app

# Build the React app
echo "Building React app..."
cd $FRONTEND_DIR
npm run build

echo "Build completed successfully."
