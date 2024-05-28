#!/bin/bash

# Define directories
PROJECT_DIR=~/generic-react-app
BACKEND_DIR="$PROJECT_DIR/server"
FRONTEND_DIR="$PROJECT_DIR/frontend/my-app"
CADDYFILE="$PROJECT_DIR/caddy/Caddyfile"
LOG_DIR="$PROJECT_DIR/logs"

# Ensure log directory exists
mkdir -p $LOG_DIR

# Set environment variables
export ADMIN_USERNAME="admin"
export ADMIN_PASSWORD="password"
export JWT_SECRET_KEY="your_jwt_secret_key"

# Function to check if a process is running
is_running() {
  pgrep -x "$1" > /dev/null
}

# Stop any running Caddy instance
echo "Stopping any running Caddy instance..."
if is_running "caddy"; then
  sudo caddy stop
  sudo pkill caddy
fi

# Ensure no Caddy processes are running
if is_running "caddy"; then
  echo "Caddy is still running, stopping forcefully..."
  sudo pkill -9 caddy
fi

# Start the aiohttp web app
echo "Starting aiohttp web app..."
cd $BACKEND_DIR
source env/bin/activate
nohup python3 main.py > $LOG_DIR/backend_nohup.log 2>&1 &

# Start Caddy
echo "Starting Caddy server..."
sudo caddy start --config $CADDYFILE

echo "All services started successfully."
