# 🎯 1Pixel Commands Cheatsheet

Quick reference cho tất cả commands thường dùng khi quản lý 1Pixel system.

---

## 🚀 DEPLOYMENT COMMANDS

### **Initial Setup**
```bash
# Clone repository
git clone https://github.com/your-username/1pixel.git
cd 1pixel/backend

# Quick setup
chmod +x scripts/*.sh
./scripts/setup.sh

# Manual setup
cp .env.example .env
nano .env
npm install --production
```

### **Start Backend**
```bash
# With PM2 (recommended)
pm2 start ecosystem.config.js
pm2 startup
pm2 save

# Direct start (dev)
npm start

# Development mode with auto-restart
npm run dev
```

---

## 📊 PM2 COMMANDS

### **Process Management**
```bash
# Status
pm2 status

# Start
pm2 start 1pixel-backend
pm2 start ecosystem.config.js

# Stop
pm2 stop 1pixel-backend

# Restart
pm2 restart 1pixel-backend

# Delete
pm2 delete 1pixel-backend

# Reload (zero-downtime)
pm2 reload 1pixel-backend
```

### **Logs**
```bash
# All logs
pm2 logs

# Specific app logs
pm2 logs 1pixel-backend

# Last 50 lines
pm2 logs 1pixel-backend --lines 50

# Error logs only
pm2 logs 1pixel-backend --err

# Clear logs
pm2 flush
```

### **Monitoring**
```bash
# Dashboard
pm2 monit

# Process info
pm2 info 1pixel-backend

# Show all processes (JSON)
pm2 jlist
```

### **Auto-start on Reboot**
```bash
# Generate startup script
pm2 startup

# Save current process list
pm2 save

# Remove startup script
pm2 unstartup
```

---

## 🗄️ MYSQL COMMANDS

### **Connection**
```bash
# Connect to database
mysql -u onepixel_user -p onepixel_db

# Connect with host
mysql -h localhost -u onepixel_user -p onepixel_db

# Run query directly
mysql -u onepixel_user -p onepixel_db -e "SHOW TABLES;"
```

### **Database Management**
```sql
-- Show all databases
SHOW DATABASES;

-- Create database
CREATE DATABASE onepixel_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- Use database
USE onepixel_db;

-- Show tables
SHOW TABLES;

-- Describe table
DESCRIBE hostings;

-- Count records
SELECT COUNT(*) FROM hostings;

-- Show all data
SELECT * FROM hostings;
SELECT * FROM categories;

-- Drop database (careful!)
DROP DATABASE onepixel_db;
```

### **User Management**
```sql
-- Create user
CREATE USER 'onepixel_user'@'localhost' IDENTIFIED BY 'password';

-- Grant privileges
GRANT ALL PRIVILEGES ON onepixel_db.* TO 'onepixel_user'@'localhost';
FLUSH PRIVILEGES;

-- Show grants
SHOW GRANTS FOR 'onepixel_user'@'localhost';

-- Change password
ALTER USER 'onepixel_user'@'localhost' IDENTIFIED BY 'new_password';

-- Drop user
DROP USER 'onepixel_user'@'localhost';
```

---

## 💾 BACKUP & RESTORE

### **Database Backup**
```bash
# Using script
cd ~/1pixel/backend
./scripts/backup-db.sh

# Manual backup
mysqldump -u onepixel_user -p onepixel_db > backup.sql

# Backup with compression
mysqldump -u onepixel_user -p onepixel_db | gzip > backup.sql.gz

# Backup specific tables
mysqldump -u onepixel_user -p onepixel_db hostings projects > backup.sql
```

### **Database Restore**
```bash
# Using script
./scripts/restore-db.sh ~/backups/1pixel/backup.sql.gz

# Manual restore
mysql -u onepixel_user -p onepixel_db < backup.sql

# Restore from gzip
gunzip < backup.sql.gz | mysql -u onepixel_user -p onepixel_db
```

---

## 🔄 DEPLOYMENT COMMANDS

### **Deploy via Script**
```bash
cd ~/1pixel/backend
./scripts/deploy.sh
```

### **Manual Deploy**
```bash
# Pull latest code
git pull origin main

# Install dependencies
npm ci --production

# Restart backend
pm2 restart 1pixel-backend
pm2 save

# Verify
curl http://localhost:3001/api/health
```

### **GitHub Actions Deploy**
```bash
# Just push!
git add .
git commit -m "Update features"
git push origin main

# GitHub Actions will automatically:
# - Pull code on hosting
# - Install dependencies
# - Restart PM2
```

---

## 🔍 DEBUGGING COMMANDS

### **Check System Status**
```bash
# Using script
./scripts/check-status.sh

# Manual checks
node -v
npm -v
pm2 -v
mysql --version
git --version
```

### **Check Backend Health**
```bash
# API health check
curl http://localhost:3001/api/health

# With verbose
curl -v http://localhost:3001/api/health

# Test endpoints
curl http://localhost:3001/api/hostings
curl http://localhost:3001/api/categories
```

### **Check Port Usage**
```bash
# See what's using port 3001
lsof -i :3001

# Kill process on port
lsof -ti:3001 | xargs kill -9

# Check all listening ports
netstat -tulpn | grep LISTEN
```

### **Check Processes**
```bash
# All node processes
ps aux | grep node

# 1Pixel processes
ps aux | grep 1pixel

# Kill by PID
kill -9 <PID>
```

---

## 🌐 WEB SERVER COMMANDS

### **Nginx**
```bash
# Test config
sudo nginx -t

# Reload
sudo systemctl reload nginx
sudo nginx -s reload

# Restart
sudo systemctl restart nginx

# Status
sudo systemctl status nginx

# View logs
sudo tail -f /var/log/nginx/access.log
sudo tail -f /var/log/nginx/error.log
```

### **Apache**
```bash
# Test config
sudo apachectl configtest

# Reload
sudo systemctl reload apache2

# Restart
sudo systemctl restart apache2

# Status
sudo systemctl status apache2

# View logs
sudo tail -f /var/log/apache2/access.log
sudo tail -f /var/log/apache2/error.log
```

---

## 🔐 SSL/HTTPS COMMANDS

### **Certbot (Let's Encrypt)**
```bash
# Install
sudo apt install certbot python3-certbot-nginx

# Get certificate (Nginx)
sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com

# Get certificate (Apache)
sudo certbot --apache -d yourdomain.com

# Renew all certificates
sudo certbot renew

# Test renewal
sudo certbot renew --dry-run

# List certificates
sudo certbot certificates

# Revoke certificate
sudo certbot revoke --cert-path /etc/letsencrypt/live/yourdomain.com/cert.pem
```

---

## 📁 FILE MANAGEMENT

### **Permissions**
```bash
# Fix all permissions
./scripts/fix-permissions.sh

# Manual fixes
chmod 755 scripts/*.sh      # Executable
chmod 600 .env              # Secure .env
chmod 644 *.js              # Regular files
chmod 755 */                # Directories
```

### **Find Files**
```bash
# Find .env files
find . -name ".env"

# Find large files (>10MB)
find . -type f -size +10M

# Find recently modified files
find . -type f -mtime -1
```

### **Disk Usage**
```bash
# Current directory
du -sh .

# All subdirectories
du -sh *

# Disk space
df -h

# Node modules size
du -sh node_modules
```

---

## 🔄 GIT COMMANDS

### **Basic Operations**
```bash
# Status
git status

# Add all changes
git add .

# Commit
git commit -m "Message"

# Push
git push origin main

# Pull latest
git pull origin main

# View history
git log --oneline -10
```

### **Deployment Related**
```bash
# Hard reset to latest
git fetch origin
git reset --hard origin/main

# Stash local changes
git stash
git pull
git stash pop

# Create deployment tag
git tag -a v2.0.0 -m "Version 2.0.0"
git push origin v2.0.0
```

---

## 🧪 TESTING COMMANDS

### **API Testing**
```bash
# Health check
curl http://localhost:3001/api/health

# GET request
curl http://localhost:3001/api/hostings

# POST request
curl -X POST http://localhost:3001/api/hostings \
  -H "Content-Type: application/json" \
  -d '{"name":"Test","domain":"test.com","provider":"Test","registrationDate":"2026-01-01","expirationDate":"2027-01-01","price":100000,"status":"active"}'

# PUT request
curl -X PUT http://localhost:3001/api/hostings/abc123 \
  -H "Content-Type: application/json" \
  -d '{"name":"Updated Name"}'

# DELETE request
curl -X DELETE http://localhost:3001/api/hostings/abc123
```

### **Database Testing**
```bash
# Count all records
mysql -u onepixel_user -p onepixel_db -e "
  SELECT 
    'hostings' as table_name, COUNT(*) as count FROM hostings
  UNION ALL
    SELECT 'projects', COUNT(*) FROM projects
  UNION ALL
    SELECT 'passwords', COUNT(*) FROM passwords
  UNION ALL
    SELECT 'categories', COUNT(*) FROM categories
  UNION ALL
    SELECT 'codex', COUNT(*) FROM codex
  UNION ALL
    SELECT 'logs', COUNT(*) FROM logs;
"
```

---

## 🛠️ MAINTENANCE COMMANDS

### **Clean Up**
```bash
# Remove node_modules
rm -rf node_modules
npm install --production

# Clear PM2 logs
pm2 flush

# Clear old backups (keep last 7 days)
find ~/backups/1pixel -name "*.sql.gz" -mtime +7 -delete

# Clean npm cache
npm cache clean --force
```

### **Updates**
```bash
# Update npm packages
npm update

# Check outdated packages
npm outdated

# Update PM2
npm install -g pm2@latest
pm2 update
```

---

## 📊 MONITORING COMMANDS

### **System Resources**
```bash
# CPU and memory
top

# Disk I/O
iostat

# Network
netstat -tulpn

# Process tree
pstree

# System info
uname -a
cat /etc/os-release
```

### **Application Monitoring**
```bash
# PM2 monit
pm2 monit

# Real-time logs
pm2 logs --raw

# Memory usage
pm2 list
ps aux | grep node

# API response time
time curl http://localhost:3001/api/health
```

---

## 🆘 EMERGENCY COMMANDS

### **Backend Down**
```bash
# Kill all node processes
pkill node

# Kill on specific port
lsof -ti:3001 | xargs kill -9

# Restart everything
pm2 delete all
pm2 start ecosystem.config.js
pm2 save
```

### **Database Issues**
```bash
# Restart MySQL
sudo systemctl restart mysql

# Check MySQL errors
sudo tail -100 /var/log/mysql/error.log

# Repair tables
mysql -u onepixel_user -p onepixel_db -e "REPAIR TABLE hostings;"
```

### **Quick Rollback**
```bash
# Rollback to previous commit
git log --oneline -5
git reset --hard <commit-hash>
pm2 restart 1pixel-backend
```

---

## 📋 DAILY OPERATIONS

```bash
# Morning check
pm2 status
curl http://localhost:3001/api/health
./scripts/check-status.sh

# Deploy update
git pull
npm ci --production
pm2 restart 1pixel-backend

# Backup
./scripts/backup-db.sh

# End of day
pm2 logs 1pixel-backend --lines 100 | grep ERROR
```

---

## 🎯 QUICK REFERENCE

| Task | Command |
|------|---------|
| Start backend | `pm2 start ecosystem.config.js` |
| View logs | `pm2 logs 1pixel-backend` |
| Restart | `pm2 restart 1pixel-backend` |
| Health check | `curl localhost:3001/api/health` |
| Backup DB | `./scripts/backup-db.sh` |
| Deploy | `./scripts/deploy.sh` |
| Check status | `./scripts/check-status.sh` |
| MySQL login | `mysql -u onepixel_user -p onepixel_db` |

---

**Made with 🦆 by 1Pixel Team**
