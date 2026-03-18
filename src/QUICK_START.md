# 🚀 Quick Start Guide - 1Pixel Management System

## 📋 Mục Lục

1. [Yêu Cầu Hệ Thống](#-yêu-cầu-hệ-thống)
2. [Cài Đặt Cơ Bản](#-cài-đặt-cơ-bản)
3. [Cấu Hình Supabase](#-cấu-hình-supabase-bắt-buộc)
4. [Cấu Hình Google Calendar](#-cấu-hình-google-calendar-tùy-chọn)
5. [Cấu Hình Email Reminders](#-cấu-hình-email-reminders-tùy-chọn)
6. [Chạy Ứng Dụng](#-chạy-ứng-dụng)

---

## ✅ Yêu Cầu Hệ Thống

- **Node.js**: v18 trở lên
- **npm** hoặc **yarn**
- **Trình duyệt**: Chrome, Firefox, Safari, Edge (phiên bản mới nhất)

---

## 📦 Cài Đặt Cơ Bản

### 1. Clone Project

```bash
git clone <repository-url>
cd 1pixel-management
```

### 2. Install Dependencies

```bash
npm install
# hoặc
yarn install
```

### 3. Copy Environment File

```bash
cp .env.example .env
```

---

## 🗄️ Cấu Hình Supabase (BẮT BUỘC)

> **⚠️ QUAN TRỌNG:** Supabase là database chính của hệ thống. Không có Supabase thì app không hoạt động được!

### Bước 1: Tạo Supabase Project

1. Truy cập: https://supabase.com
2. Click **New Project**
3. Điền thông tin:
   - **Name**: `1pixel-management`
   - **Database Password**: Tạo password mạnh
   - **Region**: Southeast Asia (Singapore)
4. Click **Create new project**
5. Đợi 2-3 phút để Supabase khởi tạo

### Bước 2: Lấy API Credentials

1. Vào project → **Settings** → **API**
2. Copy 2 giá trị:
   - **Project URL**: `https://xxxxx.supabase.co`
   - **anon public key**: `eyJhbGc...`

### Bước 3: Tạo Database Tables

1. Vào **SQL Editor**
2. Copy & paste code từ file `/supabase/schema.sql`
3. Click **Run** để tạo tất cả tables

### Bước 4: Update .env File

Mở file `.env` và điền:

```env
VITE_SUPABASE_URL=https://xxxxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGc...
```

### ✅ Test Kết Nối

```bash
npm run dev
```

Nếu app load được và không có error → Supabase đã kết nối thành công! 🎉

---

## 📅 Cấu Hình Google Calendar (TÙY CHỌN)

> **💡 TÙY CHỌN:** Tính năng này cho phép tự động đồng bộ hosting/project lên Google Calendar. Nếu không cần, có thể bỏ qua.

### Quick Setup (5 phút)

1. **Xem hướng dẫn chi tiết:** [GOOGLE_CALENDAR_SETUP.md](/GOOGLE_CALENDAR_SETUP.md)

2. **Tóm tắt các bước:**
   - Tạo Google Cloud Project
   - Enable Google Calendar API
   - Tạo OAuth 2.0 Client ID
   - Copy Client ID & Secret vào `.env`

3. **Update .env:**

```env
VITE_GOOGLE_CLIENT_ID=123456789-xxx.apps.googleusercontent.com
VITE_GOOGLE_CLIENT_SECRET=GOCSPX-xxx
```

### ✅ Test Google Calendar

1. Mở app → **Settings** → **Google Calendar Integration**
2. Click **Kết nối Google Calendar**
3. Login với Google account
4. Thử sync 1 hosting

---

## 📧 Cấu Hình Email Reminders (TÙY CHỌN)

> **💡 TÙY CHỌN:** Tính năng này tự động gửi email nhắc nhở khi hosting sắp hết hạn. Nếu không cần, có thể bỏ qua.

### Quick Setup (5 phút)

1. **Xem hướng dẫn chi tiết:** [EMAIL_SETUP.md](/EMAIL_SETUP.md)

2. **Tóm tắt các bước:**
   - Đăng ký Resend.com (Free: 3,000 emails/month)
   - Get API Key
   - Set trong Supabase Secrets (không phải `.env`!)
   - Deploy Edge Function
   - Setup Cron Job

3. **Resend Dashboard:**
   - https://resend.com/api-keys
   - Copy API key: `re_xxx`

4. **Supabase Dashboard:**
   ```bash
   # Set secret
   supabase secrets set RESEND_API_KEY=re_xxx
   ```

### ✅ Test Email

1. Mở app → **Settings** → **Email Notifications**
2. Click **Gửi Email Test**
3. Kiểm tra inbox

---

## 🚀 Chạy Ứng Dụng

### Development Mode

```bash
npm run dev
```

App sẽ chạy tại: http://localhost:5173

### Production Build

```bash
npm run build
npm run preview
```

---

## 📱 Sử Dụng Cơ Bản

### 1. Thêm Hosting Đầu Tiên

1. Click tab **Hostings** trên sidebar
2. Click **+ Thêm Hosting**
3. Điền thông tin:
   ```
   Tên: Website Công Ty
   Domain: example.com
   Nhà cung cấp: HostGator
   Ngày đăng ký: 01/01/2025
   Ngày hết hạn: 01/01/2026
   Giá: 1200000
   ```
4. Click **Lưu**

### 2. Xem Dashboard

- Click tab **Dashboard**
- Xem thống kê:
  - 📊 Tổng số hosting
  - ⚠️ Hosting sắp hết hạn
  - 💰 Tổng chi phí
  - 📈 Biểu đồ

### 3. Quản Lý Project

- Click tab **Projects**
- Thêm project khách hàng
- Theo dõi trạng thái

### 4. Password Manager

- Click tab **Passwords**
- Lưu mật khẩu an toàn
- Phân loại theo category

### 5. CodeX

- Click tab **CodeX**
- Lưu các đoạn code hay dùng
- Syntax highlighting

---

## 🎨 Tính Năng Nổi Bật

### ✅ Đã Hoàn Thành 100%

- [x] **5 Modules Chính**
  - Dashboard với thống kê real-time
  - Hosting management với status tracking
  - Project management với customer info
  - Password manager với encryption
  - CodeX với syntax highlighting

- [x] **Supabase Integration**
  - 28 API endpoints
  - Real-time sync
  - Cloud backup

- [x] **Google Calendar Sync**
  - Auto-create events
  - 3 reminders per hosting
  - Color-coded events

- [x] **Email Notifications**
  - Auto send reminders
  - Resend API integration
  - Cron job automation

- [x] **Date Format**
  - DD/MM/YYYY (chuẩn Việt Nam)
  - DateInput component
  - Format utilities

- [x] **Loading Animations**
  - 🦆 Cute duck animation
  - Smooth transitions
  - Professional UX

- [x] **Export/Import**
  - ICS calendar files
  - JSON data backup
  - Migration tools

---

## 🐛 Troubleshooting

### ❌ Error: "Failed to fetch"

**Nguyên nhân:** Supabase URL/Key sai hoặc chưa cấu hình

**Giải pháp:**
1. Kiểm tra file `.env`
2. Verify Supabase credentials
3. Restart dev server

### ❌ Error: "Google Client ID not configured"

**Nguyên nhân:** Chưa setup Google Calendar

**Giải pháp:**
1. Xem [GOOGLE_CALENDAR_SETUP.md](/GOOGLE_CALENDAR_SETUP.md)
2. Hoặc bỏ qua tính năng này (optional)

### ❌ Tables không tồn tại

**Nguyên nhân:** Chưa chạy SQL schema

**Giải pháp:**
1. Vào Supabase SQL Editor
2. Run file `/supabase/schema.sql`

### ❌ Email không gửi được

**Nguyên nhân:** Resend API chưa setup

**Giải pháp:**
1. Xem [EMAIL_SETUP.md](/EMAIL_SETUP.md)
2. Hoặc bỏ qua tính năng này (optional)

---

## 📚 Tài Liệu Chi Tiết

- **Google Calendar:** [GOOGLE_CALENDAR_SETUP.md](/GOOGLE_CALENDAR_SETUP.md)
- **Email Setup:** [EMAIL_SETUP.md](/EMAIL_SETUP.md)
- **LocalStorage Migration:** [LOCALSTORAGE_REMOVAL.md](/LOCALSTORAGE_REMOVAL.md)
- **API Documentation:** [/supabase/API_ENDPOINTS.md](/supabase/API_ENDPOINTS.md)

---

## 🎯 Roadmap

### Phase 1: Core Features ✅ DONE
- ✅ All 5 modules
- ✅ Supabase integration
- ✅ Google Calendar sync
- ✅ Email notifications

### Phase 2: Enhancement (Future)
- [ ] Multi-user authentication
- [ ] Role-based access control
- [ ] Mobile app (React Native)
- [ ] Advanced analytics
- [ ] Slack/Discord notifications
- [ ] WhatsApp integration

---

## 🆘 Hỗ Trợ

### Issues & Bugs
- Kiểm tra Console logs (F12 → Console)
- Kiểm tra Network tab (F12 → Network)
- Xem Supabase logs trong Dashboard

### Contact
- Email: support@1pixel.com (example)
- GitHub Issues: Create new issue
- Documentation: Xem các file .md trong project

---

## ✅ Checklist Hoàn Chỉnh

### Minimum Setup (Required)
- [ ] ✅ Installed dependencies
- [ ] ✅ Created `.env` from `.env.example`
- [ ] ✅ Setup Supabase project
- [ ] ✅ Added Supabase credentials to `.env`
- [ ] ✅ Created database tables
- [ ] ✅ Started dev server
- [ ] ✅ App loads without errors

### Optional Features
- [ ] ⬜ Setup Google Calendar integration
- [ ] ⬜ Setup Email notifications
- [ ] ⬜ Configure custom domain
- [ ] ⬜ Deploy to production

---

## 🎉 HOÀN THÀNH!

Chúc mừng! Bạn đã setup thành công **1Pixel Management System**.

**Next steps:**
1. Thêm hosting đầu tiên
2. Xem dashboard statistics
3. Explore tất cả modules
4. Customize theo nhu cầu

**Have fun managing your hostings & projects!** 🚀

---

**Version:** 1.0.0  
**Last Updated:** January 21, 2025  
**Made with ❤️ by 1Pixel Team**
