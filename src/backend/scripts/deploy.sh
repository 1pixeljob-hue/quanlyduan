#!/bin/bash

# 🦆 1Pixel Deployment Script
# Run this on hosting to deploy latest code

echo "════════════════════════════════════════"
echo "🚀 1PIXEL DEPLOYMENT STARTING..."
echo "════════════════════════════════════════"
echo ""

# Navigate to backend directory
cd "$(dirname "$0")/.."

# Pull latest code
echo "📥 Pulling latest code from Git..."
git pull origin main || git pull origin master

if [ $? -ne 0 ]; then
    echo "❌ Git pull failed!"
    exit 1
fi

# Install dependencies
echo ""
echo "📦 Installing dependencies..."
npm ci --production

# Restart PM2
echo ""
echo "🔄 Restarting backend..."
pm2 restart 1pixel-backend || pm2 start index.js --name 1pixel-backend

if [ $? -ne 0 ]; then
    echo "❌ PM2 restart failed!"
    exit 1
fi

# Save PM2 config
pm2 save

# Wait for server to start
echo ""
echo "⏳ Waiting for server to start..."
sleep 3

# Health check
echo ""
echo "🔍 Running health check..."
response=$(curl -s http://localhost:3001/api/health)

if echo "$response" | grep -q "success"; then
    echo "✅ Backend is healthy!"
    echo "$response"
else
    echo "❌ Health check failed!"
    echo "$response"
    exit 1
fi

# Show PM2 status
echo ""
echo "📊 PM2 Status:"
pm2 status

echo ""
echo "════════════════════════════════════════"
echo "✅ DEPLOYMENT SUCCESSFUL!"
echo "════════════════════════════════════════"
echo ""
echo "📋 Logs: pm2 logs 1pixel-backend"
echo "📊 Monitor: pm2 monit"
echo ""
