# 🚀 START HERE - 1Pixel Deployment

## 👋 Chào Mừng!

Bạn đang chuẩn bị deploy **1Pixel Management System** với **MySQL Backend**.

---

## 🎯 BẠN CẦN GÌ?

### Để Deploy Thành Công, Bạn Cần:

✅ **Hosting** có Node.js (v18+) và MySQL  
✅ **SSH access** vào hosting  
✅ **GitHub account**  
✅ **10-15 phút** thời gian  

**Đã có đủ?** → Continue!

---

## 📚 CHỌN HƯỚNG DẪN PHỤC HỢP

Chọn 1 trong các hướng dẫn dưới đây:

### **⚡ Nhanh Nhất (10 phút) - RECOMMENDED**

📄 **[QUICK_DEPLOY.md](QUICK_DEPLOY.md)**

- Copy-paste commands
- 5 bước đơn giản
- Deployment nhanh nhất

**👉 Best for:** Người đã có kinh nghiệm deploy Node.js/MySQL

---

### **📖 Chi Tiết Đầy Đủ (30 phút)**

📄 **[DEPLOY_GUIDE.md](DEPLOY_GUIDE.md)**

- Giải thích từng bước
- Troubleshooting guide
- Security & Performance tips

**👉 Best for:** Lần đầu deploy hoặc muốn hiểu rõ mọi thứ

---

### **🏢 Theo Hosting Provider**

📄 **[HOSTING_SPECIFIC.md](HOSTING_SPECIFIC.md)**

- Hostinger
- cPanel Hosting
- DirectAdmin
- VPS Ubuntu/Debian
- DigitalOcean
- AWS EC2

**👉 Best for:** Setup specific cho hosting của bạn

---

### **📊 Overview & Summary**

📄 **[DEPLOYMENT_SUMMARY.md](DEPLOYMENT_SUMMARY.md)**

- Tổng quan hệ thống
- Deployment timeline
- Documentation map

**👉 Best for:** Hiểu big picture trước khi deploy

---

## 🗺️ DEPLOYMENT FLOW

```
┌─────────────────────────────────────────────────────────┐
│                                                         │
│  1. 📖 Đọc tài liệu (file này)                         │
│     ↓                                                   │
│  2. 🔧 Setup MySQL trên hosting                        │
│     ↓                                                   │
│  3. 🚀 Deploy Backend (Node.js + Express)              │
│     ↓                                                   │
│  4. 🔐 Configure GitHub Secrets                        │
│     ↓                                                   │
│  5. ⬆️  Push to GitHub                                 │
│     ↓                                                   │
│  6. ✅ Auto-deployment via GitHub Actions              │
│     ↓                                                   │
│  7. 🎉 DONE! Backend đang chạy                         │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

**Total Time:** ~10-15 phút

---

## 🎯 DEPLOYMENT STEPS OVERVIEW

### **Bước 1: Setup MySQL Database (2 phút)**

```sql
CREATE DATABASE onepixel_db;
CREATE USER 'onepixel_user'@'localhost' IDENTIFIED BY 'password';
GRANT ALL PRIVILEGES ON onepixel_db.* TO 'onepixel_user'@'localhost';
FLUSH PRIVILEGES;
```

📖 **Chi tiết:** [QUICK_DEPLOY.md#step-1](QUICK_DEPLOY.md)

---

### **Bước 2: Deploy Backend (3 phút)**

```bash
cd ~/domains/yourdomain.com/public_html
git clone https://github.com/your-username/1pixel.git
cd 1pixel/backend
./scripts/setup.sh
nano .env  # Configure MySQL credentials
pm2 start ecosystem.config.js
```

📖 **Chi tiết:** [QUICK_DEPLOY.md#step-2](QUICK_DEPLOY.md)

---

### **Bước 3: GitHub Secrets (2 phút)**

Add 5 secrets to GitHub:
- `SSH_HOST`
- `SSH_USERNAME`
- `SSH_PASSWORD`
- `SSH_PORT`
- `DEPLOY_PATH`

📖 **Chi tiết:** [QUICK_DEPLOY.md#step-3](QUICK_DEPLOY.md)

---

### **Bước 4: Push & Auto-Deploy (1 phút)**

```bash
git add .
git commit -m "🚀 Initial deployment"
git push origin main
```

GitHub Actions sẽ tự động deploy!

📖 **Chi tiết:** [QUICK_DEPLOY.md#step-4](QUICK_DEPLOY.md)

---

### **Bước 5: Verify (2 phút)**

```bash
pm2 status
curl http://localhost:3001/api/health
mysql -u onepixel_user -p onepixel_db -e "SHOW TABLES;"
```

📖 **Chi tiết:** [QUICK_DEPLOY.md#step-5](QUICK_DEPLOY.md)

---

## 📦 NHỮNG GÌ ĐÃ CÓ SẴN

### ✅ Backend Infrastructure
- Express server với 6 routes
- MySQL auto-create schema
- PM2 process management
- Auto-deployment với GitHub Actions

### ✅ Deployment Tools
- Setup scripts (`scripts/setup.sh`)
- Deploy scripts (`scripts/deploy.sh`)
- Backup/restore scripts
- Web server configs (Nginx/Apache)

### ✅ Documentation
- 5 deployment guides
- Troubleshooting guides
- Provider-specific instructions
- Checklists & summaries

**Everything is ready!** 🎉

---

## 🆘 CẦN HELP?

### **Common Issues**

| Issue | Quick Fix | Full Guide |
|-------|-----------|------------|
| MySQL connection error | Check `.env` credentials | [DEPLOY_GUIDE.md#troubleshooting](DEPLOY_GUIDE.md) |
| Backend won't start | Check PM2 logs: `pm2 logs` | [QUICK_DEPLOY.md#verify](QUICK_DEPLOY.md) |
| CORS blocked | Update `CORS_ORIGIN` in `.env` | [FRONTEND_SETUP.md#cors](FRONTEND_SETUP.md) |
| Port in use | Kill process: `lsof -ti:3001 \| xargs kill -9` | [HOSTING_SPECIFIC.md](HOSTING_SPECIFIC.md) |

---

### **Debugging Commands**

```bash
# PM2 logs
pm2 logs 1pixel-backend --lines 100

# MySQL connection test
mysql -u onepixel_user -p onepixel_db

# API health check
curl http://localhost:3001/api/health

# GitHub Actions logs
# → Go to GitHub repo → Actions tab
```

---

## 📚 ALL DOCUMENTATION

| File | Purpose | Time |
|------|---------|------|
| **[START_HERE.md](START_HERE.md)** | You are here! Overview | 5 min |
| **[QUICK_DEPLOY.md](QUICK_DEPLOY.md)** | Quick deployment guide | 10 min |
| **[DEPLOY_GUIDE.md](DEPLOY_GUIDE.md)** | Full deployment guide | 30 min |
| **[HOSTING_SPECIFIC.md](HOSTING_SPECIFIC.md)** | Provider-specific guides | Varies |
| **[DEPLOYMENT_SUMMARY.md](DEPLOYMENT_SUMMARY.md)** | Overview & summary | 10 min |
| **[FRONTEND_SETUP.md](FRONTEND_SETUP.md)** | Frontend configuration | 5 min |
| **[backend/README.md](backend/README.md)** | Backend API docs | Reference |

---

## 🎯 NEXT STEPS

### **Lựa Chọn Của Bạn:**

<details>
<summary><strong>🟢 TÔI ĐÃ CÓ KINH NGHIỆM DEPLOY</strong></summary>

**→ Go to:** [QUICK_DEPLOY.md](QUICK_DEPLOY.md)

Copy-paste commands và deploy trong 10 phút!

</details>

<details>
<summary><strong>🟡 TÔI LÀ NGƯỜI MỚI HOẶC MUỐN HIỂU RÕ</strong></summary>

**→ Go to:** [DEPLOY_GUIDE.md](DEPLOY_GUIDE.md)

Hướng dẫn chi tiết từng bước với giải thích đầy đủ.

</details>

<details>
<summary><strong>🔵 TÔI DÙNG HOSTING CỤ THỂ (Hostinger, cPanel, VPS...)</strong></summary>

**→ Go to:** [HOSTING_SPECIFIC.md](HOSTING_SPECIFIC.md)

Tìm hosting provider của bạn và follow specific instructions.

</details>

<details>
<summary><strong>🟣 TÔI MUỐN XEM BIG PICTURE TRƯỚC</strong></summary>

**→ Go to:** [DEPLOYMENT_SUMMARY.md](DEPLOYMENT_SUMMARY.md)

Tổng quan hệ thống và deployment timeline.

</details>

---

## ✅ PRE-DEPLOYMENT CHECKLIST

Trước khi bắt đầu, đảm bảo bạn có:

- [ ] **Hosting với Node.js v18+**
  - Test: SSH vào → `node -v`
  
- [ ] **MySQL database access**
  - Version 5.7+ hoặc 8.0+
  - Có quyền create database
  
- [ ] **SSH credentials**
  - Username & password
  - IP/domain của hosting
  
- [ ] **GitHub repository**
  - Code đã push lên GitHub
  - Admin access để add secrets
  
- [ ] **Domain (optional)**
  - Có thể deploy trên subdomain
  - Hoặc sử dụng IP

**Tất cả OK?** → Bắt đầu deploy! 🚀

---

## 🚀 READY TO START?

### **Pick Your Path:**

1. **⚡ Fast Track (10 min):** [QUICK_DEPLOY.md](QUICK_DEPLOY.md)
2. **📖 Detailed Guide (30 min):** [DEPLOY_GUIDE.md](DEPLOY_GUIDE.md)
3. **🏢 Your Hosting Provider:** [HOSTING_SPECIFIC.md](HOSTING_SPECIFIC.md)

---

<div align="center">

## 🎉 LET'S DEPLOY!

**Made with 🦆 by 1Pixel Team**

[Quick Deploy →](QUICK_DEPLOY.md) | [Full Guide →](DEPLOY_GUIDE.md) | [Help →](DEPLOYMENT_SUMMARY.md)

---

**Estimated Time:** 10-15 minutes  
**Difficulty:** Easy to Moderate  
**Support:** Full documentation + troubleshooting guides

**Version:** 2.0.0 - MySQL Backend  
**Last Updated:** 18/03/2026

</div>
