# 🔧 Email Notifications Troubleshooting

## ❌ Vấn đề: Test Email không gửi được

### Bạn đã làm đúng:
✅ Tạo secret `RESEND_API_KEY` trong Supabase Dashboard  
✅ Value: `re_MPAeaRd7_Nkfnhqz31LN8cYR44RqDXMQB`

### Vấn đề:
🔴 **Edge Function cần được RESTART sau khi thêm secret!**

Edge Functions cache environment variables. Khi bạn thêm secret mới, function đang chạy không tự động load secret mới.

---

## 🚀 GIẢI PHÁP: Restart Edge Function

### Option 1: Restart qua Supabase Dashboard (ĐƠN GIẢN NHẤT)

#### Bước 1: Vào Edge Functions
```
https://supabase.com/dashboard/project/YOUR_PROJECT_ID/functions
```

#### Bước 2: Tìm Function
- Function name: `make-server-c138835e`

#### Bước 3: Restart Function
1. Click vào function name
2. Click tab **Settings** hoặc **...** menu
3. Tìm nút **Restart** hoặc **Redeploy**
4. Click **Restart** / **Redeploy**

**⏱️ Đợi 10-30 giây để function restart**

---

### Option 2: Redeploy Function qua CLI (ADVANCED)

#### Bước 1: Install Supabase CLI (nếu chưa có)

```bash
# macOS / Linux
brew install supabase/tap/supabase

# npm (cross-platform)
npm install -g supabase
```

#### Bước 2: Login
```bash
supabase login
```

#### Bước 3: Link Project
```bash
supabase link --project-ref YOUR_PROJECT_ID
```

Thay `YOUR_PROJECT_ID` bằng project ID của bạn.

#### Bước 4: Deploy Function
```bash
# Deploy tất cả functions
supabase functions deploy

# Hoặc deploy specific function
supabase functions deploy make-server-c138835e
```

#### Bước 5: Verify Deployment
```bash
supabase functions list
```

Output sẽ show function status: **ACTIVE**

---

### Option 3: Trigger Restart bằng Code Change (HACK)

#### Bước 1: Mở File
```bash
# Edit bất kỳ file nào trong /supabase/functions/server/
# Ví dụ: index.tsx
```

#### Bước 2: Thêm Comment
```typescript
// Force redeploy - 2026-01-21
```

#### Bước 3: Commit & Push (nếu có Auto-deploy)
```bash
git add .
git commit -m "Force redeploy edge function"
git push
```

**Lưu ý:** Chỉ work nếu bạn có CI/CD setup!

---

## ✅ SAU KHI RESTART: Test Email

### Bước 1: Mở App
```
http://localhost:5173
```

### Bước 2: Vào Settings
Settings → Email Notifications

### Bước 3: Nhập Email
```
your-email@example.com
```

### Bước 4: Click Test
Click nút **Test** bên cạnh email field

### Bước 5: Kiểm tra Response

**✅ THÀNH CÔNG:**
```
✅ Email test đã được gửi đến your-email@example.com
Vui lòng kiểm tra hộp thư!
```

**❌ VẪN LỖI:** Xem phần dưới

---

## 🐛 NẾU VẪN LỖI

### Error 1: "RESEND_API_KEY is not set"

**Nguyên nhân:** Function chưa load được secret

**Giải pháp:**
1. Verify secret exists:
   ```
   Dashboard → Settings → Vault
   Tìm: RESEND_API_KEY
   ```
2. Restart function (xem Option 1 ở trên)
3. Đợi 30 giây
4. Try again

---

### Error 2: "Failed to send email"

**Nguyên nhân:** API key không hợp lệ

**Giải pháp:**

#### A. Kiểm tra API Key format
```
API key phải bắt đầu với: re_
Ví dụ: re_MPAeaRd7_Nkfnhqz31LN8cYR44RqDXMQB
```

#### B. Verify API Key trong Resend
1. Login: https://resend.com/api-keys
2. Kiểm tra API key có tồn tại không
3. Nếu không có, create new API key
4. Update secret trong Supabase:
   ```
   Dashboard → Vault → RESEND_API_KEY → Edit
   ```

#### C. Test API Key trực tiếp
```bash
curl -X POST 'https://api.resend.com/emails' \
  -H 'Authorization: Bearer re_MPAeaRd7_Nkfnhqz31LN8cYR44RqDXMQB' \
  -H 'Content-Type: application/json' \
  -d '{
    "from": "onboarding@resend.dev",
    "to": "your-email@example.com",
    "subject": "Test",
    "html": "<p>Test email</p>"
  }'
```

**Nếu curl thành công → API key OK → Problem ở Edge Function**

---

### Error 3: "Network Error" / "Failed to fetch"

**Nguyên nhân:** Edge Function không chạy

**Giải pháp:**

#### A. Kiểm tra Function Status
```
Dashboard → Functions → make-server-c138835e
Status: ACTIVE (green) ✅
Status: PAUSED (red) ❌
```

Nếu PAUSED → Click **Resume**

#### B. Check Function Logs
```
Dashboard → Functions → make-server-c138835e → Logs
```

Tìm errors:
- `RESEND_API_KEY is not set`
- `Failed to send email`
- Network errors

#### C. Test Function Endpoint
```bash
# Health check
curl https://YOUR_PROJECT_ID.supabase.co/functions/v1/make-server-c138835e/health

# Should return:
{"status":"ok"}
```

---

### Error 4: Email không đến inbox

**Kiểm tra:**

1. **Spam folder?**
   - Check spam/junk folder
   - Mark as "Not Spam"

2. **Email chính xác?**
   - Kiểm tra typo
   - Try với email khác

3. **Resend logs?**
   ```
   https://resend.com/emails
   ```
   - Xem email có được gửi không
   - Check delivery status
   - Xem bounce/spam reports

4. **Domain issues?**
   - Nếu dùng custom FROM_EMAIL
   - Domain phải được verify trong Resend
   - Hoặc bỏ FROM_EMAIL để dùng default: `onboarding@resend.dev`

---

## 📊 VERIFY SETUP HOÀN CHỈNH

### Checklist:

```
✅ Secret RESEND_API_KEY đã tạo trong Supabase Vault
✅ Value: re_MPAeaRd7_Nkfnhqz31LN8cYR44RqDXMQB
✅ Edge Function đã RESTART
✅ Function status: ACTIVE
✅ Test email đã gửi thành công
✅ Email đã nhận trong inbox
```

---

## 🔍 DEBUG MODE

### Enable Detailed Logging

#### Bước 1: Mở Supabase Dashboard
```
Dashboard → Functions → make-server-c138835e → Logs
```

#### Bước 2: Filter Logs
```
Time range: Last 15 minutes
Log level: All
Search: "test-email"
```

#### Bước 3: Send Test Email
Trong app, click **Test** button

#### Bước 4: Xem Logs Real-time
Logs sẽ hiển thị:

**✅ Success:**
```
POST /make-server-c138835e/cron/send-test-email
Email sent successfully: [email_id]
Response: 200 OK
```

**❌ Error:**
```
POST /make-server-c138835e/cron/send-test-email
RESEND_API_KEY is not set
Response: 500 Error
```

---

## 🆘 VẪN KHÔNG ĐƯỢC?

### Manual Test bằng curl

```bash
# Test endpoint
curl -X POST \
  'https://YOUR_PROJECT_ID.supabase.co/functions/v1/make-server-c138835e/cron/send-test-email' \
  -H 'Content-Type: application/json' \
  -H 'Authorization: Bearer YOUR_ANON_KEY' \
  -d '{"email":"your-email@example.com"}'
```

**Thay thế:**
- `YOUR_PROJECT_ID`: Project ID
- `YOUR_ANON_KEY`: Anon key từ Settings → API

**Expected response:**
```json
{
  "success": true,
  "message": "Test email sent successfully"
}
```

**Error response:**
```json
{
  "success": false,
  "error": "RESEND_API_KEY is not set"
}
```

---

## 📞 CONTACT SUPPORT

Nếu đã thử tất cả và vẫn không được:

### 1. Check Resend Status
```
https://status.resend.com
```

### 2. Check Supabase Status
```
https://status.supabase.com
```

### 3. Resend Support
- Discord: https://resend.com/discord
- Email: support@resend.com

### 4. Supabase Support
- Discord: https://discord.supabase.com
- Forum: https://github.com/supabase/supabase/discussions

---

## 🎯 QUICK FIX CHECKLIST

Làm theo thứ tự:

```
1. ✅ Secret RESEND_API_KEY đã tạo?
   → Dashboard → Vault → Check

2. ✅ Secret value đúng?
   → re_MPAeaRd7_Nkfnhqz31LN8cYR44RqDXMQB

3. ✅ Edge Function đã RESTART?
   → Dashboard → Functions → Restart

4. ✅ Đợi 30 giây sau restart?
   → Đợi cho function khởi động lại

5. ✅ Function status ACTIVE?
   → Dashboard → Functions → Check status

6. ✅ Test lại?
   → App → Settings → Email → Test

7. ✅ Check logs?
   → Dashboard → Functions → Logs

8. ✅ Check Resend logs?
   → https://resend.com/emails
```

---

## ✅ KẾT LUẬN

**Vấn đề chính:** Edge Function cần RESTART sau khi thêm secret!

**Giải pháp:**
1. Dashboard → Functions → make-server-c138835e
2. Click **Restart** / **Redeploy**
3. Đợi 30 giây
4. Test lại

**99% cases đều fix được bằng cách restart function!** 🎉

---

**Last Updated:** January 21, 2026  
**Version:** 1.0.0
