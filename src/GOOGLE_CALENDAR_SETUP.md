# 📅 Google Calendar Integration - Hướng Dẫn Cấu Hình

## 🎯 Mục Tiêu

Tích hợp Google Calendar API để tự động đồng bộ hosting và project lên Google Calendar với các tính năng:
- ✅ Tự động tạo events khi thêm hosting/project
- ✅ 3 lần nhắc nhở cho mỗi hosting (7 ngày, 1 ngày, ngày hết hạn)
- ✅ Màu sắc khác nhau cho từng loại nhắc nhở
- ✅ Email & popup reminders
- ✅ Đồng bộ real-time

---

## 📋 Yêu Cầu

1. **Google Account** - Tài khoản Google để sử dụng Google Calendar
2. **Google Cloud Console** - Để tạo OAuth 2.0 credentials
3. **Domain hoặc localhost** - Để test (localhost:3000 hoặc domain thật)

---

## 🚀 BƯỚC 1: TẠO GOOGLE CLOUD PROJECT

### 1.1. Truy cập Google Cloud Console

Mở trình duyệt và truy cập:
```
https://console.cloud.google.com/
```

### 1.2. Tạo Project Mới

1. Click vào dropdown **Select a project** ở góc trên bên trái
2. Click **NEW PROJECT**
3. Điền thông tin:
   - **Project name**: `1Pixel Management System`
   - **Organization**: Để trống (No organization)
   - **Location**: Để trống
4. Click **CREATE**

### 1.3. Đợi Project Được Tạo

Đợi 10-30 giây để Google tạo project. Sau đó select project vừa tạo.

---

## 🔑 BƯỚC 2: BẬT GOOGLE CALENDAR API

### 2.1. Vào API Library

1. Trong Google Cloud Console, mở menu bên trái (☰)
2. Chọn **APIs & Services** → **Library**
3. Hoặc truy cập trực tiếp:
   ```
   https://console.cloud.google.com/apis/library
   ```

### 2.2. Tìm Google Calendar API

1. Trong ô search, gõ: `Google Calendar API`
2. Click vào **Google Calendar API** trong kết quả
3. Click nút **ENABLE**

### 2.3. Chờ API Được Kích Hoạt

Đợi vài giây cho API được enable.

---

## 🔐 BƯỚC 3: TẠO OAUTH 2.0 CREDENTIALS

### 3.1. Vào Credentials

1. Trong menu bên trái, chọn **APIs & Services** → **Credentials**
2. Hoặc truy cập:
   ```
   https://console.cloud.google.com/apis/credentials
   ```

### 3.2. Cấu Hình OAuth Consent Screen

**⚠️ BẮT BUỘC: Phải làm bước này trước khi tạo credentials!**

1. Click tab **OAuth consent screen**
2. Chọn **User Type**:
   - ✅ **External** (cho testing và production)
   - Click **CREATE**

3. **Điền App Information**:
   ```
   App name: 1Pixel Management
   User support email: your-email@gmail.com
   App logo: (Optional - có thể bỏ qua)
   ```

4. **App Domain**:
   ```
   Application home page: http://localhost:5173
   Application privacy policy link: http://localhost:5173/privacy (optional)
   Application terms of service link: http://localhost:5173/terms (optional)
   ```

5. **Developer Contact Information**:
   ```
   Email addresses: your-email@gmail.com
   ```

6. Click **SAVE AND CONTINUE**

7. **Scopes**: Click **ADD OR REMOVE SCOPES**
   - Tìm và check: `https://www.googleapis.com/auth/calendar.events`
   - Click **UPDATE**
   - Click **SAVE AND CONTINUE**

8. **Test Users** (Chế độ Testing):
   - Click **ADD USERS**
   - Thêm email của bạn: `your-email@gmail.com`
   - Click **ADD**
   - Click **SAVE AND CONTINUE**

9. **Summary**:
   - Review lại thông tin
   - Click **BACK TO DASHBOARD**

### 3.3. Tạo OAuth Client ID

1. Quay lại **Credentials** tab
2. Click **+ CREATE CREDENTIALS** → **OAuth client ID**

3. **Application type**: Chọn `Web application`

4. **Name**: `1Pixel Web Client`

5. **Authorized JavaScript origins**:
   ```
   http://localhost:5173
   https://localhost:5173
   ```
   
   **Nếu đã có domain:**
   ```
   https://yourdomain.com
   ```

6. **Authorized redirect URIs**:
   ```
   http://localhost:5173
   https://localhost:5173
   ```
   
   **Nếu đã có domain:**
   ```
   https://yourdomain.com
   ```

7. Click **CREATE**

### 3.4. Lưu Credentials

Một popup sẽ hiện ra với:
```
Your Client ID: 123456789-abcdefg.apps.googleusercontent.com
Your Client Secret: GOCSPX-abc123def456
```

**⚠️ QUAN TRỌNG:** Copy cả 2 giá trị này!

---

## 📝 BƯỚC 4: CẤU HÌNH ENVIRONMENT VARIABLES

### 4.1. Tạo/Mở File `.env`

Trong thư mục root của project, tạo file `.env`:

```bash
# Nếu chưa có file
touch .env

# Hoặc mở file có sẵn
nano .env
```

### 4.2. Thêm Google Credentials

Thêm vào file `.env`:

```env
# Google Calendar API Configuration
VITE_GOOGLE_CLIENT_ID=123456789-abcdefg.apps.googleusercontent.com
VITE_GOOGLE_CLIENT_SECRET=GOCSPX-abc123def456
VITE_GOOGLE_API_KEY=

# Supabase Configuration (đã có sẵn)
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```

**Lưu ý:**
- `VITE_GOOGLE_API_KEY` có thể để trống (không bắt buộc cho OAuth)
- Thay `123456789-abcdefg.apps.googleusercontent.com` bằng Client ID của bạn
- Thay `GOCSPX-abc123def456` bằng Client Secret của bạn

### 4.3. Restart Development Server

```bash
# Stop server hiện tại (Ctrl + C)
# Restart
npm run dev
```

---

## ✅ BƯỚC 5: TEST GOOGLE CALENDAR INTEGRATION

### 5.1. Mở Ứng Dụng

```
http://localhost:5173
```

### 5.2. Vào Settings Module

1. Click tab **Settings** trên sidebar
2. Tìm phần **Google Calendar Integration**

### 5.3. Authorize Google Calendar

1. Click nút **🔗 Kết nối Google Calendar**
2. Popup Google Sign-in sẽ hiện ra
3. Chọn tài khoản Google của bạn
4. **Quan trọng:** Nếu thấy warning "Google hasn't verified this app"
   - Click **Advanced**
   - Click **Go to 1Pixel Management (unsafe)**
   - ✅ Đây là bình thường vì app đang ở chế độ Testing
5. Click **Allow** để cấp quyền truy cập Calendar
6. Popup sẽ đóng và status sẽ chuyển thành **✅ Đã kết nối**

### 5.4. Đồng Bộ Hosting

1. Vào module **Hostings**
2. Thêm một hosting mới:
   ```
   Tên: Test Hosting
   Domain: test.com
   Nhà cung cấp: HostGator
   Ngày đăng ký: 01/01/2025
   Ngày hết hạn: 01/02/2025
   Giá: 1000000
   ```
3. Click **Lưu**

### 5.5. Kiểm Tra Google Calendar

1. Mở Google Calendar: https://calendar.google.com
2. Bạn sẽ thấy **3 events** được tạo:
   - 🔵 **Test Hosting - 7 ngày trước hết hạn** (25/01/2025)
   - 🟠 **Test Hosting - 1 ngày trước hết hạn** (31/01/2025)
   - 🔴 **Test Hosting - Ngày hết hạn** (01/02/2025)

### 5.6. Test Update & Delete

**Update:**
1. Sửa hosting, đổi ngày hết hạn
2. Calendar sẽ tự động update

**Delete:**
1. Xóa hosting
2. Calendar events sẽ tự động bị xóa

---

## 🎨 BƯỚC 6: TÍNH NĂNG NÂNG CAO

### 6.1. Sync Tất Cả Hostings

Trong Settings → Google Calendar:
- Click **🔄 Đồng bộ tất cả Hosting**
- Tất cả hostings sẽ được sync lên Calendar

### 6.2. Sync Tất Cả Projects

Trong Settings → Google Calendar:
- Click **🔄 Đồng bộ tất cả Project**
- Tất cả projects sẽ được sync lên Calendar

### 6.3. Export ICS File

Mỗi hosting card có nút **📅 Thêm vào lịch**:
- Click để download file `.ics`
- Import vào bất kỳ calendar app nào (Outlook, Apple Calendar, etc.)

---

## 🔒 BƯỚC 7: PUBLISH APP (PRODUCTION)

### 7.1. Chế Độ Testing vs Production

**Testing Mode** (hiện tại):
- ✅ Chỉ 100 users
- ✅ Token hết hạn sau 7 ngày
- ⚠️ Warning "App isn't verified"

**Production Mode**:
- ✅ Unlimited users
- ✅ Token không giới hạn
- ✅ Không có warning

### 7.2. Chuyển Sang Production

1. Vào **OAuth consent screen**
2. Click **PUBLISH APP**
3. **⚠️ Lưu ý:** Google sẽ yêu cầu verification nếu:
   - App yêu cầu sensitive scopes
   - Có nhiều hơn 100 users

### 7.3. Google Verification (Nếu Cần)

Để được verified bởi Google:
1. Submit verification request
2. Cung cấp:
   - Privacy Policy URL
   - Terms of Service URL
   - App domain ownership proof
   - YouTube demo video (2 phút)
3. Đợi 3-7 ngày để Google review

**Lưu ý:** Đối với internal app (ít hơn 100 users), không cần verify.

---

## 🐛 TROUBLESHOOTING

### ❌ Error: "Google Client ID is not configured"

**Nguyên nhân:** File `.env` chưa có hoặc sai format

**Giải pháp:**
```bash
# Kiểm tra file .env có tồn tại không
ls -la .env

# Kiểm tra nội dung
cat .env

# Đảm bảo có dòng:
VITE_GOOGLE_CLIENT_ID=your-client-id-here
```

### ❌ Error: "Redirect URI mismatch"

**Nguyên nhân:** Redirect URI trong Google Console không khớp với URL app

**Giải pháp:**
1. Vào Google Console → Credentials → OAuth Client
2. Edit **Authorized redirect URIs**
3. Thêm đúng URL: `http://localhost:5173`
4. Save và đợi 5 phút

### ❌ Error: "Access blocked: This app's request is invalid"

**Nguyên nhân:** OAuth consent screen chưa config đúng

**Giải pháp:**
1. Vào **OAuth consent screen**
2. Kiểm tra:
   - ✅ User type = External
   - ✅ Scopes = `calendar.events`
   - ✅ Test users = Email của bạn
3. Save changes

### ❌ Error: "Invalid token" hoặc "Token expired"

**Nguyên nhân:** Token đã hết hạn (7 ngày trong Testing mode)

**Giải pháp:**
```typescript
// Trong app, click:
Settings → Google Calendar → "Ngắt kết nối"
// Sau đó kết nối lại
```

### ❌ Events không hiện trong Calendar

**Kiểm tra:**

1. **Calendar permissions:**
   ```
   Google Calendar → Settings → Calendar settings → 
   Access permissions → Make available to public ✅
   ```

2. **Console logs:**
   ```
   F12 → Console tab → Xem có errors không
   ```

3. **Network tab:**
   ```
   F12 → Network tab → 
   Filter: calendar.events.insert
   → Xem response
   ```

---

## 📊 GIỚI HẠN VÀ QUOTA

### Free Tier Limits:

```
Google Calendar API (Free):
├─ Requests per day: 1,000,000
├─ Requests per 100 seconds: 50,000
├─ Requests per user per 100 seconds: 500
└─ Events per calendar: Unlimited
```

### Best Practices:

✅ **Batch operations** khi sync nhiều items
✅ **Cache tokens** để tránh re-auth
✅ **Error handling** với retry logic
✅ **Rate limiting** khi có nhiều users

---

## 🔐 BẢO MẬT

### ⚠️ QUAN TRỌNG:

1. **Không commit `.env` file lên Git**
   ```bash
   # Thêm vào .gitignore
   echo ".env" >> .gitignore
   ```

2. **Client Secret phải được bảo vệ**
   - ❌ Không expose trong frontend code
   - ✅ Chỉ dùng trong backend/server-side

3. **Token storage**
   - Hiện tại: localStorage (OK cho testing)
   - Production: Nên dùng secure cookie hoặc encrypt

4. **Scope permissions**
   - ✅ Chỉ yêu cầu `calendar.events` (minimum needed)
   - ❌ Không yêu cầu full calendar access

---

## 📚 TÀI LIỆU THAM KHẢO

### Official Documentation:

- **Google Calendar API:** https://developers.google.com/calendar/api/guides/overview
- **OAuth 2.0:** https://developers.google.com/identity/protocols/oauth2
- **JavaScript Client:** https://github.com/google/google-api-javascript-client

### Code Examples:

```typescript
// Create event
await googleCalendar.createHostingEvent(hosting);

// Update event
await googleCalendar.updateHostingEvent(hosting);

// Delete event
await googleCalendar.deleteHostingEvent(hostingId);

// Check authorization
const isAuth = googleCalendar.isAuthorized();

// Sign out
googleCalendar.signOutGoogleCalendar();
```

---

## ✅ CHECKLIST HOÀN CHỈNH

Kiểm tra lại toàn bộ setup:

### Google Cloud Console:
- [ ] ✅ Created Google Cloud Project
- [ ] ✅ Enabled Google Calendar API
- [ ] ✅ Configured OAuth consent screen
- [ ] ✅ Created OAuth 2.0 Client ID
- [ ] ✅ Added authorized JavaScript origins
- [ ] ✅ Added authorized redirect URIs

### Local Setup:
- [ ] ✅ Created `.env` file
- [ ] ✅ Added `VITE_GOOGLE_CLIENT_ID`
- [ ] ✅ Added `VITE_GOOGLE_CLIENT_SECRET`
- [ ] ✅ Restarted dev server
- [ ] ✅ `.env` is in `.gitignore`

### Testing:
- [ ] ✅ Opened app in browser
- [ ] ✅ Connected Google Calendar
- [ ] ✅ Created test hosting
- [ ] ✅ Verified events in Google Calendar
- [ ] ✅ Tested update hosting
- [ ] ✅ Tested delete hosting

### Production (Optional):
- [ ] ⬜ Published OAuth app
- [ ] ⬜ Submitted for Google verification
- [ ] ⬜ Updated redirect URIs with production domain
- [ ] ⬜ Configured production environment variables

---

## 🎉 HOÀN THÀNH!

Bây giờ hệ thống của bạn đã tích hợp đầy đủ Google Calendar với:

✅ Auto-sync hostings khi create/update/delete
✅ 3 reminders cho mỗi hosting (7 days, 1 day, expiry day)
✅ Color-coded events (Blue, Orange, Red)
✅ Email & popup notifications
✅ Export ICS files
✅ Sync all hostings/projects với 1 click

**Cần hỗ trợ?** Kiểm tra phần Troubleshooting hoặc xem Console logs!

---

**Last updated:** January 21, 2025
**Version:** 1.0.0
**Author:** 1Pixel Team
