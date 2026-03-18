#!/bin/bash

# 🦆 1Pixel - System Status Check Script
# Kiểm tra trạng thái toàn bộ hệ thống

echo "════════════════════════════════════════"
echo "🔍 1PIXEL SYSTEM STATUS CHECK"
echo "════════════════════════════════════════"
echo ""

# Load environment variables
if [ -f ../.env ]; then
    export $(cat ../.env | grep -v '^#' | xargs)
fi

# Colors
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check Node.js
echo "📦 Node.js:"
if command -v node &> /dev/null; then
    echo -e "  ${GREEN}✓${NC} Installed: $(node -v)"
else
    echo -e "  ${RED}✗${NC} Not installed"
fi

# Check npm
echo ""
echo "📦 npm:"
if command -v npm &> /dev/null; then
    echo -e "  ${GREEN}✓${NC} Installed: $(npm -v)"
else
    echo -e "  ${RED}✗${NC} Not installed"
fi

# Check PM2
echo ""
echo "📦 PM2:"
if command -v pm2 &> /dev/null; then
    echo -e "  ${GREEN}✓${NC} Installed: $(pm2 -v)"
else
    echo -e "  ${RED}✗${NC} Not installed"
fi

# Check MySQL
echo ""
echo "🗄️  MySQL:"
if command -v mysql &> /dev/null; then
    echo -e "  ${GREEN}✓${NC} Client installed"
    
    # Test connection
    if mysql -h ${DB_HOST:-localhost} -u ${DB_USER:-root} -p${DB_PASSWORD} -e "SELECT 1;" &> /dev/null; then
        echo -e "  ${GREEN}✓${NC} Connection successful"
        
        # Check database
        if mysql -h ${DB_HOST:-localhost} -u ${DB_USER:-root} -p${DB_PASSWORD} -e "USE ${DB_NAME:-onepixel_db};" &> /dev/null; then
            echo -e "  ${GREEN}✓${NC} Database '${DB_NAME:-onepixel_db}' exists"
            
            # Count tables
            table_count=$(mysql -h ${DB_HOST:-localhost} -u ${DB_USER:-root} -p${DB_PASSWORD} ${DB_NAME:-onepixel_db} -e "SHOW TABLES;" | wc -l)
            table_count=$((table_count - 1))
            if [ $table_count -eq 6 ]; then
                echo -e "  ${GREEN}✓${NC} All 6 tables exist"
            else
                echo -e "  ${YELLOW}⚠${NC}  Only $table_count tables found (expected 6)"
            fi
        else
            echo -e "  ${RED}✗${NC} Database '${DB_NAME:-onepixel_db}' not found"
        fi
    else
        echo -e "  ${RED}✗${NC} Connection failed"
    fi
else
    echo -e "  ${RED}✗${NC} Client not installed"
fi

# Check PM2 processes
echo ""
echo "🚀 PM2 Processes:"
if command -v pm2 &> /dev/null; then
    if pm2 list | grep -q "1pixel-backend"; then
        status=$(pm2 jlist | grep -o '"status":"[^"]*"' | head -1 | cut -d'"' -f4)
        if [ "$status" == "online" ]; then
            echo -e "  ${GREEN}✓${NC} 1pixel-backend is running"
            
            # Get uptime
            uptime=$(pm2 jlist | grep -o '"pm_uptime":[0-9]*' | head -1 | cut -d':' -f2)
            if [ -n "$uptime" ]; then
                uptime_seconds=$(( $(date +%s) - ($uptime / 1000) ))
                uptime_formatted=$(date -u -d @"$uptime_seconds" +'%H:%M:%S')
                echo "  Uptime: $uptime_formatted"
            fi
        else
            echo -e "  ${RED}✗${NC} 1pixel-backend is $status"
        fi
    else
        echo -e "  ${RED}✗${NC} 1pixel-backend not found"
    fi
else
    echo -e "  ${YELLOW}⚠${NC}  PM2 not installed"
fi

# Check Backend API
echo ""
echo "📡 Backend API:"
if curl -s http://localhost:3001/api/health > /dev/null 2>&1; then
    response=$(curl -s http://localhost:3001/api/health)
    if echo "$response" | grep -q "success"; then
        echo -e "  ${GREEN}✓${NC} API is healthy"
        echo "  Response: $response" | head -c 100
    else
        echo -e "  ${RED}✗${NC} API returned error"
    fi
else
    echo -e "  ${RED}✗${NC} API not responding"
fi

# Check .env file
echo ""
echo "🔐 Configuration:"
if [ -f ../.env ]; then
    echo -e "  ${GREEN}✓${NC} .env file exists"
    
    # Check required variables
    required_vars=("DB_HOST" "DB_USER" "DB_PASSWORD" "DB_NAME" "PORT")
    for var in "${required_vars[@]}"; do
        if grep -q "^$var=" ../.env; then
            echo -e "  ${GREEN}✓${NC} $var is set"
        else
            echo -e "  ${RED}✗${NC} $var is missing"
        fi
    done
else
    echo -e "  ${RED}✗${NC} .env file not found"
fi

# Check port availability
echo ""
echo "🔌 Port Status:"
port=${PORT:-3001}
if lsof -Pi :$port -sTCP:LISTEN -t >/dev/null 2>&1; then
    echo -e "  ${GREEN}✓${NC} Port $port is in use (backend running)"
else
    echo -e "  ${YELLOW}⚠${NC}  Port $port is available (backend not running?)"
fi

# Disk space
echo ""
echo "💾 Disk Space:"
disk_usage=$(df -h . | awk 'NR==2 {print $5}' | sed 's/%//')
if [ $disk_usage -lt 80 ]; then
    echo -e "  ${GREEN}✓${NC} Disk usage: $disk_usage%"
else
    echo -e "  ${YELLOW}⚠${NC}  Disk usage: $disk_usage% (high)"
fi

# Memory
echo ""
echo "🧠 Memory:"
if command -v free &> /dev/null; then
    mem_usage=$(free | grep Mem | awk '{printf("%.0f", $3/$2 * 100)}')
    if [ $mem_usage -lt 80 ]; then
        echo -e "  ${GREEN}✓${NC} Memory usage: $mem_usage%"
    else
        echo -e "  ${YELLOW}⚠${NC}  Memory usage: $mem_usage% (high)"
    fi
else
    echo -e "  ${YELLOW}⚠${NC}  Cannot check memory (free command not available)"
fi

echo ""
echo "════════════════════════════════════════"
echo "✅ STATUS CHECK COMPLETE"
echo "════════════════════════════════════════"
echo ""
echo "📋 Quick Actions:"
echo "  View logs: pm2 logs 1pixel-backend"
echo "  Restart:   pm2 restart 1pixel-backend"
echo "  Monitor:   pm2 monit"
echo ""
