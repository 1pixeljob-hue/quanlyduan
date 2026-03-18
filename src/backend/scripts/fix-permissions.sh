#!/bin/bash

# 🦆 1Pixel - Fix File Permissions Script
# Sửa quyền truy cập file sau khi deploy

echo "════════════════════════════════════════"
echo "🔒 FIXING FILE PERMISSIONS"
echo "════════════════════════════════════════"
echo ""

# Navigate to backend directory
cd "$(dirname "$0")/.."

# Set directory ownership
echo "📁 Setting directory ownership..."
chown -R $USER:$USER .

# Directories: 755 (rwxr-xr-x)
echo "📂 Setting directory permissions (755)..."
find . -type d -exec chmod 755 {} \;

# Files: 644 (rw-r--r--)
echo "📄 Setting file permissions (644)..."
find . -type f -exec chmod 644 {} \;

# Scripts: 755 (executable)
echo "🔧 Making scripts executable (755)..."
chmod 755 scripts/*.sh

# .env: 600 (rw-------)
if [ -f .env ]; then
    echo "🔐 Securing .env file (600)..."
    chmod 600 .env
fi

# node_modules: skip
echo "⏭️  Skipping node_modules..."

# Verify
echo ""
echo "✅ Permissions fixed!"
echo ""
echo "📋 Summary:"
ls -la scripts/*.sh | head -5
echo ""
if [ -f .env ]; then
    ls -la .env
fi

echo ""
echo "════════════════════════════════════════"
echo "🔒 PERMISSIONS COMPLETE"
echo "════════════════════════════════════════"
