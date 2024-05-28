#!/bin/bash

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

# Stop the aiohttp web app
echo "Stopping any running aiohttp web app..."
pkill -f 'python3 main.py'

echo "All services stopped successfully."
