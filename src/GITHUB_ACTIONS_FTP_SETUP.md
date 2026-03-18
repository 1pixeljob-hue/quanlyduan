# 🚀 GitHub Actions FTP Deployment - Setup Guide

Hướng dẫn setup **tự động deploy qua FTP** mỗi khi push code lên GitHub.

---

## ✅ ĐÃ TẠO 3 WORKFLOW FILES

```
.github/workflows/
├── deploy-frontend-ftp.yml    # Auto-deploy frontend khi push
├── deploy-backend-ftp.yml     # Deploy backend khi thay đổi
└── deploy-all-ftp.yml         # Manual deploy all (frontend + backend)
```

---

## 🎯 BƯỚC 1: LẤY THÔNG TIN FTP

### **Vào cPanel/Hosting Panel:**

1. **Login vào hosting control panel**
2. **Tìm FTP Accounts** (hoặc FTP Access)
3. **Tạo hoặc xem FTP account**

### **Ghi Nhớ 4 Thông Tin:**

| Thông Tin | Ví Dụ | Ghi Chú |
|-----------|-------|---------|
| **FTP Server** | `ftp.yourdomain.com` | Hoặc IP: `123.45.67.89` |
| **FTP Username** | `user@yourdomain.com` | FTP username |
| **FTP Password** | `YourPassword123` | FTP password |
| **FTP Directory** | `/public_html/` | Web root folder |

### **Test FTP Connection (Optional):**

Dùng FileZilla hoặc FTP client:
- Host: `ftp.yourdomain.com`
- Username: `user@yourdomain.com`
- Password: `YourPassword123`
- Port: `21`

Nếu connect thành công → OK!

---

## 🔐 BƯỚC 2: ADD GITHUB SECRETS

### **2.1. Vào GitHub Repository**

URL: `https://github.com/1pixeljob-hue/Onetask`

### **2.2. Vào Settings → Secrets**

1. Click **Settings** (tab trên cùng)
2. Click **Secrets and variables** → **Actions** (sidebar trái)
3. Click **New repository secret**

### **2.3. Thêm 4 Secrets (BẮT BUỘC)**

#### **Secret 1: FTP_SERVER**
```
Name: FTP_SERVER
Secret: ftp.yourdomain.com
```
(Hoặc IP hosting nếu không có domain)

Click **Add secret**

#### **Secret 2: FTP_USERNAME**
```
Name: FTP_USERNAME
Secret: user@yourdomain.com
```

Click **Add secret**

#### **Secret 3: FTP_PASSWORD**
```
Name: FTP_PASSWORD
Secret: YourFTPPassword
```

Click **Add secret**

#### **Secret 4: FTP_SERVER_DIR**
```
Name: FTP_SERVER_DIR
Secret: /public_html/
```

Hoặc nếu project trong subfolder:
```
Secret: /public_html/onetask/
```

Click **Add secret**

### **2.4. Add Secret Cho API (OPTIONAL)**

Nếu frontend cần connect backend:

#### **Secret 5: VITE_API_URL**
```
Name: VITE_API_URL
Secret: https://yourdomain.com/api
```

Hoặc nếu API ở subdomain khác:
```
Secret: https://api.yourdomain.com
```

Click **Add secret**

### **2.5. Verify Secrets**

Kiểm tra có **4-5 secrets** trong danh sách:
- ✅ FTP_SERVER
- ✅ FTP_USERNAME
- ✅ FTP_PASSWORD
- ✅ FTP_SERVER_DIR
- ✅ VITE_API_URL (optional)

---

## ✅ BƯỚC 3: TEST DEPLOYMENT

### **3.1. Manual Deploy (Test ngay)**

1. Vào GitHub repository
2. Click tab **Actions**
3. Click workflow **"🎨 Deploy Frontend via FTP"** (sidebar trái)
4. Click **Run workflow** (button bên phải)
5. Chọn branch: `main`
6. Click **Run workflow** (button xanh)

### **3.2. Theo Dõi Deployment**

1. Refresh trang
2. Click vào workflow run mới nhất (có icon ⚪ đang chạy)
3. Click vào job **"🚀 Deploy Frontend to Hosting"**
4. Xem real-time logs:
   - ✅ Checkout code
   - ✅ Setup Node.js
   - ✅ Install dependencies
   - ✅ Build production
   - ✅ Deploy to FTP
   - ✅ Deployment Success

### **3.3. Verify Trên Website**

1. Truy cập: `https://yourdomain.com`
2. Kiểm tra website hiển thị đúng
3. Check console không có lỗi (F12)

---

## 🎉 HOÀN TẤT! AUTO-DEPLOY ĐÃ SẴN SÀNG

Từ giờ **mỗi khi push code**:

```
┌─────────────────────────────────────────┐
│  1. Thay đổi trong Figma Make          │
│     ↓                                   │
│  2. Push to GitHub                     │
│     (Integrations → GitHub)            │
│     ↓                                   │
│  3. GitHub Actions tự động:            │
│     • Checkout code                    │
│     • Install dependencies             │
│     • Build frontend (npm run build)   │
│     • Upload qua FTP                   │
│     ↓                                   │
│  4. ✅ Website tự động cập nhật!       │
└─────────────────────────────────────────┘
```

---

## 📋 3 WORKFLOWS AVAILABLE

### **1. 🎨 Deploy Frontend (Auto)**

**File:** `.github/workflows/deploy-frontend-ftp.yml`

**Trigger:** 
- Tự động khi push lên `main` hoặc `master`
- Chỉ khi có thay đổi ngoài `backend/`

**Làm gì:**
- Build frontend (`npm run build`)
- Upload `dist/` folder qua FTP
- Website tự động cập nhật

**Xem logs:** Actions → "🎨 Deploy Frontend via FTP"

---

### **2. 🔧 Deploy Backend (Auto)**

**File:** `.github/workflows/deploy-backend-ftp.yml`

**Trigger:**
- Tự động khi có thay đổi trong `backend/`
- Push lên `main` hoặc `master`

**Làm gì:**
- Install production dependencies
- Upload backend files qua FTP
- ⚠️ **Cần restart PM2 manual**

**Sau khi workflow chạy xong:**
```bash
# SSH vào hosting
ssh user@your-hosting-ip

# Restart backend
pm2 restart 1pixel-backend

# Verify
pm2 logs 1pixel-backend --lines 20
curl http://localhost:3001/api/health
```

---

### **3. 🚀 Deploy All (Manual)**

**File:** `.github/workflows/deploy-all-ftp.yml`

**Trigger:** Manual only (workflow_dispatch)

**Cách chạy:**
1. Actions tab → "🚀 Deploy All" workflow
2. Click "Run workflow"
3. Chọn deploy target:
   - `all` - Deploy cả frontend + backend
   - `frontend-only` - Chỉ frontend
   - `backend-only` - Chỉ backend
4. Click "Run workflow"

**Use case:**
- Full deployment lần đầu
- Deploy cả 2 cùng lúc
- Troubleshooting

---

## 🔄 WORKFLOW TỰ ĐỘNG

### **Khi Push Code Thường:**

```bash
# Trong Figma Make
# 1. Thay đổi gì đó
# 2. Integrations → Manage GitHub
# 3. Push to 1pixeljob-hue/Onetask

# GitHub Actions tự động:
# → Detect changes
# → Build frontend (nếu có thay đổi)
# → Upload qua FTP
# → ✅ Done!
```

### **Khi Thay Đổi Backend:**

```bash
# 1. Push code (có thay đổi trong backend/)
# 2. GitHub Actions upload backend files
# 3. SSH vào hosting:
ssh user@host
pm2 restart 1pixel-backend

# ✅ Backend updated!
```

---

## 🐛 TROUBLESHOOTING

### **❌ Workflow Failed: FTP Connection**

**Error:**
```
Error: connect ECONNREFUSED
```

**Giải pháp:**
1. Check `FTP_SERVER` không có `http://` hoặc `https://`
2. Dùng IP thay vì domain
3. Verify port 21 không bị firewall block
4. Test với FileZilla

### **❌ Authentication Failed**

**Error:**
```
530 Login authentication failed
```

**Giải pháp:**
1. Verify `FTP_USERNAME` và `FTP_PASSWORD` đúng
2. Login thử bằng FileZilla
3. Check FTP account không bị disable
4. Recreate FTP account trong cPanel

### **❌ Permission Denied**

**Error:**
```
550 Permission denied
```

**Giải pháp:**
1. Check `FTP_SERVER_DIR` path đúng
2. Verify FTP account có quyền write vào folder
3. Thử path khác: `/` hoặc `/public_html/`
4. Check folder permissions (755)

### **❌ Build Failed**

**Error:**
```
npm ERR! missing script: build
```

**Giải pháp:**

Check `package.json` có script build:

```json
{
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview"
  }
}
```

### **❌ Files Không Upload**

**Giải pháp:**
1. Check workflow logs chi tiết
2. Verify `dist/` folder tồn tại sau build
3. Check `exclude` patterns
4. Verify FTP permissions

---

## 🎯 WORKFLOW LOGS

### **Xem Logs Chi Tiết:**

1. Vào **Actions** tab
2. Click vào workflow run
3. Click vào job name
4. Xem từng step:
   ```
   ✅ Checkout code
   ✅ Setup Node.js
   ✅ Install dependencies
   ✅ Build production
   ✅ Deploy to FTP
   ```

### **Download Logs:**

Click icon ⋮ (3 dots) → Download log archive

---

## 📊 MONITORING

### **Check Deployment Status:**

**Via GitHub:**
- Actions tab → Xem workflows
- Green ✅ = Success
- Red ❌ = Failed
- Yellow ⚪ = Running

**Via Hosting:**
```bash
# SSH vào hosting
ssh user@host

# Check files mới nhất
cd /public_html/
ls -lt | head

# Check git log
git log -1

# Check backend
pm2 status
```

---

## 🔒 SECURITY BEST PRACTICES

### **1. Secrets Security:**
- ✅ Never commit FTP credentials to code
- ✅ Use GitHub Secrets
- ✅ Rotate passwords regularly
- ✅ Use strong passwords

### **2. FTP Security:**
- ✅ Use FTPS (FTP over SSL) nếu có
- ✅ Restrict FTP access by IP (nếu hosting support)
- ✅ Use separate FTP account (không dùng root)
- ✅ Limit FTP permissions

### **3. Deployment Security:**
- ✅ Never deploy `.env` files
- ✅ Exclude sensitive files (check `exclude` in workflow)
- ✅ Review logs sau deployment
- ✅ Enable 2FA trên GitHub

---

## 📋 CHECKLIST ĐẦY ĐỦ

- [ ] **FTP Credentials** đã lấy từ hosting
- [ ] **4 GitHub Secrets** đã add:
  - [ ] FTP_SERVER
  - [ ] FTP_USERNAME
  - [ ] FTP_PASSWORD
  - [ ] FTP_SERVER_DIR
- [ ] **VITE_API_URL** secret (optional)
- [ ] **3 Workflow files** đã tồn tại trong `.github/workflows/`
- [ ] **Test manual deploy** thành công
- [ ] **Verify trên website** files đã upload
- [ ] **Auto-deploy** hoạt động khi push code
- [ ] **Backend restart** script ready (nếu deploy backend)

---

## 🎉 SUCCESS!

Bạn đã setup xong **GitHub Actions Auto-Deploy qua FTP**!

### **Từ giờ chỉ cần:**

```bash
# 1. Thay đổi trong Figma
# 2. Push to GitHub
# 3. Done! Website tự động cập nhật 🎉
```

### **Next Steps:**

1. ✅ Test bằng cách thay đổi nhỏ
2. ✅ Push và xem workflow chạy
3. ✅ Verify trên website
4. ✅ Setup monitoring (optional)

---

## 📞 NEED HELP?

**Workflow không chạy?**
- Check Actions tab → View logs
- Verify GitHub Secrets đúng
- Test FTP với FileZilla

**Files không upload?**
- Check FTP permissions
- Verify path trong FTP_SERVER_DIR
- Review workflow logs

**Build failed?**
- Check package.json có script build
- Verify dependencies
- Review build logs

**Backend không update?**
- Remember: Cần restart PM2 manual
- SSH vào hosting
- Run: `pm2 restart 1pixel-backend`

---

**Made with 🦆 by 1Pixel Team**

**Happy Deploying! 🚀**
