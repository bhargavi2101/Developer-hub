#!/bin/bash

# Developer Hub Deployment Script
# This script helps deploy the project to free hosting platforms

echo "🚀 Developer Hub Deployment Script"
echo "=================================="
echo ""

# Check if we're in the right directory
if [ ! -f "backend/package.json" ]; then
    echo "❌ Error: Please run this script from the Developer-hub directory"
    exit 1
fi

# Option 1: Deploy to Railway (Recommended)
echo "🎯 Option 1: Deploy to Railway (Easiest - 100% Free)"
echo "------------------------------------------------"
echo "1. Open https://railway.app/new"
echo "2. Click 'Deploy from GitHub repo'"
echo "3. Select your repository: bhargavi2101/Developer-hub"
echo "4. Railway will automatically detect both frontend and backend"
echo "5. Add environment variables (see below)"
echo "6. Click 'Deploy'"
echo ""

# Option 2: Deploy to Render + Vercel
echo "🎯 Option 2: Deploy to Render + Vercel (Recommended)"
echo "---------------------------------------------------"
echo "Backend to Render:"
echo "1. Open https://dashboard.render.com/new"
echo "2. Click 'Web Service'"
echo "3. Connect GitHub repository"
echo "4. Configure:"
echo "   - Name: developer-hub-backend"
echo "   - Root Directory: backend"
echo "   - Build Command: npm install"
echo "   - Start Command: node server.js"
echo "   - Instance Type: Free"
echo ""
echo "5. Add environment variables:"
echo "   - MONGO_URI=mongodb+srv://bhargavi21:Bhargavi123@cluster0.kiks8eo.mongodb.net/devhub"
echo "   - JWT_SECRET=devhub_secure_jwt_secret_key_2024_production_ready"
echo "   - JWT_REFRESH_SECRET=devhub_refresh_token_secret_key_2024_secure_random_string"
echo "   - ALLOWED_ORIGINS=https://your-frontend-domain.vercel.app"
echo "   - NODE_ENV=production"
echo "   - SESSION_SECRET=devhub_session_secret_key_2024_secure_random_string_for_production"
echo ""

echo "Frontend to Vercel:"
echo "1. Open https://vercel.com/new"
echo "2. Click 'Add New Project'"
echo "3. Select your GitHub repository"
echo "4. Configure:"
echo "   - Framework Preset: Angular"
echo "   - Root Directory: Frontend"
echo "   - Build Command: npm run build"
echo "   - Output Directory: dist/Frontend/browser"
echo "5. Add environment variable:"
echo "   - API_URL=https://your-backend-url.onrender.com"
echo ""

# Option 3: Deploy to Netlify + Render
echo "🎯 Option 3: Deploy to Netlify + Render"
echo "--------------------------------------"
echo "1. Deploy backend to Render (same as Option 2)"
echo "2. For frontend:"
echo "   - Open https://app.netlify.com/start"
echo "   - Click 'Import an existing project'"
echo "   - Connect GitHub repository"
echo "   - Configure:"
echo "     - Build command: cd Frontend && npm run build"
echo "     - Publish directory: Frontend/dist/Frontend/browser"
echo ""

# Environment Variables
echo "📝 Required Environment Variables:"
echo "=================================="
cat backend/.env
echo ""

# Quick deploy command
echo "⚡ Quick Deploy (Manual):"
echo "========================"
echo "1. Go to https://railway.app/new"
echo "2. Click 'Deploy from GitHub repo'"
echo "3. Select: bhargavi2101/Developer-hub"
echo "4. Click 'Deploy Variables' and add environment variables"
echo "5. Click 'Deploy'"
echo ""

echo "✨ Your project is ready to deploy!"
echo "📖 For detailed instructions, see DEPLOYMENT_GUIDE.md"
echo ""

# Check if Railway CLI is available
if command -v railway &> /dev/null; then
    echo "🚂 Railway CLI is available!"
    echo "To deploy with Railway CLI:"
    echo "1. Run: railway login"
    echo "2. Run: railway init"
    echo "3. Run: railway up"
    echo ""
fi

echo "🎉 Happy deploying!"