# 🎨 Frontend Setup Guide

## 📋 Cấu Hình Frontend Để Connect Backend MySQL

Sau khi deploy backend MySQL, bạn cần cập nhật frontend để connect đến API mới.

---

## ⚡ QUICK SETUP

### **1. Cập nhật Environment Variable**

Tạo hoặc update file `.env` ở root project:

```bash
# Development (local)
VITE_API_URL=http://localhost:3001/api

# Production (sau khi deploy backend)
# VITE_API_URL=https://api.yourdomain.com/api
# Hoặc nếu cùng domain:
# VITE_API_URL=https://yourdomain.com/api
```

**Lưu ý:** Restart dev server sau khi thay đổi `.env`:
```bash
# Stop server (Ctrl+C)
npm run dev
```

---

### **2. Kiểm Tra File `/utils/api.ts`**

File này đã được cấu hình để sử dụng `VITE_API_URL`:

```typescript
// /utils/api.ts
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

export const api = {
  // Health check
  health: async () => {
    const response = await fetch(`${API_BASE_URL}/health`);
    return response.json();
  },
  
  // Hostings
  getHostings: async () => {
    const response = await fetch(`${API_BASE_URL}/hostings`);
    return response.json();
  },
  
  // ... các endpoints khác
};
```

✅ **Không cần sửa gì** - File đã ready!

---

### **3. Test Connection**

#### **Development (Local Backend)**

```bash
# Terminal 1: Start backend
cd backend
npm start

# Terminal 2: Start frontend
npm run dev
```

Truy cập: `http://localhost:5173`

#### **Production (Remote Backend)**

Update `.env`:
```env
VITE_API_URL=https://api.yourdomain.com/api
```

Build và deploy:
```bash
npm run build
# Deploy dist/ folder lên hosting
```

---

## 🔧 TROUBLESHOOTING

### **Lỗi: CORS blocked**

**Nguyên nhân:** Backend chưa cho phép frontend domain

**Giải pháp:**

1. **Cập nhật backend `.env`:**
   ```bash
   ssh username@hosting
   cd ~/1pixel/backend
   nano .env
   ```

2. **Thêm frontend domain vào CORS_ORIGIN:**
   ```env
   CORS_ORIGIN=https://yourdomain.com,https://www.yourdomain.com,http://localhost:5173
   ```

3. **Restart backend:**
   ```bash
   pm2 restart 1pixel-backend
   ```

---

### **Lỗi: API calls return 404**

**Nguyên nhân:** Wrong API URL

**Kiểm tra:**

1. **Frontend .env:**
   ```bash
   cat .env
   # Phải có: VITE_API_URL=...
   ```

2. **Test backend trực tiếp:**
   ```bash
   curl https://api.yourdomain.com/api/health
   # Phải trả về: {"success": true, ...}
   ```

3. **Check browser DevTools:**
   - F12 → Network tab
   - Xem request URL có đúng không
   - Check response status code

---

### **Lỗi: Cannot read properties of undefined**

**Nguyên nhân:** API response structure khác với expected

**Giải pháp:**

1. **Check API response format:**
   ```bash
   curl https://api.yourdomain.com/api/hostings
   ```

2. **Expected format:**
   ```json
   {
     "success": true,
     "data": [
       {
         "id": "...",
         "name": "...",
         // ... hosting fields
       }
     ]
   }
   ```

3. **Update frontend code nếu cần** (thường không cần nếu dùng đúng `/utils/api.ts`)

---

## 📡 API ENDPOINTS REFERENCE

### **Base URL**
```
Development: http://localhost:3001/api
Production:  https://yourdomain.com/api
```

### **Available Endpoints**

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/health` | GET | Health check |
| `/hostings` | GET | Get all hostings |
| `/hostings` | POST | Create hosting |
| `/hostings/:id` | PUT | Update hosting |
| `/hostings/:id` | DELETE | Delete hosting |
| `/projects` | GET | Get all projects |
| `/projects` | POST | Create project |
| `/projects/:id` | PUT | Update project |
| `/projects/:id` | DELETE | Delete project |
| `/passwords` | GET | Get all passwords |
| `/passwords` | POST | Create password |
| `/passwords/:id` | PUT | Update password |
| `/passwords/:id` | DELETE | Delete password |
| `/categories` | GET | Get all categories |
| `/categories` | POST | Create category |
| `/categories/:id` | PUT | Update category |
| `/categories/:id` | DELETE | Delete category |
| `/codex` | GET | Get all code snippets |
| `/codex` | POST | Create snippet |
| `/codex/:id` | PUT | Update snippet |
| `/codex/:id` | DELETE | Delete snippet |
| `/logs` | GET | Get activity logs |
| `/logs` | POST | Create log entry |

---

## 🔄 DEVELOPMENT WORKFLOW

### **Local Development**

1. **Start backend:**
   ```bash
   cd backend
   npm run dev  # hoặc: nodemon index.js
   ```

2. **Start frontend:**
   ```bash
   # Terminal mới
   npm run dev
   ```

3. **Access:**
   - Frontend: `http://localhost:5173`
   - Backend: `http://localhost:3001`

4. **Test API:**
   ```bash
   curl http://localhost:3001/api/health
   ```

---

### **Production Deployment**

#### **Backend (đã deploy rồi):**
```bash
# SSH to hosting
pm2 status
pm2 logs 1pixel-backend
```

#### **Frontend:**

1. **Update `.env` for production:**
   ```env
   VITE_API_URL=https://yourdomain.com/api
   ```

2. **Build:**
   ```bash
   npm run build
   # Output: dist/
   ```

3. **Deploy dist/ folder:**
   - FTP upload
   - rsync
   - Git push (GitHub Actions tự deploy)

---

## 🎯 TESTING CHECKLIST

### **Backend API**

- [ ] Health check works: `curl .../api/health`
- [ ] Get hostings works: `curl .../api/hostings`
- [ ] Get categories works: `curl .../api/categories`
- [ ] CORS headers present
- [ ] Response format correct

### **Frontend Connection**

- [ ] `.env` có `VITE_API_URL`
- [ ] Dev server restart sau khi update .env
- [ ] Browser console không có CORS errors
- [ ] Network tab shows correct API URL
- [ ] API calls return data

### **Functionality**

- [ ] Login works (quydev / Spencil@123)
- [ ] Dashboard loads data
- [ ] Hosting module CRUD works
- [ ] Project module CRUD works
- [ ] Password module CRUD works
- [ ] CodeX module CRUD works
- [ ] Categories load and create works
- [ ] Activity logs recorded

---

## 🚀 GITHUB ACTIONS SETUP (Optional)

Nếu muốn auto-deploy frontend khi push code:

### **1. Tạo GitHub Secrets**

**Settings → Secrets → Actions → New secret:**

| Name | Value |
|------|-------|
| `VITE_API_URL` | `https://yourdomain.com/api` |
| `FTP_SERVER` | `ftp.yourdomain.com` |
| `FTP_USERNAME` | `your_ftp_username` |
| `FTP_PASSWORD` | `your_ftp_password` |

### **2. Create Workflow File**

`.github/workflows/deploy-frontend.yml`:

```yaml
name: 🎨 Deploy Frontend

on:
  push:
    branches: [main, master]
  workflow_dispatch:

jobs:
  deploy:
    runs-on: ubuntu-latest
    
    steps:
      - name: Checkout
        uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Build
        env:
          VITE_API_URL: ${{ secrets.VITE_API_URL }}
        run: npm run build
      
      - name: Deploy to FTP
        uses: SamKirkland/FTP-Deploy-Action@v4.3.4
        with:
          server: ${{ secrets.FTP_SERVER }}
          username: ${{ secrets.FTP_USERNAME }}
          password: ${{ secrets.FTP_PASSWORD }}
          local-dir: ./dist/
          server-dir: /public_html/
```

### **3. Push to GitHub**

```bash
git add .
git commit -m "Setup auto-deploy frontend"
git push origin main

# GitHub Actions sẽ tự động:
# 1. Build frontend với VITE_API_URL
# 2. Deploy lên hosting qua FTP
```

---

## 📝 ENVIRONMENT VARIABLES SUMMARY

### **Development**

```env
# .env (local)
VITE_API_URL=http://localhost:3001/api
```

### **Production**

```env
# .env.production hoặc GitHub Secrets
VITE_API_URL=https://yourdomain.com/api
```

### **Multiple Environments**

```bash
# .env.development
VITE_API_URL=http://localhost:3001/api

# .env.staging
VITE_API_URL=https://staging.yourdomain.com/api

# .env.production
VITE_API_URL=https://yourdomain.com/api
```

Build for specific env:
```bash
npm run build -- --mode production
npm run build -- --mode staging
```

---

## 🔐 SECURITY NOTES

### **1. Don't Commit Sensitive Data**

```bash
# .gitignore should have:
.env
.env.local
.env.production
```

### **2. Use Environment Variables**

❌ **Wrong:**
```typescript
const API_URL = 'https://api.yourdomain.com';
```

✅ **Correct:**
```typescript
const API_URL = import.meta.env.VITE_API_URL;
```

### **3. HTTPS in Production**

- Always use HTTPS for API calls
- Setup SSL certificate on hosting
- Redirect HTTP to HTTPS

---

## 🎉 DONE!

Frontend đã sẵn sàng connect với MySQL backend!

**Next steps:**
1. ✅ Backend deployed (MySQL)
2. ✅ Frontend configured
3. → Test full workflow
4. → Setup auto-deployment (optional)
5. → Monitor và maintain

**Made with 🦆 by 1Pixel Team**
