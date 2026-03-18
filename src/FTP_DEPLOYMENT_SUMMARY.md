# ✅ FTP Deployment - Setup Summary

## 🎉 ĐÃ TẠO XONG!

Tôi đã tạo **3 workflow files** cho GitHub Actions FTP deployment:

```
✅ .github/workflows/deploy-frontend-ftp.yml
✅ .github/workflows/deploy-backend-ftp.yml  
✅ .github/workflows/deploy-all-ftp.yml
✅ GITHUB_ACTIONS_FTP_SETUP.md (hướng dẫn chi tiết)
```

---

## 🚀 CÁCH SETUP (3 BƯỚC)

### **BƯỚC 1: Lấy Thông Tin FTP**

Vào **cPanel/Hosting Panel** → **FTP Accounts**

Cần 4 thông tin:
- Server: `ftp.yourdomain.com`
- Username: `user@yourdomain.com`
- Password: `your_password`
- Directory: `/public_html/`

---

### **BƯỚC 2: Add GitHub Secrets**

Vào: `https://github.com/1pixeljob-hue/Onetask/settings/secrets/actions`

Click **New repository secret**, thêm 4 secrets:

| Name | Value |
|------|-------|
| `FTP_SERVER` | `ftp.yourdomain.com` |
| `FTP_USERNAME` | `user@yourdomain.com` |
| `FTP_PASSWORD` | `your_password` |
| `FTP_SERVER_DIR` | `/public_html/` |

Optional (nếu frontend cần API):
| `VITE_API_URL` | `https://yourdomain.com/api` |

---

### **BƯỚC 3: Test Deploy**

1. Vào **Actions** tab: `https://github.com/1pixeljob-hue/Onetask/actions`
2. Click workflow **"🎨 Deploy Frontend via FTP"**
3. Click **Run workflow**
4. Chọn branch `main`
5. Click **Run workflow**
6. Đợi ✅ màu xanh

---

## ✅ XONG! TỰ ĐỘNG DEPLOY ĐÃ HOẠT ĐỘNG

### **Từ giờ mỗi khi push code:**

```
Figma Make → Push to GitHub → Auto Deploy via FTP → Website Update! 🎉
```

---

## 📋 3 WORKFLOWS

### **1. 🎨 Frontend Auto-Deploy**

- **Trigger:** Auto khi push (thay đổi ngoài backend/)
- **Làm gì:** Build + Upload dist/ qua FTP
- **Kết quả:** Website tự động cập nhật

### **2. 🔧 Backend Auto-Deploy**

- **Trigger:** Auto khi thay đổi backend/
- **Làm gì:** Upload backend files qua FTP
- **Lưu ý:** Cần restart PM2 manual

### **3. 🚀 Full Deploy (Manual)**

- **Trigger:** Manual (Actions tab)
- **Làm gì:** Deploy cả frontend + backend
- **Options:** all / frontend-only / backend-only

---

## 🎯 WORKFLOW ĐẦY ĐỦ

```
1. Thay đổi trong Figma Make
   ↓
2. Integrations → Push to GitHub
   ↓
3. GitHub Actions detect push
   ↓
4. Auto build frontend (npm run build)
   ↓
5. Upload qua FTP
   ↓
6. ✅ Website tự động cập nhật!
```

**⏱️ Thời gian:** ~2-3 phút mỗi lần deploy

---

## 🔍 XEM DEPLOYMENT STATUS

### **Trên GitHub:**
1. Vào **Actions** tab
2. Xem workflow runs:
   - 🟢 Success
   - 🔴 Failed  
   - 🟡 Running

### **Verify Trên Website:**
```
https://yourdomain.com
```

---

## 🐛 NẾU GẶP LỖI

### **Workflow Failed?**

1. **Check GitHub Secrets:**
   - Settings → Secrets → Verify tất cả 4 secrets
   - No typos, correct format

2. **Test FTP Connection:**
   - Dùng FileZilla
   - Host: `ftp.yourdomain.com`
   - Port: `21`

3. **View Logs:**
   - Actions → Click failed run
   - Xem error message

### **Common Errors:**

| Error | Fix |
|-------|-----|
| `connect ECONNREFUSED` | Check FTP_SERVER format |
| `530 Login failed` | Verify username/password |
| `550 Permission denied` | Check FTP_SERVER_DIR path |
| `Build failed` | Add `build` script to package.json |

---

## 📚 TÀI LIỆU CHI TIẾT

**👉 Đọc full guide:** [GITHUB_ACTIONS_FTP_SETUP.md](GITHUB_ACTIONS_FTP_SETUP.md)

Bao gồm:
- ✅ Chi tiết từng bước setup
- ✅ Troubleshooting đầy đủ
- ✅ Security best practices
- ✅ Monitoring & logs
- ✅ Advanced configurations

---

## ✅ CHECKLIST

- [ ] FTP credentials đã lấy
- [ ] 4 GitHub Secrets đã add
- [ ] Workflow files đã push lên GitHub
- [ ] Test deployment thành công
- [ ] Website hiển thị đúng
- [ ] Auto-deploy hoạt động

---

## 🎉 HOÀN TẤT!

**Auto FTP Deployment đã sẵn sàng!**

Mỗi khi bạn push code từ Figma → GitHub sẽ tự động deploy lên hosting qua FTP!

**No more manual FTP uploads!** 🚀

---

## 📞 CẦN HELP?

1. **Check:** [GITHUB_ACTIONS_FTP_SETUP.md](GITHUB_ACTIONS_FTP_SETUP.md)
2. **Logs:** Actions tab → View workflow logs
3. **Test:** FileZilla để verify FTP credentials

---

**Made with 🦆 by 1Pixel Team**

**Date:** 18/03/2026  
**Version:** 2.0.0
