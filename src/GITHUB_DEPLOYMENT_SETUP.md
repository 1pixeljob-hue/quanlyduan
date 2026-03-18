# 🚀 HƯỚNG DẪN DEPLOYMENT TỰ ĐỘNG TỪ GITHUB

## ✅ ĐÃ SETUP XONG!

### 📦 Files đã tạo:

```
✅ /.github/workflows/deploy-frontend-ftp.yml  - GitHub Actions workflow
✅ /package.json                                - NPM config
✅ /vite.config.ts                              - Vite build config
✅ /tsconfig.json                               - TypeScript config
✅ /index.html                                  - HTML entry point
✅ /.gitignore                                  - Ignore files
✅ /.env.example                                - Env template
✅ /.github/README.md                           - Workflow docs
```

---

## 🎯 LUỒNG Tự ĐỘNG

```
Figma Make
  ↓ (Push changes)
GitHub Repository
  ↓ (Auto trigger)
GitHub Actions
  ↓ (Build & Deploy)
FTP Hosting
  ↓
✅ Website Live!
```

---

## 🔧 SETUP LẦN ĐẦU

### **BƯỚC 1: Push tất cả code lên GitHub**

**Trong Figma Make:**

1. **Integrations** → **Manage GitHub**

2. **Repository:** `1pixeljob-hue/Onetask`

3. **Commit message:**
   ```
   Setup GitHub Actions auto-deployment
   ```

4. **Push!**

---

### **BƯỚC 2: Add GitHub Secrets**

**Trên GitHub repository:**

1. Vào: `https://github.com/1pixeljob-hue/Onetask/settings/secrets/actions`

2. Click **"New repository secret"**

3. **Thêm 4 secrets:**

| Secret Name | Value | Example |
|-------------|-------|---------|
| `FTP_SERVER` | FTP hostname | `ftp.yourdomain.com` |
| `FTP_USERNAME` | FTP username | `user@domain.com` |
| `FTP_PASSWORD` | FTP password | `YourPassword123` |
| `FTP_SERVER_DIR` | Upload directory | `/public_html/` ⚠️ **PHẢI CÓ `/` Ở CUỐI!** |

4. **Click "Add secret"** cho mỗi secret

---

### **BƯỚC 3: Test Workflow**

1. **Vào Actions tab:**
   ```
   https://github.com/1pixeljob-hue/Onetask/actions
   ```

2. **Click workflow:** "🎨 Deploy Frontend to Hosting"

3. **Click "Run workflow"**

4. **Select branch:** `main`

5. **Click "Run workflow"**

6. **Xem logs:**
   ```
   ✅ Checkout code
   ✅ Setup Node.js
   ✅ Install dependencies
   ✅ Build production
   ✅ Deploy to FTP
   ✅ Complete!
   ```

---

## 🎉 SAU KHI SETUP

### **Tự động deployment khi:**

✅ Push code từ Figma Make lên GitHub
✅ Merge pull request
✅ Commit trực tiếp lên branch `main`

### **Workflow sẽ:**

1. Detect thay đổi
2. Tự động build
3. Tự động deploy lên hosting
4. ✅ Website cập nhật!

---

## 📊 TIMELINE

```
Push code → GitHub
  ↓ (10 giây)
Trigger workflow
  ↓ (30 giây)
Install dependencies
  ↓ (2 phút)
Build production
  ↓ (1 phút)
Deploy to FTP
  ↓ (1-3 phút tùy file size)
✅ Website live!
```

**Tổng thời gian:** ~5-7 phút

---

## 🔍 MONITORING

### **Xem deployment history:**

1. Vào **Actions tab**
2. Xem list các workflow runs
3. Click vào run để xem logs chi tiết

### **Notification:**

- ✅ Success: Email thông báo deploy thành công
- ❌ Failure: Email báo lỗi

---

## 🐛 TROUBLESHOOTING

### **1. Workflow không chạy**

**Check:**
- ✅ File `.github/workflows/deploy-frontend-ftp.yml` có trong repo?
- ✅ Branch name đúng `main`?
- ✅ GitHub Actions enabled trong Settings?

### **2. Build failed**

**Check:**
- ✅ `package.json` có trong repo?
- ✅ `vite.config.ts` có trong repo?
- ✅ `index.html` có trong repo?

### **3. Deploy failed**

**Check secrets:**
- ✅ `FTP_SERVER` đúng hostname?
- ✅ `FTP_USERNAME` đúng?
- ✅ `FTP_PASSWORD` đúng?
- ✅ `FTP_SERVER_DIR` có `/` ở cuối?

**Test FTP:**
- Login bằng FileZilla với credentials giống secrets
- Verify có quyền write vào `FTP_SERVER_DIR`

---

## 📝 NOTES

### **Workflow chạy khi:**

✅ Push lên branch `main`
❌ Không chạy nếu chỉ sửa:
  - `backend/**` files
  - `**.md` files
  - `.gitignore`

### **Manual trigger:**

Luôn có thể trigger manual qua Actions tab!

---

## 🎯 CHECKLIST

### **Setup:**

- [ ] Push tất cả code lên GitHub
- [ ] Add 4 GitHub Secrets
- [ ] Test workflow manual
- [ ] Verify website live

### **Confirm working:**

- [ ] ✅ All workflow steps passed
- [ ] ✅ Files uploaded to FTP
- [ ] ✅ Website accessible
- [ ] ✅ Frontend works correctly

---

## 🚀 WORKFLOW CONTENT

**File:** `.github/workflows/deploy-frontend-ftp.yml`

```yaml
name: 🎨 Deploy Frontend to Hosting

on:
  push:
    branches:
      - main
    paths-ignore:
      - 'backend/**'
      - '**.md'
      - '.gitignore'
  workflow_dispatch:

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - Checkout code
      - Setup Node.js 18
      - Install dependencies (npm install)
      - Build production (npm run build)
      - Deploy to FTP (upload dist/)
```

---

## 📞 SUPPORT

**Issues?**

1. Check Actions tab logs
2. Verify secrets
3. Test FTP credentials
4. Check file permissions

---

## ✅ DONE!

**Bây giờ:**

1. **Push code lên GitHub** (từ Figma Make)
2. **Add 4 secrets** (trên GitHub)
3. **Run workflow test**
4. **Enjoy auto-deployment!** 🎉

---

🦆 **1Pixel Management System**
📅 Setup: March 18, 2026
🎨 Auto-deployment: ✅ ENABLED
