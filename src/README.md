# 🎯 1Pixel - Hệ Thống Quản Lý Công Việc Tập Trung

<div align="center">

![1Pixel Logo](https://via.placeholder.com/200x80/4DBFAD/FFFFFF?text=1Pixel)

**Quản lý Hosting • Projects • Passwords • Code Snippets**

[![Version](https://img.shields.io/badge/version-2.0.0-blue.svg)](https://github.com/yourusername/1pixel)
[![License](https://img.shields.io/badge/license-MIT-green.svg)](LICENSE)
[![MySQL](https://img.shields.io/badge/database-MySQL-4479A1.svg)](https://www.mysql.com)
[![React](https://img.shields.io/badge/react-18.3.1-61DAFB.svg)](https://react.dev)
[![Node.js](https://img.shields.io/badge/node.js-18+-339933.svg)](https://nodejs.org)

[Demo](#) • [Documentation](#-tài-liệu) • [Quick Deploy](QUICK_DEPLOY_GUIDE.md)

</div>

---

## 🌟 Tổng Quan

**1Pixel Management System** là giải pháp quản lý tập trung toàn diện cho doanh nghiệp với **MySQL Backend**, bao gồm 5 module chính:

- 🌐 **Hosting Management** - Quản lý hosting với cảnh báo hết hạn & Google Calendar sync
- 📁 **Project Management** - Theo dõi dự án khách hàng
- 🔐 **Password Manager** - Lưu trữ mật khẩu an toàn
- 💻 **CodeX** - Quản lý code snippets
- 📊 **Dashboard** - Thống kê và báo cáo tổng quan

---

## ✨ Tính Năng Nổi Bật

### 🎯 Core Features

| Tính Năng | Mô Tả | Status |
|-----------|-------|--------|
| **CRUD Operations** | Create, Read, Update, Delete cho tất cả modules | ✅ |
| **MySQL Backend** | RESTful API với Node.js + Express | ✅ |
| **Auto-Deploy** | GitHub Actions tự động deploy | ✅ |
| **Status Tracking** | Tự động cập nhật trạng thái hosting | ✅ |
| **Activity Logs** | Ghi log mọi thao tác (create/update/delete) | ✅ |
| **Search & Filter** | Tìm kiếm và lọc dữ liệu nhanh chóng | ✅ |

### 📅 Google Calendar Integration

- ✅ **Auto-sync** khi thêm/sửa/xóa hosting
- ✅ **3 lần nhắc nhở**: 7 ngày, 1 ngày, ngày hết hạn
- ✅ **Màu sắc phân loại**: 🔵 Blue (7 ngày) | 🟠 Orange (1 ngày) | 🔴 Red (hết hạn)
- ✅ **Tự động tạo events** trong Google Calendar

### 🚀 CI/CD với GitHub Actions

- ✅ **Auto-deploy** khi push code lên GitHub
- ✅ **Frontend** build và upload lên hosting qua FTP
- ✅ **Backend** tự động restart (optional)
- ✅ **Zero-downtime deployment**

### 🎨 UI/UX

- ✅ **Modern Design** - Gradient Teal #4DBFAD → Blue #2563B4
- ✅ **Responsive** - Mobile, Tablet, Desktop
- ✅ **Loading Animations** - 🦆 Cute duck animation
- ✅ **Date Format** - DD/MM/YYYY (chuẩn Việt Nam)
- ✅ **Currency** - VNĐ (Vietnamese Dong)
- ✅ **Tailwind CSS v4** - Modern styling

---

## 🚀 Quick Deploy (10 phút)

### Prerequisites

- ✅ **Node.js** v18+
- ✅ **MySQL** v5.7+ hoặc v8.0+
- ✅ **Hosting** có Node.js và MySQL
- ✅ **GitHub** account

### 🎯 Deploy trong 10 Phút

**👉 BẮT ĐẦU TẠI:** [START_HERE.md](START_HERE.md)

Hoặc chọn một trong các hướng dẫn sau:

| Guide | Mục Đích | Thời Gian |
|-------|----------|-----------|
| **[START_HERE.md](START_HERE.md)** | 🎯 Overview & navigation | 5 phút |
| **[QUICK_DEPLOY.md](QUICK_DEPLOY.md)** | ⚡ Copy-paste commands | 10 phút |
| **[DEPLOY_GUIDE.md](DEPLOY_GUIDE.md)** | 📖 Chi tiết đầy đủ | 30 phút |
| **[HOSTING_SPECIFIC.md](HOSTING_SPECIFIC.md)** | 🏢 Theo hosting provider | Varies |
| **[DEPLOYMENT_SUMMARY.md](DEPLOYMENT_SUMMARY.md)** | 📊 Overview & timeline | 10 phút |
| **[FRONTEND_SETUP.md](FRONTEND_SETUP.md)** | 🎨 Frontend config | 5 phút |
| **[COMMANDS_CHEATSHEET.md](COMMANDS_CHEATSHEET.md)** | 🎯 Quick commands | Reference |

```bash
# Quick Start
cd backend
./scripts/setup.sh
# Follow prompts → Done in 10 minutes!
```

**📖 Xem hướng dẫn chi tiết:** [START_HERE.md](START_HERE.md)

---

## 📁 Cấu Trúc Project

```
1pixel/
├── backend/                    # 🔧 Backend API (Node.js + MySQL)
│   ├── index.js               # Main server file
│   ├── db.js                  # MySQL connection & init
│   ├── routes/                # API routes
│   │   ├── hostings.js       
│   │   ├── projects.js       
│   │   ├── passwords.js      
│   │   ├── categories.js     
│   │   ├── codex.js          
│   │   └── logs.js           
│   ├── .env.example           # Environment template
│   ├── package.json           
│   └── README.md              # Backend documentation
│
├── components/                 # 🎨 React Components
│   ├── Dashboard.tsx          # Dashboard with statistics
│   ├── HostingList.tsx        # Hosting management
│   ├── ProjectList.tsx        # Project management
│   ├── PasswordList.tsx       # Password manager
│   ├── CodeX.tsx              # Code snippets
│   ├── GoogleCalendarSettings.tsx  # Calendar integration
│   ├── LoadingDuck.tsx        # 🦆 Loading animation
│   └── ...
│
├── utils/                      # 🛠️ Utilities
│   ├── api.ts                 # API calls to backend
│   ├── googleCalendar.ts      # Google Calendar integration
│   ├── dateFormat.ts          # Date utilities (dd/mm/yyyy)
│   └── formatMoney.ts         # Currency formatter (VNĐ)
│
├── .github/workflows/          # 🚀 CI/CD
│   └── deploy.yml             # Auto-deploy workflow
│
├── styles/
│   └── globals.css            # Tailwind + custom styles
│
├── .env.example               # Frontend env template
├── DEPLOYMENT_GUIDE.md        # Deployment guide
├── QUICK_DEPLOY_GUIDE.md      # Quick deploy (10 min)
├── GITHUB_ACTIONS_SETUP.md    # GitHub Actions setup
└── README.md                  # This file
```

---

## 🗄️ Database Schema

Backend tự động tạo các bảng khi khởi động lần đầu:

### Tables

| Table | Mô Tả | Columns |
|-------|-------|---------|
| `hostings` | Quản lý hosting | id, name, domain, provider, registrationDate, expirationDate, price, status, notes |
| `projects` | Quản lý dự án | id, name, customer, customerPhone, adminUrl, adminUsername, adminPassword, status, description, price |
| `passwords` | Quản lý mật khẩu | id, title, username, password, website, notes, category |
| `categories` | Phân loại password | id, name, color |
| `codex` | Code snippets | id, name, type, content, description |
| `logs` | Activity logs | id, action_type, module_name, item_id, item_name, old_data, new_data, user, created_at |

**📖 Xem chi tiết:** `/backend/db.js`

---

## 🔐 Environment Variables

### Frontend (`.env`)

```env
VITE_API_URL=https://api.onetask.1pixel.vn/api
```

### Backend (`/backend/.env`)

```env
DB_HOST=localhost
DB_USER=onepixel_user
DB_PASSWORD=your_password
DB_NAME=onepixel_db
DB_PORT=3306

PORT=3001
NODE_ENV=production
CORS_ORIGIN=https://onetask.1pixel.vn,http://localhost:5173
```

**📖 Xem template:** [.env.example](.env.example) và [backend/.env.example](backend/.env.example)

---

## 📚 Tài Liệu

| Document | Mô Tả | Time |
|----------|-------|------|
| [QUICK_DEPLOY_GUIDE.md](QUICK_DEPLOY_GUIDE.md) | Deploy nhanh trong 10 phút | ⚡ 10 min |
| [DEPLOYMENT_GUIDE.md](DEPLOYMENT_GUIDE.md) | Hướng dẫn deploy chi tiết | 📖 30 min |
| [GITHUB_ACTIONS_SETUP.md](GITHUB_ACTIONS_SETUP.md) | Setup GitHub Actions | 🚀 15 min |
| [backend/README.md](backend/README.md) | Backend API documentation | 📡 API |
| [GOOGLE_CALENDAR_SETUP.md](GOOGLE_CALENDAR_SETUP.md) | Google Calendar integration | 📅 15 min |

---

## 🎯 Modules

### 1. 📊 Dashboard

- Thống kê tổng quan (hostings, projects, revenue)
- Biểu đồ phân bổ
- Quick actions
- Hosting sắp hết hạn

### 2. 🌐 Hosting Management

- CRUD operations
- Auto-update status (active/expiring/expired)
- Google Calendar auto-sync
- Search & filter
- Activity logs

### 3. 📁 Project Management

- Customer management
- Status tracking (planning, in-progress, completed, on-hold, pending-acceptance)
- Admin credentials storage
- Price tracking
- Activity logs

### 4. 🔐 Password Manager

- Secure password storage
- Category management (customizable colors)
- Copy to clipboard
- Show/Hide passwords
- Search & filter by category

### 5. 💻 CodeX

- Code snippet storage
- Language support (JavaScript, TypeScript, PHP, Python, SQL, etc.)
- Copy to clipboard
- Search & filter by type
- Description & notes

### 6. 📝 Activity Logs

- Track all CRUD operations
- Module-based filtering
- Show old/new data comparison
- User tracking
- Bulk delete

---

## 🔧 Tech Stack

### Frontend

- **Framework:** React 18.3.1
- **Language:** TypeScript 5.6.2
- **Styling:** Tailwind CSS v4
- **Build:** Vite 6.0.3
- **Icons:** Lucide React
- **Charts:** Recharts

### Backend

- **Runtime:** Node.js 18+
- **Framework:** Express 4.18
- **Database:** MySQL 5.7+ / 8.0+
- **ORM:** mysql2 (native driver)
- **Process Manager:** PM2

### DevOps

- **CI/CD:** GitHub Actions
- **Deploy:** FTP/SSH
- **Hosting:** Any Node.js hosting (VPS, Shared Hosting, Cloud)

### Integrations

- **Calendar:** Google Calendar API v3
- **Email:** Resend API (optional)

---

## 📈 Workflow

### Development → Production

```
┌─────────────┐
│ Development │ → git push → GitHub
└─────────────┘              │
                             ▼
                    ┌─────────────────┐
                    │ GitHub Actions  │
                    └─────────────────┘
                             │
                    ┌────────┴────────┐
                    ▼                 ▼
            ┌──────────────┐   ┌──────────────┐
            │ Build        │   │ Deploy       │
            │ Frontend     │   │ to Hosting   │
            └──────────────┘   └──────────────┘
                                       │
                                       ▼
                              ┌─────────────────┐
                              │ Production Live │
                              └─────────────────┘
```

### Future Deploy

```bash
# Chỉ cần:
git add .
git commit -m "Feature: New functionality"
git push origin main

# GitHub Actions sẽ tự động:
# 1. Build frontend
# 2. Deploy lên hosting
# 3. Done! ✅
```

---

## 🎨 Design System

### Brand Colors

```css
Primary Gradient: #4DBFAD → #2563B4
Teal: #4DBFAD
Blue: #2563B4
Success: #10B981
Warning: #F59E0B
Danger: #EF4444
```

### Components

- **Cards:** Modern rounded corners với subtle shadows
- **Buttons:** Gradient backgrounds, smooth hover effects
- **Forms:** Clean inputs với real-time validation
- **Icons:** Lucide React (consistent & beautiful)
- **Animations:** Smooth transitions, loading duck 🦆

---

## 🐛 Troubleshooting

### Backend không khởi động

```bash
pm2 logs 1pixel-backend --lines 50

# Common issues:
# - MySQL connection failed → Check .env
# - Port in use → Change PORT in .env
# - Missing dependencies → npm install
```

### Frontend không kết nối được backend

```bash
# Check browser console (F12)
# Verify VITE_API_URL in GitHub Secrets
# Test backend: curl https://api-url/api/health
```

### GitHub Actions deploy failed

```bash
# Go to Actions tab on GitHub
# Click failed run → View logs
# Common: Wrong FTP credentials
# Fix: Update Secrets in GitHub Settings
```

**📖 Xem thêm:** [DEPLOYMENT_GUIDE.md](DEPLOYMENT_GUIDE.md#troubleshooting)

---

## 📞 Contact & Support

### Issues & Bugs

- **GitHub Issues:** [Create new issue](https://github.com/yourusername/1pixel/issues)
- **Email:** support@1pixel.vn

### Documentation

- [Quick Deploy Guide](QUICK_DEPLOY_GUIDE.md) - 10 phút setup
- [Deployment Guide](DEPLOYMENT_GUIDE.md) - Chi tiết đầy đủ
- [GitHub Actions Setup](GITHUB_ACTIONS_SETUP.md) - CI/CD
- [Backend API](backend/README.md) - API documentation

---

## 🙏 Acknowledgments

- **MySQL** - Reliable database
- **Express** - Fast web framework
- **React** - UI library
- **Tailwind CSS** - Utility-first CSS
- **Lucide** - Beautiful icons
- **PM2** - Process manager
- **GitHub Actions** - CI/CD automation

---

<div align="center">

**Made with ❤️ by 1Pixel Team**

⭐ Star this repo if you find it helpful!

[Quick Deploy](QUICK_DEPLOY_GUIDE.md) • [Report Bug](https://github.com/yourusername/1pixel/issues) • [Request Feature](https://github.com/yourusername/1pixel/issues)

---

**Version 2.0.0** - MySQL Backend với GitHub Actions Auto-Deploy  
**Date:** 18/03/2026

</div>