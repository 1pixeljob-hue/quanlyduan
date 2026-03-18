# 🚀 HƯỚNG DẪN DEPLOY 1PIXEL - 10 PHÚT

## 📋 YÊU CẦU TRƯỚC KHI BẮT ĐẦU

- ✅ Hosting có cài Node.js (v18+)
- ✅ MySQL database
- ✅ SSH access
- ✅ Git installed trên hosting
- ✅ GitHub repository

---

## ⚡ QUICK START (10 PHÚT)

### **1️⃣ Setup MySQL trên Hosting (2 phút)**

#### **Cách 1: Qua cPanel/DirectAdmin**

1. Login vào control panel
2. MySQL Databases → Create New Database
3. Điền thông tin:
   ```
   Database Name: onepixel_db
   Username: onepixel_user
   Password: [Tạo password mạnh]
   ```
4. Assign user to database với ALL PRIVILEGES
5. **Ghi nhớ thông tin:**
   ```
   Host: localhost (hoặc IP MySQL server)
   Port: 3306
   Username: onepixel_user
   Password: your_password
   Database: onepixel_db
   ```

#### **Cách 2: Qua SSH (Command Line)**

```bash
# Login MySQL as root
mysql -u root -p

# Tạo database
CREATE DATABASE onepixel_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

# Tạo user
CREATE USER 'onepixel_user'@'localhost' IDENTIFIED BY 'your_strong_password';

# Cấp quyền
GRANT ALL PRIVILEGES ON onepixel_db.* TO 'onepixel_user'@'localhost';
FLUSH PRIVILEGES;

# Thoát
EXIT;

# Test connection
mysql -u onepixel_user -p onepixel_db
# Nhập password → Nếu vào được = OK!
```

---

### **2️⃣ Deploy Backend qua SSH (3 phút)**

```bash
# 1. SSH vào hosting
ssh your_username@your-hosting-ip

# 2. Navigate to web directory
cd ~/domains/yourdomain.com/public_html
# Hoặc: cd /var/www/html
# Hoặc: cd ~/htdocs

# 3. Clone repository
git clone https://github.com/your-username/1pixel.git
cd 1pixel/backend

# 4. Tạo file .env từ template
cp .env.example .env
nano .env

# 5. Cập nhật thông tin trong .env:
```

**File `.env` cần điền:**
```env
NODE_ENV=production
PORT=3001

DB_HOST=localhost
DB_USER=onepixel_user
DB_PASSWORD=your_mysql_password_here
DB_NAME=onepixel_db
DB_PORT=3306

CORS_ORIGIN=https://yourdomain.com,https://www.yourdomain.com
```

Lưu file: `Ctrl+X` → `Y` → `Enter`

```bash
# 6. Install dependencies
npm install --production

# 7. Install PM2 (nếu chưa có)
npm install -g pm2

# 8. Start backend với PM2
pm2 start index.js --name 1pixel-backend

# 9. Setup PM2 auto-start on reboot
pm2 startup
# Copy và run command mà PM2 hiển thị

pm2 save

# 10. Verify
pm2 status
curl http://localhost:3001/api/health
```

**Kết quả mong đợi:**
```json
{
  "success": true,
  "message": "1Pixel Backend API đang hoạt động",
  "timestamp": "2026-03-18T...",
  "version": "2.0.0",
  "database": "MySQL"
}
```

---

### **3️⃣ Configure GitHub Secrets (2 phút)**

1. **Vào GitHub repository của bạn**
2. **Settings → Secrets and variables → Actions → New repository secret**
3. **Thêm 5 secrets sau:**

#### **SSH_HOST**
```
Value: IP hoặc domain của hosting
Ví dụ: 123.45.67.89 hoặc ssh.yourhosting.com
```

#### **SSH_USERNAME**
```
Value: Username SSH của bạn
Ví dụ: root hoặc youruser
```

#### **SSH_PASSWORD**
```
Value: Password SSH của bạn
```

#### **SSH_PORT**
```
Value: Port SSH (thường là 22)
Ví dụ: 22
```

#### **DEPLOY_PATH**
```
Value: Đường dẫn tuyệt đối đến project
Ví dụ: /home/youruser/domains/yourdomain.com/public_html/1pixel
Hoặc: /var/www/html/1pixel
```

**✅ Kiểm tra:** Tất cả 5 secrets hiển thị trong danh sách

---

### **4️⃣ Push to GitHub → Auto Deploy! (1 phút)**

```bash
# Trên máy local
git add .
git commit -m "🚀 Initial deployment setup"
git push origin main
```

**Theo dõi deployment:**
1. Vào GitHub repository
2. Click tab **Actions**
3. Xem workflow "🦆 Deploy 1Pixel to Hosting"
4. Đợi đến khi có dấu ✅ màu xanh

**Từ giờ mỗi khi push code:**
```bash
git add .
git commit -m "Update features"
git push
# 👆 Tự động deploy lên hosting!
```

---

### **5️⃣ Verify Hoạt Động (2 phút)**

#### **A. Kiểm tra Backend**

```bash
# SSH vào hosting
ssh your_username@your-hosting-ip

# Xem PM2 status
pm2 status
# Kết quả: 1pixel-backend đang online ✅

# Xem logs
pm2 logs 1pixel-backend --lines 50

# Test API endpoints
curl http://localhost:3001/api/health
curl http://localhost:3001/api/hostings
curl http://localhost:3001/api/categories
```

#### **B. Kiểm tra Database**

```bash
mysql -u onepixel_user -p onepixel_db

# Trong MySQL console:
SHOW TABLES;
```

**Kết quả mong đợi:**
```
+------------------------+
| Tables_in_onepixel_db |
+------------------------+
| categories             |
| codex                  |
| hostings               |
| logs                   |
| passwords              |
| projects               |
+------------------------+
```

```sql
# Kiểm tra default data
SELECT * FROM categories;
# Phải có: "Chưa Phân Loại"

# Kiểm tra structure
DESCRIBE hostings;
DESCRIBE projects;

EXIT;
```

#### **C. Kiểm tra từ Frontend**

1. **Cập nhật frontend config:**
   ```typescript
   // /utils/api.ts hoặc .env
   VITE_API_URL=https://yourdomain.com/api
   # Hoặc nếu backend chạy riêng subdomain:
   VITE_API_URL=https://api.yourdomain.com
   ```

2. **Test CRUD operations:**
   - Thử thêm hosting mới
   - Kiểm tra Network tab → API calls
   - Verify data trong MySQL

---

## 🔧 SETUP NGINX/APACHE (Nếu Cần)

### **Nginx Reverse Proxy**

```nginx
# /etc/nginx/sites-available/1pixel

server {
    listen 80;
    server_name yourdomain.com www.yourdomain.com;

    # Frontend (static files)
    location / {
        root /home/user/1pixel/dist;
        try_files $uri $uri/ /index.html;
    }

    # Backend API
    location /api {
        proxy_pass http://localhost:3001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    }
}
```

```bash
# Enable site
sudo ln -s /etc/nginx/sites-available/1pixel /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx

# Setup SSL với Let's Encrypt
sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com
```

### **Apache .htaccess**

```apache
# /var/www/html/1pixel/.htaccess

RewriteEngine On

# API requests → Backend
RewriteCond %{REQUEST_URI} ^/api
RewriteRule ^(.*)$ http://localhost:3001/$1 [P,L]

# Frontend SPA
RewriteCond %{REQUEST_FILENAME} !-f
RewriteCond %{REQUEST_FILENAME} !-d
RewriteRule ^(.*)$ /index.html [L]
```

---

## 📊 MONITORING & LOGS

### **PM2 Commands**

```bash
# Xem status
pm2 status

# Xem logs realtime
pm2 logs 1pixel-backend

# Xem logs (50 dòng cuối)
pm2 logs 1pixel-backend --lines 50

# Xem error logs only
pm2 logs 1pixel-backend --err

# Restart
pm2 restart 1pixel-backend

# Stop
pm2 stop 1pixel-backend

# Delete
pm2 delete 1pixel-backend

# Monitoring dashboard
pm2 monit
```

### **MySQL Logs**

```bash
# Error logs
tail -f /var/log/mysql/error.log

# Query logs (nếu enable)
tail -f /var/log/mysql/query.log
```

---

## 🐛 TROUBLESHOOTING

### **Lỗi: Cannot connect to MySQL**

```bash
# 1. Kiểm tra MySQL đang chạy
systemctl status mysql
# Hoặc: service mysql status

# 2. Restart MySQL
sudo systemctl restart mysql

# 3. Kiểm tra credentials trong .env
cat backend/.env

# 4. Test MySQL connection
mysql -u onepixel_user -p onepixel_db
```

### **Lỗi: Port 3001 already in use**

```bash
# Xem process đang dùng port
lsof -ti:3001

# Kill process
lsof -ti:3001 | xargs kill -9

# Hoặc restart PM2
pm2 restart 1pixel-backend
```

### **Lỗi: Git pull failed in Actions**

```bash
# SSH vào hosting
cd /path/to/1pixel

# Setup Git
git config --global user.email "you@example.com"
git config --global user.name "Your Name"

# Reset hard nếu có conflict
git fetch origin
git reset --hard origin/main
git pull
```

### **Lỗi: CORS blocked**

```bash
# Cập nhật CORS_ORIGIN trong .env
nano backend/.env

# Thêm domain của frontend
CORS_ORIGIN=https://yourdomain.com,https://www.yourdomain.com,http://localhost:5173

# Restart
pm2 restart 1pixel-backend
```

### **Lỗi: 502 Bad Gateway**

```bash
# Kiểm tra backend đang chạy
pm2 status

# Xem logs
pm2 logs 1pixel-backend

# Restart
pm2 restart 1pixel-backend

# Kiểm tra Nginx config
sudo nginx -t
```

---

## ✅ DEPLOYMENT CHECKLIST

### **Pre-deployment**
- [ ] MySQL database đã tạo
- [ ] User MySQL có quyền đầy đủ
- [ ] Test connection MySQL thành công
- [ ] Node.js v18+ installed
- [ ] Git installed
- [ ] SSH access hoạt động

### **Backend Setup**
- [ ] Code đã clone về hosting
- [ ] File `.env` đã cấu hình đúng
- [ ] `npm install` thành công
- [ ] PM2 installed globally
- [ ] Backend start thành công với PM2
- [ ] API health check trả về success
- [ ] Database tables đã tạo
- [ ] Default category có trong DB

### **GitHub Actions**
- [ ] 5 GitHub Secrets đã thêm
- [ ] Workflow file exists
- [ ] First deployment thành công
- [ ] Auto-deploy on push hoạt động

### **Production**
- [ ] Frontend có thể gọi API
- [ ] CRUD operations hoạt động
- [ ] CORS không bị block
- [ ] SSL certificate (HTTPS) setup
- [ ] PM2 auto-start on reboot
- [ ] Monitoring setup

---

## 🎯 NEXT STEPS

1. **Setup SSL Certificate:**
   ```bash
   sudo certbot --nginx -d yourdomain.com
   ```

2. **Enable MySQL Backup:**
   ```bash
   # Tạo backup script
   mysqldump -u onepixel_user -p onepixel_db > backup_$(date +%Y%m%d).sql
   
   # Setup cronjob (daily backup)
   crontab -e
   # Thêm: 0 2 * * * /path/to/backup-script.sh
   ```

3. **Monitor Performance:**
   - Setup PM2 Plus: https://pm2.io
   - MySQL slow query log
   - Nginx access logs

4. **Security Hardening:**
   - Change default MySQL port
   - Firewall rules
   - Fail2ban cho SSH
   - Regular updates

---

## 📞 SUPPORT

Nếu gặp vấn đề không giải quyết được:

1. **Kiểm tra logs:**
   - PM2: `pm2 logs 1pixel-backend`
   - MySQL: `tail -f /var/log/mysql/error.log`
   - Nginx: `tail -f /var/log/nginx/error.log`
   - GitHub Actions: Repository → Actions tab

2. **Test từng bước:**
   - MySQL connection
   - Backend API health
   - Frontend → Backend connection
   - CORS headers

3. **Verify config files:**
   - `/backend/.env`
   - GitHub Secrets
   - Nginx/Apache config

---

**Made with 🦆 by 1Pixel Team | Deploy time: ~10 minutes**
