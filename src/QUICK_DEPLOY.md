# ⚡ QUICK DEPLOY - 1PIXEL (10 PHÚT)

## 🎯 COPY-PASTE COMMANDS

### **BƯỚC 1: Setup MySQL (2 phút)**

```bash
# SSH vào hosting
ssh your_username@your-hosting-ip

# Tạo database và user
mysql -u root -p
```

```sql
CREATE DATABASE onepixel_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE USER 'onepixel_user'@'localhost' IDENTIFIED BY 'YOUR_STRONG_PASSWORD';
GRANT ALL PRIVILEGES ON onepixel_db.* TO 'onepixel_user'@'localhost';
FLUSH PRIVILEGES;
EXIT;
```

```bash
# Test connection
mysql -u onepixel_user -p onepixel_db
# Nhập password → OK!
```

---

### **BƯỚC 2: Deploy Backend (3 phút)**

```bash
# Navigate to web directory
cd ~/domains/yourdomain.com/public_html
# Hoặc: cd /var/www/html

# Clone repository
git clone https://github.com/YOUR_USERNAME/1pixel.git
cd 1pixel/backend

# Make scripts executable
chmod +x scripts/*.sh

# Run setup script
./scripts/setup.sh

# Tạo .env
nano .env
```

**Paste vào file .env:**
```env
NODE_ENV=production
PORT=3001

DB_HOST=localhost
DB_USER=onepixel_user
DB_PASSWORD=YOUR_MYSQL_PASSWORD
DB_NAME=onepixel_db
DB_PORT=3306

CORS_ORIGIN=https://yourdomain.com,https://www.yourdomain.com
```

Lưu: `Ctrl+X` → `Y` → `Enter`

```bash
# Start với PM2
pm2 start ecosystem.config.js
pm2 startup
# Copy và run command
pm2 save

# Verify
pm2 status
curl http://localhost:3001/api/health
```

---

### **BƯỚC 3: GitHub Secrets (2 phút)**

**Vào:** `GitHub Repo → Settings → Secrets → New secret`

Thêm 5 secrets:

| Name | Value |
|------|-------|
| `SSH_HOST` | `your-hosting-ip` |
| `SSH_USERNAME` | `your-ssh-username` |
| `SSH_PASSWORD` | `your-ssh-password` |
| `SSH_PORT` | `22` |
| `DEPLOY_PATH` | `/home/user/1pixel` |

---

### **BƯỚC 4: Push & Deploy (1 phút)**

```bash
# Trên máy local
cd your-local-1pixel-project

git add .
git commit -m "🚀 Setup deployment"
git push origin main

# Xem deployment: GitHub → Actions
```

---

### **BƯỚC 5: Verify (2 phút)**

```bash
# SSH vào hosting
pm2 logs 1pixel-backend --lines 50

# Test API
curl http://localhost:3001/api/health
curl http://localhost:3001/api/hostings
curl http://localhost:3001/api/categories

# Check database
mysql -u onepixel_user -p onepixel_db -e "SHOW TABLES;"
```

---

## 🔧 USEFUL COMMANDS

### **PM2**
```bash
pm2 status                    # Xem status
pm2 logs 1pixel-backend       # Xem logs
pm2 restart 1pixel-backend    # Restart
pm2 monit                     # Monitoring dashboard
```

### **Deployment**
```bash
cd ~/1pixel/backend
./scripts/deploy.sh           # Manual deploy
```

### **Database Backup**
```bash
cd ~/1pixel/backend
./scripts/backup-db.sh        # Backup database
./scripts/restore-db.sh file  # Restore từ backup
```

### **MySQL**
```bash
mysql -u onepixel_user -p onepixel_db

# Trong MySQL:
SHOW TABLES;
SELECT * FROM categories;
SELECT * FROM hostings;
DESCRIBE projects;
```

---

## 🐛 QUICK FIX

**Backend không start:**
```bash
pm2 delete 1pixel-backend
pm2 start ecosystem.config.js
pm2 save
```

**Git pull failed:**
```bash
cd ~/1pixel
git reset --hard origin/main
git pull
```

**CORS error:**
```bash
nano backend/.env
# Thêm frontend domain vào CORS_ORIGIN
pm2 restart 1pixel-backend
```

**Database error:**
```bash
mysql -u onepixel_user -p onepixel_db
SHOW TABLES;
# Nếu rỗng → Backend tự tạo tables khi start
```

---

## ✅ SUCCESS CHECKLIST

- [ ] MySQL database: `onepixel_db` tạo thành công
- [ ] User MySQL: có quyền đầy đủ
- [ ] Backend start: `pm2 status` → online
- [ ] Health check: `/api/health` → success
- [ ] Database tables: 6 tables đã tạo
- [ ] GitHub Secrets: 5 secrets đã thêm
- [ ] Auto-deploy: push code → tự động deploy
- [ ] Frontend: gọi API thành công

---

## 📞 TROUBLESHOOTING

**Port 3001 đã bị chiếm:**
```bash
lsof -ti:3001 | xargs kill -9
pm2 restart 1pixel-backend
```

**MySQL connection refused:**
```bash
systemctl status mysql
sudo systemctl restart mysql
```

**PM2 không tự start sau reboot:**
```bash
pm2 startup
# Copy và run command
pm2 save
```

---

**Made with 🦆 | Total time: ~10 minutes**
