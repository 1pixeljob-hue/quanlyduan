#!/bin/bash

# 🦆 1Pixel Backend Setup Script
# Tự động setup backend trên hosting

echo "════════════════════════════════════════"
echo "🦆 1PIXEL BACKEND AUTO SETUP"
echo "════════════════════════════════════════"
echo ""

# Kiểm tra Node.js
if ! command -v node &> /dev/null; then
    echo "❌ Node.js chưa được cài đặt!"
    echo "👉 Cài đặt Node.js v18+ trước khi tiếp tục"
    exit 1
fi

echo "✅ Node.js version: $(node -v)"

# Kiểm tra MySQL
if ! command -v mysql &> /dev/null; then
    echo "⚠️  MySQL client chưa được cài đặt"
    echo "👉 Cài đặt: sudo apt install mysql-client"
else
    echo "✅ MySQL client installed"
fi

# Install dependencies
echo ""
echo "📦 Installing dependencies..."
npm install --production

# Kiểm tra PM2
if ! command -v pm2 &> /dev/null; then
    echo ""
    echo "📦 Installing PM2..."
    npm install -g pm2
fi

echo "✅ PM2 version: $(pm2 -v)"

# Tạo .env nếu chưa có
if [ ! -f .env ]; then
    echo ""
    echo "📝 Creating .env file..."
    cp .env.example .env
    echo "⚠️  QUAN TRỌNG: Cập nhật thông tin trong file .env"
    echo "👉 nano .env"
else
    echo "✅ .env file exists"
fi

echo ""
echo "════════════════════════════════════════"
echo "✅ Setup hoàn tất!"
echo "════════════════════════════════════════"
echo ""
echo "📋 NEXT STEPS:"
echo "1. Cập nhật file .env với MySQL credentials:"
echo "   nano .env"
echo ""
echo "2. Start backend với PM2:"
echo "   pm2 start index.js --name 1pixel-backend"
echo "   pm2 startup"
echo "   pm2 save"
echo ""
echo "3. Verify backend đang chạy:"
echo "   pm2 status"
echo "   curl http://localhost:3001/api/health"
echo ""
