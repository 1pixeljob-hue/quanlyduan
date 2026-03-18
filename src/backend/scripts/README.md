# 🛠️ Backend Scripts

Tập hợp scripts tự động hóa cho deployment và maintenance.

---

## 📋 Available Scripts

| Script | Purpose | Usage |
|--------|---------|-------|
| `setup.sh` | Initial setup | `./scripts/setup.sh` |
| `deploy.sh` | Deploy updates | `./scripts/deploy.sh` |
| `backup-db.sh` | Backup database | `./scripts/backup-db.sh` |
| `restore-db.sh` | Restore database | `./scripts/restore-db.sh <file>` |
| `fix-permissions.sh` | Fix file permissions | `./scripts/fix-permissions.sh` |
| `check-status.sh` | System status check | `./scripts/check-status.sh` |

---

## 🚀 setup.sh

**Purpose:** Initial setup của backend trên hosting

**What it does:**
- Checks Node.js, MySQL client
- Installs dependencies
- Installs PM2 globally
- Creates .env from template
- Shows next steps

**Usage:**
```bash
cd backend
chmod +x scripts/setup.sh
./scripts/setup.sh
```

**When to use:**
- First time deploying
- Setting up on new server
- After fresh clone

---

## 🔄 deploy.sh

**Purpose:** Deploy code updates lên production

**What it does:**
- Pulls latest code from Git
- Installs dependencies
- Restarts PM2
- Runs health check
- Shows PM2 status

**Usage:**
```bash
cd backend
./scripts/deploy.sh
```

**When to use:**
- After git push
- Manual deployment
- Quick updates

---

## 💾 backup-db.sh

**Purpose:** Backup MySQL database

**What it does:**
- Creates SQL dump
- Compresses with gzip
- Saves to ~/backups/1pixel
- Deletes old backups (>7 days)
- Shows backup size

**Usage:**
```bash
cd backend
./scripts/backup-db.sh
```

**Output:**
```
~/backups/1pixel/1pixel_backup_20260318_120000.sql.gz
```

**When to use:**
- Before major changes
- Daily automated backups (cronjob)
- Before restore operations

---

## ♻️ restore-db.sh

**Purpose:** Restore database từ backup

**What it does:**
- Validates backup file
- Decompresses if needed
- Restores to database
- Asks to restart backend
- Cleans up temp files

**Usage:**
```bash
cd backend
./scripts/restore-db.sh ~/backups/1pixel/1pixel_backup_20260318_120000.sql.gz
```

**When to use:**
- After data corruption
- Testing with production data
- Rolling back changes

---

## 🔒 fix-permissions.sh

**Purpose:** Fix file và directory permissions

**What it does:**
- Sets directory permissions (755)
- Sets file permissions (644)
- Makes scripts executable (755)
- Secures .env file (600)
- Shows summary

**Usage:**
```bash
cd backend
./scripts/fix-permissions.sh
```

**When to use:**
- After file upload
- Permission errors
- Security hardening

---

## 🔍 check-status.sh

**Purpose:** Comprehensive system status check

**What it does:**
- Checks Node.js, npm, PM2
- Tests MySQL connection
- Verifies database tables
- Checks PM2 processes
- Tests API health
- Validates .env config
- Shows port status
- Reports disk & memory

**Usage:**
```bash
cd backend
./scripts/check-status.sh
```

**Output example:**
```
✓ Node.js: v18.19.0
✓ MySQL: Connection successful
✓ Database: All 6 tables exist
✓ PM2: 1pixel-backend is running
✓ API: Healthy
```

**When to use:**
- After deployment
- Troubleshooting issues
- Regular health checks
- Before major changes

---

## 🔧 Make Scripts Executable

```bash
cd backend
chmod +x scripts/*.sh
```

Or individually:
```bash
chmod +x scripts/setup.sh
chmod +x scripts/deploy.sh
chmod +x scripts/backup-db.sh
chmod +x scripts/restore-db.sh
chmod +x scripts/fix-permissions.sh
chmod +x scripts/check-status.sh
```

---

## 📋 Script Dependencies

### **Required:**
- bash shell
- Node.js & npm
- MySQL client
- PM2 (installed by setup.sh)

### **Optional:**
- git (for deploy.sh)
- curl (for health checks)
- gzip (for backup compression)

---

## 🎯 Common Workflows

### **Initial Setup**
```bash
./scripts/setup.sh
nano .env
pm2 start ecosystem.config.js
./scripts/check-status.sh
```

### **Daily Deploy**
```bash
git pull
./scripts/deploy.sh
```

### **Backup Before Changes**
```bash
./scripts/backup-db.sh
# Make changes
# If needed: ./scripts/restore-db.sh <backup-file>
```

### **Troubleshooting**
```bash
./scripts/check-status.sh
pm2 logs 1pixel-backend
./scripts/fix-permissions.sh
pm2 restart 1pixel-backend
```

---

## 🔄 Automation with Cron

### **Daily Backup**
```bash
crontab -e
```

Add:
```
# Daily backup at 2 AM
0 2 * * * /path/to/backend/scripts/backup-db.sh

# Weekly status check
0 9 * * 1 /path/to/backend/scripts/check-status.sh > /tmp/status.log
```

### **Auto-deploy (if not using GitHub Actions)**
```
# Every 5 minutes check for updates
*/5 * * * * cd /path/to/backend && git fetch && [ $(git rev-list HEAD...origin/main --count) != 0 ] && ./scripts/deploy.sh
```

---

## 📝 Script Logs

Scripts output to:
- **stdout** - Success messages, status
- **stderr** - Errors, warnings

**Capture logs:**
```bash
./scripts/check-status.sh > status.log 2>&1
./scripts/deploy.sh 2>&1 | tee deploy.log
```

---

## 🆘 Troubleshooting

### **Permission Denied**
```bash
chmod +x scripts/*.sh
./scripts/fix-permissions.sh
```

### **Script Not Found**
```bash
# Make sure you're in backend directory
cd backend
ls scripts/
```

### **MySQL Command Not Found**
```bash
# Install MySQL client
sudo apt install mysql-client
```

### **PM2 Not Found**
```bash
npm install -g pm2
# Or run setup script
./scripts/setup.sh
```

---

## 📚 Related Documentation

- [QUICK_DEPLOY.md](../../QUICK_DEPLOY.md) - Quick deployment guide
- [DEPLOY_GUIDE.md](../../DEPLOY_GUIDE.md) - Full deployment guide
- [COMMANDS_CHEATSHEET.md](../../COMMANDS_CHEATSHEET.md) - All commands
- [backend/README.md](../README.md) - Backend documentation

---

**Made with 🦆 by 1Pixel Team**
