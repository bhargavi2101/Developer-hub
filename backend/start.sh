#!/bin/bash

# Developer Hub Backend Startup Script

echo "🚀 Starting Developer Hub Backend..."

# Check if we're in the backend directory
if [ ! -f "package.json" ]; then
    echo "❌ Error: Must be run from backend directory"
    echo "Usage: cd backend && ./start.sh"
    exit 1
fi

# Check if node_modules exists
if [ ! -d "node_modules" ]; then
    echo "📦 Installing dependencies..."
    npm install
fi

# Start the server
echo "🔧 Starting server..."
node server.js