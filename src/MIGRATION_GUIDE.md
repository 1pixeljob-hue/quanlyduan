# 📦 Hướng Dẫn Migration Dữ Liệu

## Tổng Quan

Hệ thống **1Pixel - Quản lý công việc tập trung** đã được nâng cấp từ localStorage lên **Supabase Backend**.

## ✨ Lợi Ích Khi Migration

### 🔒 Bảo mật & An toàn
- Dữ liệu được lưu trữ trên cloud an toàn
- Không bị mất khi xóa cache trình duyệt
- Backup tự động

### 🔄 Đồng bộ đa thiết bị
- Truy cập dữ liệu từ mọi thiết bị
- Real-time sync giữa các thiết bị
- Không cần export/import thủ công

### 👥 Multi-user Support (Sắp ra mắt)
- Mỗi user có tài khoản riêng
- Phân quyền truy cập
- Chia sẻ dữ liệu team

### 📧 Email Notifications (Sắp ra mắt)
- Tự động gửi email nhắc nhở hosting/project hết hạn
- Tùy chỉnh tần suất nhắc nhở
- Không lo quên gia hạn

### 📅 Google Calendar Integration (Sắp ra mắt)
- Tự động đồng bộ với Google Calendar
- Nhắc nhở thông minh
- Quản lý deadline tập trung

## 🚀 Cách Thực Hiện Migration

### Bước 1: Vào Trang Settings
1. Mở ứng dụng 1Pixel
2. Click vào **"Cài Đặt"** ở sidebar
3. Tìm phần **"Chuyển Dữ Liệu Sang Supabase"** (ở đầu trang)

### Bước 2: Kiểm Tra Dữ Liệu
Trước khi migration, hãy đảm bảo:
- ✅ Dữ liệu trong localStorage đã được lưu đầy đủ
- ✅ Backup dữ liệu (nếu cần) bằng nút **"Xuất Dữ Liệu"**

### Bước 3: Thực Hiện Migration
1. Click nút **"Bắt Đầu Migration"**
2. Xác nhận trong hộp thoại
3. Đợi quá trình hoàn tất (thường < 5 giây)

### Bước 4: Xác Nhận Thành Công
Sau khi migration xong, bạn sẽ thấy:
```
✅ Migration Thành Công!

• Hostings: X
• Projects: Y
• Passwords: Z
• Categories: A
• CodeX Items: B
```

## ⚠️ Lưu Ý Quan Trọng

### Dữ Liệu LocalStorage
- **KHÔNG BỊ XÓA** sau khi migration
- Vẫn có thể sử dụng như backup
- Có thể xóa thủ công sau khi đã kiểm tra Supabase hoạt động ổn định

### Tính Năng Hiện Tại
✅ **Đã hoàn thành:**
- Migration tool (chuyển dữ liệu)
- Backend API (CRUD operations)
- Lưu trữ trên Supabase KV Store

🚧 **Đang phát triển:**
- Authentication (đăng ký/đăng nhập)
- Email notifications
- Google Calendar sync

## 🛠️ Kiến Trúc Hệ Thống

### Backend Stack
```
Frontend (React) 
    ↓
Supabase Edge Functions (Hono Server)
    ↓
KV Store Database
```

### API Endpoints
Tất cả endpoints đều có prefix: `/make-server-c138835e/`

**Hosting:**
- `GET /hostings` - Lấy danh sách
- `POST /hostings` - Tạo mới
- `PUT /hostings/:id` - Cập nhật
- `DELETE /hostings/:id` - Xóa

**Project:**
- `GET /projects`
- `POST /projects`
- `PUT /projects/:id`
- `DELETE /projects/:id`

**Password:**
- `GET /passwords`
- `POST /passwords`
- `PUT /passwords/:id`
- `DELETE /passwords/:id`

**Category:**
- `GET /categories`
- `POST /categories`
- `PUT /categories/:id`
- `DELETE /categories/:id`

**CodeX:**
- `GET /codex`
- `POST /codex`
- `PUT /codex/:id`
- `DELETE /codex/:id`

**Migration:**
- `POST /migrate` - Chuyển dữ liệu từ localStorage

## 🐛 Troubleshooting

### Lỗi: "Migration failed"
**Nguyên nhân:** Kết nối mạng không ổn định hoặc server bận

**Giải pháp:**
1. Kiểm tra kết nối internet
2. Thử lại sau vài giây
3. Nếu vẫn lỗi, báo lỗi cho admin

### Dữ liệu bị trùng lặp
**Nguyên nhân:** Chạy migration nhiều lần

**Giải pháp:**
1. Hiện tại: Chấp nhận dữ liệu trùng (không ảnh hưởng)
2. Tương lai: Sẽ có tính năng deduplicate

### Thiếu dữ liệu sau migration
**Nguyên nhân:** LocalStorage bị lỗi hoặc rỗng

**Giải pháp:**
1. Kiểm tra localStorage có dữ liệu không
2. Khôi phục từ file backup (nếu có)
3. Chạy lại migration

## 📞 Hỗ Trợ

Nếu gặp vấn đề, hãy:
1. Kiểm tra console log (F12 → Console)
2. Chụp màn hình lỗi
3. Liên hệ support với thông tin chi tiết

## 🎯 Roadmap Tiếp Theo

### Phase 2: Authentication (Tuần 2-3/2025)
- [ ] Email/Password signup
- [ ] Google OAuth login
- [ ] User profile management
- [ ] Session management

### Phase 3: Email Notifications (Tuần 4/2025)
- [ ] Cron job kiểm tra hết hạn
- [ ] SendGrid/Resend integration
- [ ] Customizable notification settings
- [ ] Email templates

### Phase 4: Calendar Integration (Tháng 2/2025)
- [ ] Google Calendar API
- [ ] Outlook Calendar API
- [ ] Auto-sync expiration dates
- [ ] Two-way sync

## 📝 Changelog

### v1.1.0 (2025-01-20)
- ✅ Thêm Supabase backend
- ✅ API endpoints đầy đủ cho 5 modules
- ✅ Migration tool
- ✅ Backend infrastructure

### v1.0.0 (2025-01-15)
- ✅ 5 modules: Dashboard, Hosting, Project, Password, CodeX
- ✅ Calendar export (.ics)
- ✅ LocalStorage persistence
- ✅ Responsive UI

---

**1Pixel Team** | Version 1.1.0 | January 2025
