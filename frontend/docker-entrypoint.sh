#!/bin/sh
# docker-entrypoint.sh
# Injects runtime environment variables into the static frontend build

set -e

# Define the placeholder patterns and their corresponding environment variables
INDEX_HTML="/usr/share/nginx/html/index.html"

# Replace placeholders with actual environment variables
if [ -f "$INDEX_HTML" ]; then
    # API Base URL
    if [ -n "$API_BASE_URL" ]; then
        sed -i "s|__API_BASE_URL__|$API_BASE_URL|g" "$INDEX_HTML"
    fi
    
    # Google Client ID
    if [ -n "$GOOGLE_CLIENT_ID" ]; then
        sed -i "s|__GOOGLE_CLIENT_ID__|$GOOGLE_CLIENT_ID|g" "$INDEX_HTML"
    fi
    
    # GA Measurement ID
    if [ -n "$GA_MEASUREMENT_ID" ]; then
        sed -i "s|__GA_MEASUREMENT_ID__|$GA_MEASUREMENT_ID|g" "$INDEX_HTML"
    fi
    
    echo "Environment variables injected successfully."
else
    echo "Warning: index.html not found at $INDEX_HTML"
fi

# Execute the main command (nginx)
exec "$@"
