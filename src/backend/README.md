# 🦆 1Pixel Backend API - MySQL Edition

Backend API cho hệ thống quản lý 1Pixel với MySQL database.

## 📋 Tính Năng

- ✅ REST API với Express.js
- ✅ MySQL Database với auto-create schema
- ✅ CRUD operations cho 6 modules
- ✅ Auto-deployment với GitHub Actions
- ✅ PM2 process management
- ✅ CORS configuration
- ✅ Error handling

## 🚀 HƯỚNG DẪN DEPLOY (10 PHÚT)

### **BƯỚC 1: Setup MySQL trên Hosting (2 phút)**

1. **Login vào cPanel/DirectAdmin**
2. **Tạo MySQL Database:**
   - Tên database: `onepixel_db`
   - Username: `onepixel_user`
   - Password: [Tạo password mạnh]
   - Ghi nhớ: **host, username, password, database name**

3. **Kiểm tra MySQL đang chạy:**
   ```bash
   mysql -u onepixel_user -p
   SHOW DATABASES;
   # Nếu thấy onepixel_db => OK!
   ```

---

### **BƯỚC 2: Deploy Backend qua SSH (3 phút)**

1. **SSH vào hosting:**
   ```bash
   ssh username@your-hosting-ip
   ```

2. **Clone repository:**
   ```bash
   cd ~/domains/yourdomain.com/public_html  # Hoặc thư mục phù hợp
   git clone https://github.com/your-username/1pixel.git
   cd 1pixel/backend
   ```

3. **Tạo file .env:**
   ```bash
   cp .env.example .env
   nano .env
   ```
   
   **Cập nhật thông tin:**
   ```env
   NODE_ENV=production
   PORT=3001
   
   DB_HOST=localhost
   DB_USER=onepixel_user
   DB_PASSWORD=your_mysql_password
   DB_NAME=onepixel_db
   DB_PORT=3306
   
   CORS_ORIGIN=https://yourdomain.com,https://www.yourdomain.com
   ```
   
   Lưu: `Ctrl+X` → `Y` → `Enter`

4. **Install dependencies và start:**
   ```bash
   npm install --production
   npm install -g pm2
   pm2 start index.js --name 1pixel-backend
   pm2 startup
   pm2 save
   ```

5. **Kiểm tra server:**
   ```bash
   pm2 status
   curl http://localhost:3001/api/health
   ```
   
   Kết quả mong đợi:
   ```json
   {
     "success": true,
     "message": "1Pixel Backend API đang hoạt động",
     "version": "2.0.0",
     "database": "MySQL"
   }
   ```

---

### **BƯỚC 3: Configure GitHub Secrets (2 phút)**

1. **Vào GitHub Repository → Settings → Secrets and variables → Actions**

2. **Thêm các secrets sau:**

   | Secret Name | Value | Ví dụ |
   |------------|-------|-------|
   | `SSH_HOST` | IP hoặc domain hosting | `123.456.789.0` |
   | `SSH_USERNAME` | Username SSH | `root` hoặc `youruser` |
   | `SSH_PASSWORD` | Password SSH | `your_ssh_password` |
   | `SSH_PORT` | Port SSH | `22` |
   | `DEPLOY_PATH` | Đường dẫn project | `/home/user/1pixel` |

3. **Kiểm tra:**
   - Tất cả 5 secrets đã được thêm ✅
   - Không có khoảng trắng thừa ✅

---

### **BƯỚC 4: Push to GitHub → Auto-deploy! (1 phút)**

1. **Commit và push code:**
   ```bash
   git add .
   git commit -m "🚀 Setup auto-deployment"
   git push origin main
   ```

2. **Theo dõi deployment:**
   - Vào **GitHub → Actions tab**
   - Xem workflow "🦆 Deploy 1Pixel to Hosting"
   - Đợi ✅ màu xanh

3. **Lần sau chỉ cần:**
   ```bash
   git add .
   git commit -m "Update features"
   git push
   # 👆 Tự động deploy!
   ```

---

### **BƯỚC 5: Verify Hoạt Động (2 phút)**

1. **Kiểm tra Backend API:**
   ```bash
   # SSH vào hosting
   pm2 logs 1pixel-backend --lines 50
   
   # Test API
   curl http://localhost:3001/api/health
   curl http://localhost:3001/api/hostings
   ```

2. **Kiểm tra Database:**
   ```bash
   mysql -u onepixel_user -p onepixel_db
   
   SHOW TABLES;
   # Kết quả: categories, codex, hostings, logs, passwords, projects
   
   SELECT * FROM categories;
   # Có 1 row: "Chưa Phân Loại"
   ```

3. **Kiểm tra từ Frontend:**
   - Cập nhật `VITE_API_URL` trong frontend
   - Test CRUD operations
   - Kiểm tra Network tab trong DevTools

---

## 📡 API Endpoints

### Health Check
```
GET /api/health
```

### Modules
```
GET/POST/PUT/DELETE /api/hostings
GET/POST/PUT/DELETE /api/projects
GET/POST/PUT/DELETE /api/passwords
GET/POST/PUT/DELETE /api/categories
GET/POST/PUT/DELETE /api/codex
GET/POST        /api/logs
```

---

## 🔧 Quản Lý Server

### PM2 Commands
```bash
# Xem status
pm2 status

# Xem logs
pm2 logs 1pixel-backend

# Restart
pm2 restart 1pixel-backend

# Stop
pm2 stop 1pixel-backend

# Delete
pm2 delete 1pixel-backend
```

### Troubleshooting

**Lỗi: Cannot connect to MySQL**
```bash
# Kiểm tra MySQL đang chạy
systemctl status mysql

# Kiểm tra credentials trong .env
cat .env

# Test connection
mysql -u onepixel_user -p onepixel_db
```

**Lỗi: Port 3001 already in use**
```bash
# Kill process trên port 3001
lsof -ti:3001 | xargs kill -9

# Hoặc đổi PORT trong .env
```

**Lỗi: Git pull failed**
```bash
# Setup Git trên hosting
git config --global user.email "you@example.com"
git config --global user.name "Your Name"

# Reset nếu có conflict
git reset --hard origin/main
git pull
```

---

## 🎯 Checklist Deploy

- [ ] MySQL database đã tạo
- [ ] File .env đã cấu hình đúng
- [ ] PM2 đang chạy backend
- [ ] GitHub Secrets đã setup
- [ ] GitHub Actions workflow thành công
- [ ] Health check API trả về success
- [ ] Database tables đã tạo
- [ ] Frontend có thể gọi API

---

## 📞 Support

Nếu gặp vấn đề, kiểm tra:
1. PM2 logs: `pm2 logs 1pixel-backend`
2. MySQL logs: `tail -f /var/log/mysql/error.log`
3. GitHub Actions logs trong repo

---

**Made with 🦆 by 1Pixel Team**
