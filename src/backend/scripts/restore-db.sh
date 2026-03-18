#!/bin/bash

# 🦆 1Pixel Database Restore Script
# Restore MySQL database from backup

# Load environment variables
if [ -f ../.env ]; then
    export $(cat ../.env | grep -v '^#' | xargs)
fi

echo "════════════════════════════════════════"
echo "♻️  1PIXEL DATABASE RESTORE"
echo "════════════════════════════════════════"
echo ""

# Check if backup file provided
if [ -z "$1" ]; then
    echo "❌ Chưa chỉ định file backup!"
    echo ""
    echo "Usage: ./restore-db.sh <backup-file>"
    echo "Example: ./restore-db.sh ~/backups/1pixel/1pixel_backup_20260318_120000.sql.gz"
    echo ""
    echo "📁 Available backups:"
    ls -lh ~/backups/1pixel/*.sql.gz 2>/dev/null || echo "  No backups found"
    exit 1
fi

BACKUP_FILE=$1

# Check if file exists
if [ ! -f "$BACKUP_FILE" ]; then
    echo "❌ File không tồn tại: $BACKUP_FILE"
    exit 1
fi

echo "📄 Backup file: $BACKUP_FILE"
echo "🗄️  Database: ${DB_NAME:-onepixel_db}"
echo ""

# Confirm restore
read -p "⚠️  Bạn có chắc muốn restore? Dữ liệu hiện tại sẽ bị ghi đè! (yes/no): " confirm

if [ "$confirm" != "yes" ]; then
    echo "❌ Restore cancelled"
    exit 0
fi

echo ""
echo "🔄 Restoring database..."

# Decompress if gzipped
if [[ $BACKUP_FILE == *.gz ]]; then
    echo "📦 Decompressing..."
    gunzip -c $BACKUP_FILE > /tmp/1pixel_restore_temp.sql
    SQL_FILE="/tmp/1pixel_restore_temp.sql"
else
    SQL_FILE=$BACKUP_FILE
fi

# Restore database
mysql -h ${DB_HOST:-localhost} \
      -u ${DB_USER:-root} \
      -p${DB_PASSWORD} \
      ${DB_NAME:-onepixel_db} \
      < $SQL_FILE

if [ $? -eq 0 ]; then
    echo ""
    echo "✅ Database restored successfully!"
    
    # Cleanup temp file
    if [ -f "/tmp/1pixel_restore_temp.sql" ]; then
        rm /tmp/1pixel_restore_temp.sql
    fi
    
    # Restart backend
    echo ""
    read -p "🔄 Restart backend? (yes/no): " restart
    if [ "$restart" == "yes" ]; then
        pm2 restart 1pixel-backend
        echo "✅ Backend restarted"
    fi
else
    echo ""
    echo "❌ Restore failed!"
    exit 1
fi

echo ""
echo "════════════════════════════════════════"
echo "♻️  RESTORE COMPLETE"
echo "════════════════════════════════════════"
echo ""
