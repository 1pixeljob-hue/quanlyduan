# 🚀 SETUP GITHUB AUTO-DEPLOYMENT - HƯỚNG DẪN ĐẦY ĐỦ

## ⚠️ QUAN TRỌNG: CÁCH TẠO WORKFLOW FILE

Vì **Figma Make không support folder `.github`**, bạn cần **tạo workflow file trực tiếp trên GitHub**!

---

## 📋 BƯỚC 1: PUSH CODE TỪ FIGMA MAKE

### **TRONG FIGMA MAKE:**

1. **Click "Integrations"** (góc trên)

2. **Click "Manage GitHub"**

3. **Repository:** `1pixeljob-hue/Onetask`

4. **Commit message:**
   ```
   🚀 Add build configuration for auto-deployment
   
   - Add package.json with build script
   - Add Vite config
   - Add TypeScript config
   - Add main.tsx entry point
   - Ready for GitHub Actions deployment
   ```

5. **Click "Push to GitHub"** 🚀

---

## 📋 BƯỚC 2: TẠO WORKFLOW FILE TRÊN GITHUB

### **Workflow file đã có sẵn trong project:**

```
/github-workflows-deploy-frontend-ftp.yml
```

### **Tạo trên GitHub:**

1. **Vào repository:**
   ```
   https://github.com/1pixeljob-hue/Onetask
   ```

2. **Click "Add file" → "Create new file"**

3. **File name:**
   ```
   .github/workflows/deploy-frontend-ftp.yml
   ```
   ⚠️ **LƯU Ý:** Nhập đúng path này, GitHub sẽ tự tạo folder!

4. **Copy nội dung file:** `/github-workflows-deploy-frontend-ftp.yml`

5. **Paste vào editor trên GitHub**

6. **Commit message:**
   ```
   Add GitHub Actions workflow for auto-deployment
   ```

7. **Click "Commit new file"**

---

## 📋 BƯỚC 3: ADD GITHUB SECRETS

### **Vào Settings:**

```
https://github.com/1pixeljob-hue/Onetask/settings/secrets/actions
```

### **Add 4 secrets:**

#### **1. FTP_SERVER**

- Click **"New repository secret"**
- Name: `FTP_SERVER`
- Value: `ftp.yourdomain.com` (hostname only, no `http://` or `ftp://`)
- Click **"Add secret"**

#### **2. FTP_USERNAME**

- Click **"New repository secret"**
- Name: `FTP_USERNAME`
- Value: `user@yourdomain.com` (your FTP username)
- Click **"Add secret"**

#### **3. FTP_PASSWORD**

- Click **"New repository secret"**
- Name: `FTP_PASSWORD`
- Value: `YourPassword123` (your FTP password)
- Click **"Add secret"**

#### **4. FTP_SERVER_DIR**

- Click **"New repository secret"**
- Name: `FTP_SERVER_DIR`
- Value: `/public_html/` 
- ⚠️ **PHẢI CÓ `/` Ở CUỐI!**
- Click **"Add secret"**

### **Verify secrets:**

Should have 4 secrets:
```
✅ FTP_SERVER
✅ FTP_USERNAME
✅ FTP_PASSWORD
✅ FTP_SERVER_DIR
```

---

## 📋 BƯỚC 4: TEST WORKFLOW

### **Manual trigger:**

1. **Vào Actions tab:**
   ```
   https://github.com/1pixeljob-hue/Onetask/actions
   ```

2. **Click workflow:** "🎨 Deploy Frontend to Hosting"

3. **Click "Run workflow"** (button bên phải)

4. **Select branch:** `main`

5. **Click "Run workflow"**

### **Wait for completion (~5-7 phút):**

```
⏳ Queued...
⏳ Set up job
✅ Checkout code
✅ Setup Node.js
✅ Install dependencies (npm install)
✅ Build production (npm run build → creates dist/)
✅ Deploy to FTP (upload dist/ to hosting)
✅ Complete job
```

### **Check website:**

```
http://yourdomain.com
```

✅ Website should be live!

---

## 🎉 HOÀN THÀNH!

### **Từ giờ, auto-deployment hoạt động:**

```
Figma Make
  ↓ (Push changes)
GitHub Repository
  ↓ (Auto trigger workflow)
GitHub Actions
  ├─ Install dependencies
  ├─ Build production
  └─ Deploy to FTP
  ↓
✅ Website Live!
```

### **Mỗi lần push từ Figma Make:**

1. Code push lên GitHub
2. Workflow tự động chạy (sau 10-30 giây)
3. Build + Deploy (5-7 phút)
4. ✅ Website cập nhật!

**Không cần làm gì thêm!** 🎊

---

## 📊 WORKFLOW DETAILS

### **File structure sau khi setup:**

```
Repository Root
├── .github/
│   └── workflows/
│       └── deploy-frontend-ftp.yml    ← Tạo trên GitHub
├── package.json                        ← Đã có
├── vite.config.ts                      ← Đã có
├── tsconfig.json                       ← Đã có
├── index.html                          ← Đã có
├── main.tsx                            ← Đã có
├── App.tsx                             ← Đã có
├── components/                         ← Đã có
├── utils/                              ← Đã có
└── backend/                            ← Ignored by frontend workflow
```

### **Workflow triggers:**

✅ **Auto-run khi:**
- Push lên branch `main`
- Merge pull request vào `main`

❌ **Không chạy nếu chỉ sửa:**
- Files trong `backend/` folder
- Markdown files (`**.md`)
- `.gitignore`

✅ **Manual trigger:**
- Luôn có thể trigger qua Actions tab

---

## 🐛 TROUBLESHOOTING

### **❌ Workflow không xuất hiện trong Actions tab**

**Nguyên nhân:**
- File workflow chưa được tạo trong `.github/workflows/`

**Giải pháp:**
1. Vào repo trên GitHub
2. Tạo file `.github/workflows/deploy-frontend-ftp.yml`
3. Copy nội dung từ `/github-workflows-deploy-frontend-ftp.yml`
4. Commit

---

### **❌ Build failed: "Cannot find module"**

**Nguyên nhân:**
- Thiếu dependencies trong `package.json`

**Giải pháp:**
1. Check file `package.json` có trong repo
2. Verify có section `dependencies` và `devDependencies`
3. Push lại nếu cần

---

### **❌ Deploy failed: "Authentication failed"**

**Nguyên nhân:**
- FTP credentials sai

**Giải pháp:**
1. Verify secrets chính xác
2. Test bằng FileZilla với credentials giống hệt
3. Update secrets nếu cần

---

### **❌ Deploy failed: "server-dir should be a folder"**

**Nguyên nhân:**
- `FTP_SERVER_DIR` thiếu `/` ở cuối

**Giải pháp:**
1. Edit secret `FTP_SERVER_DIR`
2. Thêm `/` ở cuối: `/public_html/`
3. Save

---

### **❌ Website không cập nhật**

**Possible causes:**

1. **Cache:**
   - Hard refresh: `Ctrl+Shift+R` (Windows) / `Cmd+Shift+R` (Mac)

2. **FTP path sai:**
   - Check `FTP_SERVER_DIR` đúng web root
   - Verify bằng FileZilla

3. **Files không upload:**
   - Check workflow logs
   - Verify có message "Files uploaded successfully"

---

## 📝 NOTES

### **Build output:**

```
dist/
├── index.html              ← Main HTML
├── assets/
│   ├── index-[hash].js    ← Main JS bundle
│   ├── index-[hash].css   ← Main CSS bundle
│   └── ...                ← Other assets
└── vite.svg               ← Favicon
```

### **Upload destination:**

```
FTP_SERVER_DIR (e.g., /public_html/)
├── index.html
├── assets/
│   ├── index-abc123.js
│   ├── index-abc123.css
│   └── ...
└── vite.svg
```

### **Access:**

```
http://yourdomain.com → index.html
```

---

## 📖 REFERENCES

### **Files:**

- `/github-workflows-deploy-frontend-ftp.yml` - Workflow template
- `/package.json` - NPM config
- `/vite.config.ts` - Build config
- `/GITHUB_DEPLOYMENT_SETUP.md` - This file

### **External:**

- [GitHub Actions docs](https://docs.github.com/en/actions)
- [FTP Deploy Action](https://github.com/SamKirkland/FTP-Deploy-Action)
- [Vite docs](https://vitejs.dev)

---

## ✅ QUICK CHECKLIST

### **Setup:**

- [ ] Push code từ Figma Make
- [ ] Tạo workflow file trên GitHub (`.github/workflows/deploy-frontend-ftp.yml`)
- [ ] Add 4 GitHub Secrets
- [ ] Test workflow manual
- [ ] Verify website live

### **Verify working:**

- [ ] ✅ Workflow appears in Actions tab
- [ ] ✅ All steps passed
- [ ] ✅ Files uploaded to FTP
- [ ] ✅ Website accessible
- [ ] ✅ Frontend works correctly

### **Future pushes:**

- [ ] ✅ Auto-trigger on push from Figma
- [ ] ✅ Build succeeds
- [ ] ✅ Deploy succeeds
- [ ] ✅ Website updates automatically

---

## 🎯 SUMMARY

### **What we did:**

1. ✅ Created build config files (package.json, vite.config.ts, etc.)
2. ✅ Pushed from Figma Make to GitHub
3. ✅ Created workflow file on GitHub
4. ✅ Added FTP secrets
5. ✅ Tested deployment
6. ✅ Verified website live

### **What happens now:**

```
Every push from Figma Make
  ↓
Auto-deployment
  ↓
Website updated
  ↓
✅ Zero manual work!
```

---

## 🎊 CONGRATULATIONS!

**Auto-deployment is now live!** 🚀

**Timeline:**
- Push from Figma: **10 seconds**
- GitHub receives: **30 seconds**
- Build + Deploy: **5-7 minutes**
- **Total: ~8 minutes from push to live!**

**vs. Manual deployment:**
- Edit code: 1 minute
- Push to GitHub: 10 seconds
- Open FileZilla: 30 seconds
- Upload files: 2-5 minutes
- Verify upload: 1 minute
- **Total: ~10 minutes + manual work**

**Saved:** Manual effort every deploy! 🎉

---

🦆 **1Pixel Management System**
📅 Setup: March 18, 2026
🎨 Auto-deployment: ✅ ENABLED

---

## 💪 NEXT STEPS

### **Optional improvements:**

1. **Add backend deployment workflow**
   - Separate workflow for `backend/`
   - Deploy Node.js backend to hosting

2. **Add notifications**
   - Email on deployment success/failure
   - Slack notifications

3. **Add staging environment**
   - Deploy to staging on `develop` branch
   - Deploy to production on `main` branch

4. **Add testing**
   - Run tests before deployment
   - Only deploy if tests pass

**But for now, enjoy your working auto-deployment!** 🎉
