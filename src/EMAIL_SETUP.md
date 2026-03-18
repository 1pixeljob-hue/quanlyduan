# 📧 Email Notifications Setup Guide

Hướng dẫn cấu hình Email Notifications cho hệ thống **1Pixel - Quản lý công việc tập trung**.

---

## 📋 Tổng Quan

Hệ thống tự động gửi email nhắc nhở khi:
- ✅ Hosting sắp hết hạn (30, 7, 1 ngày trước)
- ✅ Hosting hết hạn (ngày hết hạn)
- ✅ Project đến deadline
- ✅ Các cảnh báo quan trọng khác

---

## 🚀 Bước 1: Đăng Ký Resend

### 1.1. Tạo tài khoản miễn phí

1. Truy cập: **[https://resend.com](https://resend.com)**
2. Click **Sign Up** (hoặc Login nếu đã có tài khoản)
3. Xác nhận email

### 1.2. Lấy API Key

1. Vào **Dashboard** → **API Keys**
2. Click **Create API Key**
3. Đặt tên: `1pixel-production` (hoặc tên bất kỳ)
4. Click **Add**
5. **Copy** API Key (dạng `re_...`) - chỉ hiển thị 1 lần!

### 1.3. Free Tier Limits

- ✅ **3,000 emails/tháng** (miễn phí)
- ✅ **100 emails/ngày**
- ✅ **Unlimited domains**
- ✅ **Email analytics**

---

## 🔧 Bước 2: Cấu Hình Supabase

### 2.1. Add Secrets vào Supabase Edge Function

**Option A: Qua Supabase Dashboard (Khuyến nghị)**

1. Vào **Supabase Dashboard**
2. Chọn project của bạn
3. Vào **Edge Functions** → **Secrets**
4. Add 2 secrets sau:

| Secret Name | Value | Bắt buộc |
|------------|-------|----------|
| `RESEND_API_KEY` | `re_your_key_here` | ✅ Có |
| `FROM_EMAIL` | `noreply@yourdomain.com` | ❌ Không (optional) |

**Option B: Qua Supabase CLI**

```bash
# Install Supabase CLI (nếu chưa có)
npm install -g supabase

# Login vào Supabase
supabase login

# Link project
supabase link --project-ref your-project-id

# Set secrets
supabase secrets set RESEND_API_KEY=re_your_key_here
supabase secrets set FROM_EMAIL=noreply@yourdomain.com  # optional
```

### 2.2. Verify Secrets

```bash
supabase secrets list
```

Output mong đợi:
```
RESEND_API_KEY
FROM_EMAIL
```

---

## 📧 Bước 3: Cấu Hình Email Sender

### Option 1: Dùng Email Mặc Định (Testing)

- Không cần làm gì thêm
- Email gửi từ: `onboarding@resend.dev`
- ⚠️ **Chỉ dùng cho test**, có thể bị spam folder

### Option 2: Dùng Custom Domain (Production)

#### 3.1. Add Domain vào Resend

1. Vào **Resend Dashboard** → **Domains**
2. Click **Add Domain**
3. Nhập domain của bạn (VD: `yourdomain.com`)
4. Click **Add**

#### 3.2. Add DNS Records

Resend sẽ hiển thị các DNS records cần thêm:

```
Type: TXT
Name: @ (hoặc yourdomain.com)
Value: resend-verify=xxx...

Type: MX
Name: @ 
Value: feedback-smtp.us-east-1.amazonses.com
Priority: 10

Type: TXT
Name: _dmarc
Value: v=DMARC1; p=none;
```

**Hướng dẫn thêm DNS** (tuỳ nhà cung cấp):

**CloudFlare:**
1. Login → Chọn domain
2. DNS → Add Record
3. Copy/paste từng record từ Resend

**GoDaddy:**
1. My Products → Domain → DNS
2. Add → chọn Type → điền thông tin

**NameCheap:**
1. Domain List → Manage → Advanced DNS
2. Add New Record

#### 3.3. Verify Domain

1. Sau khi add DNS (chờ 5-10 phút)
2. Quay lại Resend → Click **Verify**
3. ✅ Status: **Verified**

#### 3.4. Update FROM_EMAIL

```bash
supabase secrets set FROM_EMAIL=noreply@yourdomain.com
```

---

## ⏰ Bước 4: Setup Cron Job

### 4.1. Tạo Cron Job trong Supabase

1. Vào **Supabase Dashboard**
2. Chọn **Database** → **Extensions**
3. Enable extension **`pg_cron`**

### 4.2. Add Cron Schedule

Vào **SQL Editor** và chạy:

```sql
-- Enable pg_cron extension
CREATE EXTENSION IF NOT EXISTS pg_cron;

-- Schedule daily email check at 9:00 AM UTC+7 (2:00 AM UTC)
SELECT cron.schedule(
  'check-expiring-hostings',
  '0 2 * * *', -- Cron expression: Every day at 2:00 AM UTC
  $$
  SELECT
    net.http_post(
      url := 'https://YOUR_PROJECT_ID.supabase.co/functions/v1/make-server-c138835e/cron/check-expiring-hostings',
      headers := '{"Authorization": "Bearer YOUR_ANON_KEY", "Content-Type": "application/json"}'::jsonb
    ) as request_id;
  $$
);
```

**Thay thế:**
- `YOUR_PROJECT_ID`: ID project Supabase của bạn
- `YOUR_ANON_KEY`: Anon key từ Settings → API

### 4.3. Verify Cron Job

```sql
-- Xem tất cả cron jobs
SELECT * FROM cron.job;

-- Xem lịch sử chạy
SELECT * FROM cron.job_run_details ORDER BY start_time DESC LIMIT 10;
```

### 4.4. Tuỳ Chỉnh Thời Gian

Cron expression format: `phút giờ ngày tháng thứ`

| Mô tả | Cron Expression |
|-------|-----------------|
| Mỗi ngày 9:00 AM UTC+7 | `0 2 * * *` |
| Mỗi ngày 8:00 AM UTC+7 | `0 1 * * *` |
| Mỗi 6 giờ | `0 */6 * * *` |
| Thứ 2-6 lúc 9:00 AM | `0 2 * * 1-5` |

---

## 🎯 Bước 5: Cấu Hình Qua UI

### 5.1. Truy cập Settings

1. Login vào hệ thống **1Pixel**
2. Vào **Settings** → **Email Notifications**

### 5.2. Cấu hình

1. **Bật Email Notifications**: Toggle ON
2. **Nhập email nhận**: `your-email@example.com`
3. **Chọn loại thông báo**:
   - ✅ 30 ngày trước hết hạn
   - ✅ 7 ngày trước hết hạn
   - ✅ 1 ngày trước & ngày hết hạn
   - ✅ Project deadlines
4. Click **Lưu Cài Đặt**

### 5.3. Test Email

1. Click nút **Test**
2. Check hộp thư (có thể trong spam folder)
3. ✅ Nếu nhận được → Setup thành công!

---

## 🧪 Testing

### Manual Test (Không cần đợi cron)

Gọi API trực tiếp:

```bash
curl -X POST \
  https://YOUR_PROJECT_ID.supabase.co/functions/v1/make-server-c138835e/cron/check-expiring-hostings \
  -H "Authorization: Bearer YOUR_ANON_KEY" \
  -H "Content-Type: application/json"
```

### Test từ Supabase SQL Editor

```sql
SELECT
  net.http_post(
    url := 'https://YOUR_PROJECT_ID.supabase.co/functions/v1/make-server-c138835e/cron/check-expiring-hostings',
    headers := '{"Authorization": "Bearer YOUR_ANON_KEY"}'::jsonb
  );
```

---

## 🔍 Troubleshooting

### ❌ Không nhận được email

**1. Check secrets:**
```bash
supabase secrets list
```
Phải có `RESEND_API_KEY`

**2. Check Resend Dashboard:**
- Logs → Xem email đã gửi chưa
- Nếu có error → xem error message

**3. Check spam folder:**
- Email có thể bị đánh dấu spam
- Thêm sender vào whitelist

**4. Check cron job:**
```sql
SELECT * FROM cron.job_run_details 
WHERE jobid = (SELECT jobid FROM cron.job WHERE jobname = 'check-expiring-hostings')
ORDER BY start_time DESC LIMIT 5;
```

### ❌ Cron job không chạy

**1. Check pg_cron extension:**
```sql
SELECT * FROM pg_extension WHERE extname = 'pg_cron';
```

**2. Check cron schedule:**
```sql
SELECT * FROM cron.job WHERE jobname = 'check-expiring-hostings';
```

**3. Check http extension:**
```sql
CREATE EXTENSION IF NOT EXISTS http;
```

### ❌ Email bị spam

**Solutions:**
1. ✅ Verify custom domain trong Resend
2. ✅ Add SPF, DKIM, DMARC records
3. ✅ Dùng FROM_EMAIL từ verified domain
4. ✅ Tránh dùng `onboarding@resend.dev` cho production

---

## 📊 Email Templates

Hệ thống có 3 loại email templates:

### 1. Hosting Expiration Email
- **Subject**: `⚠️ Hosting "[name]" sắp hết hạn sau [X] ngày`
- **Content**: 
  - Thông tin hosting (tên, domain, provider, giá)
  - Ngày hết hạn
  - Action items
  - Link admin panel

### 2. Project Deadline Email
- **Subject**: `📁 Project "[name]" cần hoàn thành sau [X] ngày`
- **Content**:
  - Thông tin project
  - Khách hàng
  - Trạng thái
  - Giá trị

### 3. Test Email
- **Subject**: `✅ Test Email - 1Pixel Email Notifications`
- **Content**: Xác nhận cấu hình thành công

---

## 🎨 Customization

### Thay đổi Email Template

Edit file: `/supabase/functions/server/email.ts`

```typescript
export function generateHostingExpirationEmail(
  hosting: any,
  daysUntilExpiry: number
): string {
  // Customize HTML template here
  return `<!DOCTYPE html>...`;
}
```

### Thay đổi Company Name

```typescript
const COMPANY_NAME = '1Pixel - Quản lý công việc tập trung';
```

### Thay đổi màu gradient

```typescript
background: linear-gradient(135deg, #4DBFAD 0%, #2563B4 100%);
```

---

## 📞 Support

Nếu gặp vấn đề:

1. **Resend Docs**: https://resend.com/docs
2. **Supabase Cron Docs**: https://supabase.com/docs/guides/database/extensions/pg_cron
3. **GitHub Issues**: Tạo issue trong repo

---

## ✅ Checklist Hoàn Thành

- [ ] Đăng ký Resend account
- [ ] Lấy Resend API key
- [ ] Add `RESEND_API_KEY` vào Supabase secrets
- [ ] (Optional) Add custom domain & verify
- [ ] (Optional) Add `FROM_EMAIL` secret
- [ ] Enable `pg_cron` extension
- [ ] Tạo cron schedule
- [ ] Cấu hình email trong Settings UI
- [ ] Test gửi email thành công
- [ ] Verify cron job chạy đúng giờ

🎉 **HOÀN THÀNH!** Email notifications đã sẵn sàng hoạt động!
