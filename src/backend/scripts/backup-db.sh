#!/bin/bash

# 🦆 1Pixel Database Backup Script
# Auto backup MySQL database

# Load environment variables
if [ -f ../.env ]; then
    export $(cat ../.env | grep -v '^#' | xargs)
fi

# Backup directory
BACKUP_DIR="$HOME/backups/1pixel"
mkdir -p $BACKUP_DIR

# Backup filename with timestamp
TIMESTAMP=$(date +"%Y%m%d_%H%M%S")
BACKUP_FILE="$BACKUP_DIR/1pixel_backup_$TIMESTAMP.sql"

echo "════════════════════════════════════════"
echo "💾 1PIXEL DATABASE BACKUP"
echo "════════════════════════════════════════"
echo ""
echo "📅 Timestamp: $TIMESTAMP"
echo "📁 Backup directory: $BACKUP_DIR"
echo ""

# Create backup
echo "🔄 Creating backup..."
mysqldump -h ${DB_HOST:-localhost} \
          -u ${DB_USER:-root} \
          -p${DB_PASSWORD} \
          ${DB_NAME:-onepixel_db} \
          > $BACKUP_FILE

if [ $? -eq 0 ]; then
    # Compress backup
    echo "📦 Compressing backup..."
    gzip $BACKUP_FILE
    
    BACKUP_SIZE=$(du -h "${BACKUP_FILE}.gz" | cut -f1)
    
    echo ""
    echo "✅ Backup successful!"
    echo "📄 File: ${BACKUP_FILE}.gz"
    echo "📊 Size: $BACKUP_SIZE"
    
    # Delete old backups (keep last 7 days)
    echo ""
    echo "🧹 Cleaning old backups (keeping last 7 days)..."
    find $BACKUP_DIR -name "*.sql.gz" -mtime +7 -delete
    
    echo "✅ Cleanup complete"
else
    echo ""
    echo "❌ Backup failed!"
    exit 1
fi

echo ""
echo "════════════════════════════════════════"
echo "💾 BACKUP COMPLETE"
echo "════════════════════════════════════════"
echo ""
echo "📋 To restore this backup:"
echo "gunzip ${BACKUP_FILE}.gz"
echo "mysql -u ${DB_USER} -p ${DB_NAME} < $BACKUP_FILE"
echo ""
