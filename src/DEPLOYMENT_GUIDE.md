# 🚀 1Pixel - Deployment Guide

## 📋 Tổng Quan

Hệ thống 1Pixel sử dụng:
- **Frontend**: React + Vite (Deploy trên hosting qua GitHub Actions)
- **Backend**: Node.js + Express (Deploy trên hosting có Node.js)
- **Database**: MySQL
- **CI/CD**: GitHub Actions (Auto-deploy khi push code)

---

## ⚙️ Cấu Hình Hệ Thống

### 🗄️ Bước 1: Setup MySQL Database

#### Tạo MySQL Database trên Hosting

1. Truy cập **cPanel** hoặc **Hosting Control Panel**
2. Vào phần **MySQL Databases**
3. Tạo database mới:
   ```
   Database name: onepixel_db
   ```
4. Tạo user MySQL và gán quyền đầy đủ (ALL PRIVILEGES)
5. Lưu lại thông tin:
   - **DB_HOST**: Thường là `localhost` (hoặc IP của MySQL server)
   - **DB_USER**: Username vừa tạo
   - **DB_PASSWORD**: Password vừa tạo
   - **DB_NAME**: `onepixel_db`
   - **DB_PORT**: `3306` (mặc định)

#### Tạo MySQL Local (Development)

```bash
# Ubuntu/Debian
sudo apt-get install mysql-server

# macOS
brew install mysql

# Tạo database
mysql -u root -p
CREATE DATABASE onepixel_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE USER 'onepixel_user'@'localhost' IDENTIFIED BY 'your_password';
GRANT ALL PRIVILEGES ON onepixel_db.* TO 'onepixel_user'@'localhost';
FLUSH PRIVILEGES;
EXIT;
```

---

### 🔧 Bước 2: Cấu Hình Backend

#### 2.1. Tạo file `.env` trong `/backend`

```env
# Database Configuration
DB_HOST=localhost
DB_USER=onepixel_user
DB_PASSWORD=your_strong_password
DB_NAME=onepixel_db
DB_PORT=3306

# Server Configuration
PORT=3001
NODE_ENV=production

# CORS - Domain frontend của bạn
CORS_ORIGIN=https://onetask.1pixel.vn,http://localhost:5173

# Email Configuration (Optional)
# RESEND_API_KEY=re_your_api_key_here
# SMTP_HOST=smtp.gmail.com
# SMTP_PORT=587
# SMTP_USER=your-email@gmail.com
# SMTP_PASS=your-app-password
```

#### 2.2. Cài đặt Dependencies (Local Test)

```bash
cd backend
npm install
npm start
# Server chạy tại http://localhost:3001
```

---

### 🌐 Bước 3: Deploy Backend lên Hosting

#### 3.1. Chuẩn Bị Hosting

Hosting cần có:
- ✅ **Node.js** (>= 18.0.0)
- ✅ **MySQL** (>= 5.7 hoặc 8.0)
- ✅ **SSH Access**
- ✅ **PM2** (hoặc process manager khác)

#### 3.2. Upload Backend Code

**Option 1: Qua Git (Recommended)**

```bash
# Trên server
cd /home/username/
git clone https://github.com/yourusername/1pixel.git
cd 1pixel/backend
npm install --production
```

**Option 2: Qua FTP/SFTP**

- Upload thư mục `/backend` lên hosting
- Đường dẫn ví dụ: `/home/username/1pixel/backend`

#### 3.3. Cấu Hình Backend trên Server

1. **SSH vào server**:
   ```bash
   ssh username@your-hosting-server.com
   cd /path/to/backend
   ```

2. **Tạo file `.env` production**:
   ```bash
   nano .env
   # Paste nội dung .env như Bước 2.1
   # Lưu: Ctrl + O, Enter, Ctrl + X
   ```

3. **Cài đặt dependencies**:
   ```bash
   npm install --production
   ```

4. **Khởi động với PM2**:
   ```bash
   # Cài PM2 (nếu chưa có)
   npm install -g pm2

   # Start app
   pm2 start index.js --name "1pixel-backend"
   
   # Lưu cấu hình
   pm2 save
   
   # Auto-start khi server reboot
   pm2 startup
   # Copy và chạy lệnh được suggest
   ```

5. **Kiểm tra status**:
   ```bash
   pm2 status
   pm2 logs 1pixel-backend
   ```

#### 3.4. Lưu Backend URL

Ví dụ:
```
https://api.onetask.1pixel.vn
hoặc
https://onetask.1pixel.vn:3001
```

**Lưu ý**: Nếu dùng subdomain `api.onetask.1pixel.vn`, cần cấu hình:
- DNS A record trỏ về IP server
- Nginx/Apache reverse proxy để forward request đến port 3001

---

### 💻 Bước 4: Cấu Hình Frontend

#### 4.1. Tạo file `.env` ở root project

```env
VITE_API_URL=https://api.onetask.1pixel.vn/api
```

**Ví dụ khác:**
```env
# Local development
VITE_API_URL=http://localhost:3001/api

# Production với port
VITE_API_URL=https://onetask.1pixel.vn:3001/api
```

#### 4.2. Test Local

```bash
npm install
npm run dev
# Frontend chạy tại http://localhost:5173
```

---

### 🚀 Bước 5: Deploy Frontend với GitHub Actions

#### 5.1. Cấu Hình GitHub Repository

1. **Tạo GitHub Repository** (nếu chưa có):
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin https://github.com/yourusername/1pixel.git
   git push -u origin main
   ```

2. **Thêm Secrets vào GitHub**:
   - Vào repository trên GitHub
   - **Settings** → **Secrets and variables** → **Actions**
   - Thêm secrets:
     - `VITE_API_URL`: `https://api.onetask.1pixel.vn/api`
     - `FTP_SERVER`: `ftp.your-hosting.com` (nếu dùng FTP deploy)
     - `FTP_USERNAME`: `your_ftp_user`
     - `FTP_PASSWORD`: `your_ftp_password`
     - `SSH_PRIVATE_KEY`: SSH key (nếu dùng SSH deploy)

#### 5.2. Tạo GitHub Actions Workflow

Tạo file `.github/workflows/deploy.yml`:

```yaml
name: Deploy to Hosting

on:
  push:
    branches:
      - main

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    
    steps:
      - name: Checkout code
        uses: actions/checkout@v3

      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'

      - name: Install dependencies
        run: npm install

      - name: Build project
        env:
          VITE_API_URL: ${{ secrets.VITE_API_URL }}
        run: npm run build

      - name: Deploy to Hosting via FTP
        uses: SamKirkland/FTP-Deploy-Action@4.3.3
        with:
          server: ${{ secrets.FTP_SERVER }}
          username: ${{ secrets.FTP_USERNAME }}
          password: ${{ secrets.FTP_PASSWORD }}
          local-dir: ./dist/
          server-dir: /public_html/

      # Hoặc deploy via SSH (thay thế FTP bước trên)
      # - name: Deploy to Hosting via SSH
      #   uses: appleboy/scp-action@master
      #   with:
      #     host: ${{ secrets.SSH_HOST }}
      #     username: ${{ secrets.SSH_USERNAME }}
      #     key: ${{ secrets.SSH_PRIVATE_KEY }}
      #     source: "dist/*"
      #     target: "/home/username/public_html"
```

#### 5.3. Auto-Deploy Backend (Optional)

Để auto-deploy backend khi có thay đổi, thêm job vào workflow:

```yaml
  deploy-backend:
    runs-on: ubuntu-latest
    needs: build-and-deploy
    
    steps:
      - name: Deploy Backend via SSH
        uses: appleboy/ssh-action@master
        with:
          host: ${{ secrets.SSH_HOST }}
          username: ${{ secrets.SSH_USERNAME }}
          key: ${{ secrets.SSH_PRIVATE_KEY }}
          script: |
            cd /path/to/backend
            git pull origin main
            npm install --production
            pm2 restart 1pixel-backend
```

#### 5.4. Push và Auto-Deploy

```bash
git add .
git commit -m "Add deployment workflow"
git push origin main
```

GitHub Actions sẽ tự động:
1. Build frontend với `VITE_API_URL`
2. Upload file build lên hosting
3. (Optional) Pull và restart backend

---

### 🔒 Bước 6: Cấu Hình CORS

Trong `/backend/index.js`, CORS đã được cấu hình qua biến môi trường:

```javascript
// File .env
CORS_ORIGIN=https://onetask.1pixel.vn,http://localhost:5173
```

Nếu cần thêm domain:
```env
CORS_ORIGIN=https://onetask.1pixel.vn,https://www.onetask.1pixel.vn,http://localhost:5173
```

---

### ✅ Bước 7: Kiểm Tra Hệ Thống

1. **Test Backend API**:
   ```bash
   curl https://api.onetask.1pixel.vn/api/health
   ```
   Response:
   ```json
   {
     "success": true,
     "message": "1Pixel Backend API đang hoạt động",
     "version": "2.0.0",
     "database": "MySQL"
   }
   ```

2. **Test Frontend**:
   - Truy cập `https://onetask.1pixel.vn`
   - Đăng nhập: `quydev` / `Spencil@123`
   - Vào **Settings** → **Debug Panel**
   - Click **Kiểm tra kết nối**

3. **Test CRUD Operations**:
   - Thêm hosting mới
   - Sửa, xóa hosting
   - Kiểm tra logs

---

## 🔧 Cấu Hình Nginx/Apache (Optional)

### Nginx Reverse Proxy cho Backend

```nginx
server {
    listen 80;
    server_name api.onetask.1pixel.vn;

    location / {
        proxy_pass http://localhost:3001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

### Apache .htaccess cho Frontend

File `/public_html/.htaccess`:

```apache
<IfModule mod_rewrite.c>
  RewriteEngine On
  RewriteBase /
  RewriteRule ^index\.html$ - [L]
  RewriteCond %{REQUEST_FILENAME} !-f
  RewriteCond %{REQUEST_FILENAME} !-d
  RewriteRule . /index.html [L]
</IfModule>
```

---

## 🐛 Troubleshooting

### Lỗi kết nối Database
```
Error: ER_ACCESS_DENIED_ERROR
```
**Giải pháp**: Kiểm tra `DB_USER`, `DB_PASSWORD` trong `.env`

### GitHub Actions Deploy thất bại
**Giải pháp**:
- Kiểm tra Secrets đã được thêm chưa
- Xem logs trong tab Actions của GitHub
- Verify FTP/SSH credentials

### Backend không khởi động sau deploy
```bash
pm2 logs 1pixel-backend --lines 100
```
**Giải pháp**: 
- Kiểm tra file `.env` có đúng không
- Verify MySQL connection
- Restart PM2: `pm2 restart 1pixel-backend`

### CORS Error
```
Access to fetch has been blocked by CORS policy
```
**Giải pháp**: Thêm domain frontend vào `CORS_ORIGIN` trong backend `.env`

---

## 📊 Workflow Tổng Quan

```
Developer → Git Push → GitHub Actions
                             ↓
                    Build Frontend (với VITE_API_URL)
                             ↓
                    Deploy to Hosting (FTP/SSH)
                             ↓
                    (Optional) Restart Backend
                             ↓
                    ✅ Live trên Production
```

---

## 🎯 Checklist Triển Khai

### Backend
- [ ] MySQL database đã được tạo trên hosting
- [ ] File `.env` trong `/backend` đã được cấu hình
- [ ] Backend code đã upload lên server
- [ ] Dependencies đã được cài: `npm install --production`
- [ ] PM2 đã start app: `pm2 start index.js`
- [ ] Backend URL có thể truy cập (test `/api/health`)

### Frontend
- [ ] File `.env` với `VITE_API_URL` đã được tạo
- [ ] GitHub repository đã được tạo
- [ ] Secrets đã được thêm vào GitHub
- [ ] Workflow file `.github/workflows/deploy.yml` đã được tạo
- [ ] Push code lên GitHub và workflow chạy thành công
- [ ] Frontend có thể truy cập được

### Testing
- [ ] Debug Panel hiển thị kết nối thành công
- [ ] CRUD operations (Thêm/Sửa/Xóa) hoạt động
- [ ] Logs được ghi lại chính xác
- [ ] Google Calendar sync hoạt động (nếu dùng)

---

## 📝 Notes

1. **Admin mặc định**: `quydev` / `Spencil@123`
2. **Auto-deploy**: Chỉ cần `git push` là GitHub Actions sẽ tự động deploy
3. **Database Tables**: Tự động tạo khi backend khởi động lần đầu
4. **Environment Variables**: 
   - Frontend: `.env` với `VITE_API_URL`
   - Backend: `.env` với DB config
   - GitHub: Secrets cho auto-deploy
5. **KHÔNG commit** các file `.env` lên Git (đã có trong `.gitignore`)

---

## 📞 Hỗ Trợ

Nếu gặp vấn đề:
1. Kiểm tra logs:
   - Frontend: Browser Console (F12)
   - Backend: `pm2 logs 1pixel-backend`
   - GitHub Actions: Tab Actions trên GitHub
2. Test endpoints:
   - Backend health: `GET /api/health`
   - Frontend Debug Panel: Settings → Debug
3. Verify connections:
   - MySQL: `mysql -u username -p -h host database_name`
   - Backend API: `curl https://api.url/api/health`

---

**Version**: 2.0.0 - MySQL Backend với GitHub Actions  
**Date**: 18/03/2026  
**Team**: 1Pixel  
**Deployment**: Auto via GitHub Actions
