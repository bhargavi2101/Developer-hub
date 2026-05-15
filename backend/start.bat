@echo off
echo 🚀 Starting Developer Hub Backend...

REM Check if we're in the backend directory
if not exist "package.json" (
    echo ❌ Error: Must be run from backend directory
    echo Usage: Double-click this file in the backend folder
    pause
    exit /b 1
)

REM Check if node_modules exists
if not exist "node_modules" (
    echo 📦 Installing dependencies...
    call npm install
)

REM Start the server
echo 🔧 Starting server...
node server.js

pause