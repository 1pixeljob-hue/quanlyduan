# 📧 Email Notifications Setup - Hướng Dẫn Chi Tiết

## 🎯 Tổng Quan

Hệ thống Email Notifications tự động gửi email nhắc nhở khi:
- 🌐 Hosting sắp hết hạn (30 ngày, 7 ngày, 1 ngày trước)
- 📁 Project đến deadline
- ⚠️ Các cảnh báo quan trọng khác

**API sử dụng:** [Resend.com](https://resend.com)  
**Free Tier:** 3,000 emails/tháng (100 emails/ngày)  
**Thời gian setup:** ~5 phút

---

## 📋 Yêu Cầu

- ✅ Đã setup Supabase (xem [QUICK_START.md](QUICK_START.md))
- ✅ Supabase CLI installed (hoặc dùng Dashboard)
- ✅ Email để nhận thông báo

---

## 🚀 BƯỚC 1: ĐĂNG KÝ RESEND

### 1.1. Truy cập Resend.com

```
https://resend.com
```

### 1.2. Sign Up

1. Click **Sign Up**
2. Nhập email của bạn
3. Verify email (check inbox)
4. Hoàn tất đăng ký

### 1.3. Login

```
https://resend.com/login
```

---

## 🔑 BƯỚC 2: LẤY API KEY

### 2.1. Vào API Keys

1. Sau khi login, vào **API Keys** trong sidebar
2. Hoặc truy cập trực tiếp:
   ```
   https://resend.com/api-keys
   ```

### 2.2. Create API Key

1. Click **+ Create API Key**
2. Điền thông tin:
   ```
   Name: 1Pixel Management Production
   Permission: Full Access (hoặc Send emails only)
   Domain: All domains (hoặc select specific domain)
   ```
3. Click **Create**

### 2.3. Copy API Key

**⚠️ QUAN TRỌNG:** API Key chỉ hiển thị 1 lần duy nhất!

```
re_MPAeaRd7_Nkfnhqz31LN8cYR44RqDXMQB
```

**Lưu API key này vào nơi an toàn!**

---

## ⚙️ BƯỚC 3: CẤU HÌNH SUPABASE

### 3.1. Option A: Sử dụng Supabase Dashboard (Đơn giản nhất)

#### Bước 1: Mở Supabase Dashboard

```
https://supabase.com/dashboard/project/YOUR_PROJECT_ID/settings/vault
```

Thay `YOUR_PROJECT_ID` bằng project ID của bạn.

#### Bước 2: Vào Secrets

1. Trong sidebar: **Settings** → **Vault** (hoặc **Secrets**)
2. Click **New Secret**

#### Bước 3: Thêm RESEND_API_KEY

```
Name: RESEND_API_KEY
Value: re_MPAeaRd7_Nkfnhqz31LN8cYR44RqDXMQB
```

Click **Save**.

#### Bước 4: (Optional) Thêm FROM_EMAIL

```
Name: FROM_EMAIL
Value: notifications@yourdomain.com
```

**Lưu ý:** 
- Nếu không set, sẽ dùng default: `onboarding@resend.dev`
- Để dùng custom email, cần verify domain (xem Bước 4)

---

### 3.2. Option B: Sử dụng Supabase CLI (Advanced)

#### Bước 1: Install Supabase CLI

```bash
# macOS / Linux
brew install supabase/tap/supabase

# Windows (PowerShell)
scoop bucket add supabase https://github.com/supabase/scoop-bucket.git
scoop install supabase

# npm (cross-platform)
npm install -g supabase
```

#### Bước 2: Login

```bash
supabase login
```

Browser sẽ mở để bạn authenticate.

#### Bước 3: Link Project

```bash
supabase link --project-ref YOUR_PROJECT_ID
```

#### Bước 4: Set Secrets

```bash
# Set RESEND_API_KEY
supabase secrets set RESEND_API_KEY=re_MPAeaRd7_Nkfnhqz31LN8cYR44RqDXMQB

# Optional: Set FROM_EMAIL
supabase secrets set FROM_EMAIL=notifications@yourdomain.com
```

#### Bước 5: Verify Secrets

```bash
supabase secrets list
```

Output:
```
NAME              VALUE
RESEND_API_KEY    re_***********MQMQB (hidden)
FROM_EMAIL        notifications@yourdomain.com
```

---

## 📧 BƯỚC 4: VERIFY DOMAIN (Optional - Recommended)

> **⚠️ Bắt buộc nếu muốn dùng custom email** (vd: `notifications@yourdomain.com`)

### 4.1. Vào Domains

```
https://resend.com/domains
```

### 4.2. Add Domain

1. Click **+ Add Domain**
2. Nhập domain: `yourdomain.com`
3. Click **Add**

### 4.3. Configure DNS Records

Resend sẽ cung cấp các DNS records cần thêm:

```
Type: TXT
Name: resend._domainkey
Value: [long string provided by Resend]
TTL: 3600

Type: MX
Name: @
Value: feedback-smtp.resend.com
Priority: 10
TTL: 3600
```

### 4.4. Add DNS Records

**Cloudflare:**
1. Vào Cloudflare Dashboard
2. Select domain
3. DNS → Add Record
4. Copy/paste từ Resend

**Other DNS providers:** Tương tự

### 4.5. Verify Domain

1. Quay lại Resend Dashboard
2. Click **Verify Domain**
3. Đợi 5-10 phút để DNS propagate

✅ Domain verified → Có thể dùng custom FROM_EMAIL

---

## 🧪 BƯỚC 5: TEST EMAIL NOTIFICATIONS

### 5.1. Mở App

```
http://localhost:5173
```

### 5.2. Vào Settings

1. Click tab **Settings** trong sidebar
2. Scroll xuống **Email Notifications**

### 5.3. Nhập Email

1. Nhập email của bạn vào field **Email nhận thông báo**
2. Click **Bật Email Notifications** (toggle ON)

### 5.4. Gửi Email Test

1. Click nút **Test** (bên cạnh email input)
2. Đợi vài giây
3. Kiểm tra inbox

**✅ Thành công:**
```
✅ Email test đã được gửi đến your-email@example.com
Vui lòng kiểm tra hộp thư!
```

**❌ Lỗi:**
```
❌ Không thể gửi email test
```
→ Xem phần [Troubleshooting](#-troubleshooting)

### 5.5. Kiểm tra Email

Check inbox (và spam folder):

**Subject:** `✅ 1Pixel - Email Test`

**Content:**
- 🎉 Heading: "Email đã được cấu hình thành công!"
- Gradient header (Teal → Blue)
- Thông tin về email notifications
- Footer với branding

---

## ⚙️ BƯỚC 6: CẤU HÌNH NOTIFICATIONS

### 6.1. Chọn Loại Nhắc Nhở

Trong **Email Notifications** settings:

**Hosting Reminders:**
- ☑️ 30 ngày trước hết hạn
- ☑️ 7 ngày trước hết hạn
- ☑️ 1 ngày trước & ngày hết hạn

**Project Reminders:**
- ☑️ Nhắc nhở Project Deadline

### 6.2. Lưu Cài Đặt

Click **Lưu Cài Đặt** ở cuối trang.

---

## 🔄 BƯỚC 7: DEPLOY EDGE FUNCTION (Nếu chưa có)

> **Lưu ý:** Edge Function đã được tạo sẵn trong code. Bạn chỉ cần deploy.

### 7.1. Deploy Function

```bash
# Deploy all functions
supabase functions deploy

# Hoặc deploy specific function
supabase functions deploy make-server-c138835e
```

### 7.2. Verify Deployment

```bash
supabase functions list
```

Output:
```
┌────────────────────────┬────────┬───────────────┐
│ NAME                   │ STATUS │ VERSION       │
├────────────────────────┼────────┼───────────────┤
│ make-server-c138835e   │ ACTIVE │ v1.0.0        │
└────────────────────────┴────────┴───────────────┘
```

---

## ⏰ BƯỚC 8: SETUP CRON JOB (Auto Email Daily)

### 8.1. Vào Supabase Dashboard

```
https://supabase.com/dashboard/project/YOUR_PROJECT_ID/database/cron-jobs
```

### 8.2. Create Cron Job

Click **+ Create Cron Job**

### 8.3. Configure Cron

```sql
-- Job Name: Daily Email Reminders
-- Schedule: 0 2 * * * (2:00 AM UTC = 9:00 AM Vietnam)
-- SQL Query:

SELECT
  net.http_post(
    url := 'https://YOUR_PROJECT_ID.supabase.co/functions/v1/make-server-c138835e/cron/send-reminders',
    headers := jsonb_build_object(
      'Content-Type', 'application/json',
      'Authorization', 'Bearer YOUR_ANON_KEY'
    ),
    body := '{}'::jsonb
  ) as request_id;
```

**Thay thế:**
- `YOUR_PROJECT_ID`: Project ID của bạn
- `YOUR_ANON_KEY`: Anon key từ Supabase Settings

### 8.4. Save Cron Job

Click **Save**.

### 8.5. Test Cron Manually

Trong cron job list, click **Run Now** để test ngay.

---

## 📊 BƯỚC 9: VERIFY EMAIL LOGS

### 9.1. Xem Resend Logs

```
https://resend.com/emails
```

Bạn sẽ thấy:
- Email đã gửi
- Delivery status
- Open/Click rates
- Bounce/Spam reports

### 9.2. Xem Supabase Logs

```
https://supabase.com/dashboard/project/YOUR_PROJECT_ID/logs/edge-functions
```

Filter function: `make-server-c138835e`

---

## ✅ CHECKLIST HOÀN CHỈNH

### Resend Setup:
- [ ] ✅ Đăng ký Resend account
- [ ] ✅ Tạo API Key
- [ ] ✅ Copy & save API key
- [ ] ⬜ (Optional) Verify domain

### Supabase Setup:
- [ ] ✅ Set `RESEND_API_KEY` secret
- [ ] ⬜ (Optional) Set `FROM_EMAIL` secret
- [ ] ✅ Deploy Edge Function
- [ ] ✅ Create Cron Job

### App Configuration:
- [ ] ✅ Nhập email trong Settings
- [ ] ✅ Bật Email Notifications
- [ ] ✅ Test email thành công
- [ ] ✅ Chọn loại nhắc nhở
- [ ] ✅ Lưu cài đặt

### Testing:
- [ ] ✅ Gửi test email thành công
- [ ] ✅ Nhận email trong inbox
- [ ] ✅ Email hiển thị đúng format
- [ ] ⬜ Test cron job manually

---

## 🐛 TROUBLESHOOTING

### ❌ Error: "RESEND_API_KEY is not set"

**Nguyên nhân:** Chưa set secret trong Supabase

**Giải pháp:**
```bash
supabase secrets set RESEND_API_KEY=re_your_key_here
```

Hoặc dùng Supabase Dashboard → Vault → New Secret

---

### ❌ Error: "Failed to send email"

**Nguyên nhân:** API key sai hoặc đã bị revoke

**Giải pháp:**
1. Kiểm tra API key trong Resend Dashboard
2. Tạo API key mới nếu cần
3. Update secret:
   ```bash
   supabase secrets set RESEND_API_KEY=re_new_key_here
   ```

---

### ❌ Error: "Domain not verified"

**Nguyên nhân:** Dùng custom FROM_EMAIL nhưng domain chưa verify

**Giải pháp:**

**Option 1:** Verify domain (xem Bước 4)

**Option 2:** Dùng default email
```bash
# Remove FROM_EMAIL secret
supabase secrets unset FROM_EMAIL
```

Email sẽ gửi từ: `onboarding@resend.dev`

---

### ❌ Email vào Spam

**Nguyên nhân:** Domain chưa verify hoặc SPF/DKIM chưa config

**Giải pháp:**
1. Verify domain trong Resend
2. Add DNS records (TXT, MX) đúng cách
3. Đợi 24-48h để email reputation tăng
4. Ask recipient whitelist email

---

### ❌ Không nhận email

**Kiểm tra:**

1. **Email đúng không?**
   - Kiểm tra typo trong email field
   - Try với email khác

2. **Spam folder?**
   - Check spam/junk folder
   - Mark as "Not Spam"

3. **Resend logs?**
   ```
   https://resend.com/emails
   ```
   - Xem email có được gửi không
   - Check delivery status

4. **Supabase logs?**
   ```
   Dashboard → Logs → Edge Functions
   ```
   - Xem có errors không

---

### ❌ Cron Job không chạy

**Kiểm tra:**

1. **Cron schedule đúng không?**
   ```
   0 2 * * *  (2:00 AM UTC)
   ```

2. **Function URL đúng không?**
   ```
   https://YOUR_PROJECT_ID.supabase.co/functions/v1/make-server-c138835e/cron/send-reminders
   ```

3. **Authorization header?**
   ```sql
   'Authorization', 'Bearer YOUR_ANON_KEY'
   ```

4. **Run manually để test:**
   - Dashboard → Cron Jobs → Click "Run Now"

---

## 📧 EMAIL TEMPLATES

### Test Email

**Subject:** `✅ 1Pixel - Email Test`

**Features:**
- Gradient header (Teal #4DBFAD → Blue #2563B4)
- Success icon 🎉
- Clear message
- Responsive design

---

### Hosting Expiration Email

**Subject:** `⏰ Hosting [Name] sắp hết hạn sau [X] ngày`

**Content:**
- 🔴/🟡/🔵 Urgency indicator
- Hosting details (name, domain, provider)
- Expiration date
- Price
- Action items checklist
- CTA button: "Truy cập Admin Panel"

**Color coding:**
- 🔴 Red: 0-1 ngày (Critical)
- 🟡 Orange: 2-7 ngày (Warning)
- 🔵 Blue: 8-30 ngày (Info)

---

### Project Deadline Email

**Subject:** `📁 Project [Name] cần hoàn thành sau [X] ngày`

**Content:**
- Project details
- Customer info
- Status
- Price
- Description
- CTA: "Xem Project"

---

## 💰 RESEND PRICING

### Free Tier:
```
✅ 3,000 emails/month
✅ 100 emails/day
✅ Email API
✅ Email logs (30 days)
✅ Domain verification
✅ Webhooks
```

### Pro Plan ($20/month):
```
✅ 50,000 emails/month
✅ Unlimited domains
✅ Priority support
✅ 90-day logs
✅ Analytics
```

**Recommendation:** Free tier đủ cho hầu hết use cases!

---

## 🔒 BẢO MẬT

### ✅ Best Practices:

1. **Never commit API key to Git**
   - Chỉ lưu trong Supabase Secrets
   - Không hardcode trong code

2. **Use environment variables**
   ```typescript
   const RESEND_API_KEY = Deno.env.get('RESEND_API_KEY');
   ```

3. **Rotate API keys định kỳ**
   - Mỗi 3-6 tháng
   - Hoặc khi có security incident

4. **Monitor email logs**
   - Check Resend Dashboard thường xuyên
   - Alert nếu có unusual activity

5. **Limit API permissions**
   - Chỉ "Send emails" permission
   - Không cần "Full Access" trừ khi cần thiết

---

## 📞 HỖ TRỢ

### Resend Support:
- **Docs:** https://resend.com/docs
- **Discord:** https://resend.com/discord
- **Email:** support@resend.com

### Supabase Support:
- **Docs:** https://supabase.com/docs
- **Discord:** https://discord.supabase.com
- **GitHub:** https://github.com/supabase/supabase

---

## 🎉 HOÀN THÀNH!

Chúc mừng! Bạn đã setup thành công Email Notifications!

**Từ giờ hệ thống sẽ:**
- ✅ Tự động gửi email nhắc nhở hosting hết hạn
- ✅ Cảnh báo project deadlines
- ✅ Chạy daily lúc 9:00 AM (Vietnam time)
- ✅ Beautiful HTML emails với branding

**Next steps:**
- Thêm hostings để test reminders
- Monitor Resend Dashboard
- Adjust notification settings theo nhu cầu

---

**Version:** 1.0.0  
**Last Updated:** January 21, 2026  
**Made with ❤️ by 1Pixel Team**
