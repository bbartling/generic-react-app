#!/bin/bash

# Define the directory and file paths
NGINX_DIR="nginx"
KEY_FILE="self-signed.key"
CRT_FILE="self-signed.crt"

# Create the nginx directory if it doesn't exist
if [ ! -d "$NGINX_DIR" ]; then
  echo "Creating $NGINX_DIR directory..."
  mkdir -p "$NGINX_DIR"
fi

# Check if a directory with the same name as the key file exists and prompt to remove it
if [ -d "$NGINX_DIR/$KEY_FILE" ]; then
  echo "Error: A directory named $KEY_FILE already exists in $NGINX_DIR."
  read -p "Do you want to remove it? (y/n) " choice
  if [ "$choice" = "y" ]; then
    rm -r "$NGINX_DIR/$KEY_FILE"
    echo "Removed the existing directory $NGINX_DIR/$KEY_FILE."
  else
    echo "Aborted."
    exit 1
  fi
fi

# Ensure correct permissions for the nginx directory
echo "Ensuring write permissions for $NGINX_DIR directory..."
chmod u+w "$NGINX_DIR"

# Generate the self-signed certificate
echo "Generating the self-signed certificate..."
openssl req -x509 -nodes -days 365 -newkey rsa:2048 -keyout "$NGINX_DIR/$KEY_FILE" -out "$NGINX_DIR/$CRT_FILE" -subj "/CN=localhost"

# Verify the creation of the files
if [ -f "$NGINX_DIR/$KEY_FILE" ] && [ -f "$NGINX_DIR/$CRT_FILE" ]; then
  echo "Self-signed certificate and key have been successfully generated."
else
  echo "Error: Failed to generate the self-signed certificate and key."
  exit 1
fi
