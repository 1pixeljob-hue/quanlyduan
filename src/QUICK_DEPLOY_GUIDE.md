# ⚡ 1Pixel - Quick Deploy Guide

Hướng dẫn nhanh để deploy hệ thống 1Pixel từ đầu đến cuối trong 10 phút.

---

## 🎯 Tổng Quan

```
Local Dev → Push to GitHub → Auto Deploy → Production Live! 🚀
```

---

## 📋 Checklist Trước Khi Bắt Đầu

- [ ] MySQL database trên hosting đã sẵn sàng
- [ ] Hosting có Node.js (>= 18) và SSH access
- [ ] GitHub account
- [ ] FTP/SSH credentials của hosting

---

## 🚀 Deploy trong 10 Phút

### 1️⃣ Setup MySQL (2 phút)

```bash
# SSH vào hosting
ssh username@your-server.com

# Tạo database (hoặc qua cPanel)
mysql -u root -p
CREATE DATABASE onepixel_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE USER 'onepixel_user'@'localhost' IDENTIFIED BY 'StrongPass123!';
GRANT ALL PRIVILEGES ON onepixel_db.* TO 'onepixel_user'@'localhost';
FLUSH PRIVILEGES;
EXIT;
```

✅ Lưu lại:
- DB_HOST: `localhost`
- DB_USER: `onepixel_user`
- DB_PASSWORD: `StrongPass123!`
- DB_NAME: `onepixel_db`

---

### 2️⃣ Deploy Backend (3 phút)

```bash
# Clone repo (hoặc upload qua FTP)
cd /home/username/
git clone https://github.com/yourusername/1pixel.git
cd 1pixel/backend

# Tạo .env
nano .env
```

Paste vào file `.env`:
```env
DB_HOST=localhost
DB_USER=onepixel_user
DB_PASSWORD=StrongPass123!
DB_NAME=onepixel_db
DB_PORT=3306
PORT=3001
NODE_ENV=production
CORS_ORIGIN=https://onetask.1pixel.vn,http://localhost:5173
```

Lưu: `Ctrl+O`, `Enter`, `Ctrl+X`

```bash
# Cài đặt và chạy
npm install --production
npm install -g pm2
pm2 start index.js --name "1pixel-backend"
pm2 save
pm2 startup
# Copy và chạy lệnh được suggest

# Kiểm tra
pm2 status
curl http://localhost:3001/api/health
```

✅ Backend URL: `https://api.onetask.1pixel.vn` (hoặc `https://yourdomain.com:3001`)

---

### 3️⃣ Setup GitHub Repository (2 phút)

```bash
# Tại máy local
cd /path/to/1pixel

# Init git (nếu chưa có)
git init
git add .
git commit -m "Initial commit: 1Pixel System"

# Tạo repo trên GitHub, sau đó:
git remote add origin https://github.com/yourusername/1pixel.git
git branch -M main
git push -u origin main
```

---

### 4️⃣ Configure GitHub Secrets (2 phút)

Vào GitHub repository → **Settings** → **Secrets and variables** → **Actions**

Thêm secrets:

| Secret Name | Value |
|------------|-------|
| `VITE_API_URL` | `https://api.onetask.1pixel.vn/api` |
| `FTP_SERVER` | `ftp.your-hosting.com` |
| `FTP_USERNAME` | `username@yourdomain.com` |
| `FTP_PASSWORD` | `your_ftp_password` |
| `FTP_SERVER_DIR` | `/public_html/` |

---

### 5️⃣ Auto-Deploy Frontend (1 phút)

```bash
# Tại máy local
# File .github/workflows/deploy.yml đã có sẵn

# Chỉ cần push để trigger deploy
git add .
git commit -m "Setup auto-deploy"
git push origin main
```

Vào GitHub → **Actions** tab → Xem workflow đang chạy

✅ Deploy xong: Truy cập `https://onetask.1pixel.vn`

---

## ✅ Verify Deployment

### Check Backend
```bash
curl https://api.onetask.1pixel.vn/api/health
```

Response:
```json
{
  "success": true,
  "message": "1Pixel Backend API đang hoạt động",
  "version": "2.0.0"
}
```

### Check Frontend
1. Truy cập `https://onetask.1pixel.vn`
2. Login: `quydev` / `Spencil@123`
3. Vào **Settings** → **Debug Panel**
4. Click **Kiểm tra kết nối** → Tất cả phải ✅

### Test CRUD
1. Thêm hosting mới
2. Xem trong **Dashboard**
3. Kiểm tra **Logs** → Phải có log `create`

---

## 🔄 Quy Trình Deploy Tiếp Theo

Sau khi setup xong, mỗi lần update code:

```bash
# Local development
npm run dev
# Test thay đổi tại http://localhost:5173

# Commit và push
git add .
git commit -m "Feature: Thêm tính năng mới"
git push origin main

# GitHub Actions tự động deploy!
# Chờ 1-2 phút, refresh browser → Thấy thay đổi
```

---

## 🎨 Next Steps

### Cấu hình Domain

**Option 1: Subdomain cho API**

DNS A Record:
```
api.onetask.1pixel.vn → IP của hosting
```

Nginx config:
```nginx
server {
    listen 80;
    server_name api.onetask.1pixel.vn;
    
    location / {
        proxy_pass http://localhost:3001;
        proxy_set_header Host $host;
    }
}
```

**Option 2: Dùng port**

Frontend `.env`:
```env
VITE_API_URL=https://onetask.1pixel.vn:3001/api
```

Mở port 3001 trên firewall.

### Enable SSL (Let's Encrypt)

```bash
# Cài Certbot
sudo apt install certbot python3-certbot-nginx

# Generate SSL
sudo certbot --nginx -d onetask.1pixel.vn -d api.onetask.1pixel.vn

# Auto-renewal
sudo certbot renew --dry-run
```

### Google Calendar Integration

Xem file: `GOOGLE_CALENDAR_SETUP.md`

---

## 🐛 Common Issues

### Issue 1: Frontend blank page

**Fix**:
```bash
# Check browser console
# Likely CORS or API URL wrong

# Verify backend
curl https://api-url/api/health

# Verify VITE_API_URL in GitHub Secrets
```

### Issue 2: Backend not starting

**Fix**:
```bash
pm2 logs 1pixel-backend --lines 50

# Common issues:
# - MySQL connection failed → Check .env
# - Port already in use → Change PORT in .env
# - Missing dependencies → npm install
```

### Issue 3: Deploy failed on GitHub Actions

**Fix**:
- Go to Actions tab → Click failed run → View logs
- Common: Wrong FTP credentials
- Fix: Update Secrets in GitHub Settings

---

## 📊 Architecture

```
┌─────────────────┐
│   User Browser  │
└────────┬────────┘
         │ HTTPS
         ▼
┌─────────────────┐
│  Frontend (React)│  ← GitHub Actions Deploy via FTP
│  onetask.1pixel.vn│
└────────┬────────┘
         │ API Calls
         ▼
┌─────────────────┐
│ Backend (Node.js)│  ← PM2 Process Manager
│ api.onetask.1pixel.vn│
└────────┬────────┘
         │ SQL Queries
         ▼
┌─────────────────┐
│  MySQL Database │  ← Auto-create tables on startup
│  onepixel_db    │
└─────────────────┘
```

---

## 📞 Need Help?

**Backend không chạy**: `pm2 logs 1pixel-backend`  
**Frontend lỗi**: Browser Console (F12)  
**Deploy thất bại**: GitHub Actions logs  
**Database lỗi**: `mysql -u user -p -h host database_name`

---

**Total Setup Time**: ~10 phút  
**Future Deploys**: Chỉ cần `git push` (30 giây)  
**Auto-Deploy**: GitHub Actions  
**Zero-Downtime**: PM2 restart

🎉 **Chúc mừng! Hệ thống 1Pixel đã sẵn sàng!**
