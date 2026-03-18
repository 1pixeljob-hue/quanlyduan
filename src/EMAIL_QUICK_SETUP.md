# 📧 Email Notifications - Quick Setup (2 phút)

## ⚡ SETUP NHANH

### Bước 1: Tạo Secret (1 phút)

1. **Mở Supabase Dashboard:**
   ```
   https://supabase.com/dashboard
   ```

2. **Navigate:**
   ```
   Your Project → Settings (⚙️) → Vault
   ```

3. **Click:** `New Secret`

4. **Nhập:**
   ```
   Name: RESEND_API_KEY
   Value: re_MPAeaRd7_Nkfnhqz31LN8cYR44RqDXMQB
   ```

5. **Click:** `Save`

---

### Bước 2: Đợi (2-5 phút)

⏱️ **QUAN TRỌNG: ĐỢI 2-5 PHÚT!**

Supabase cần thời gian để propagate secret đến Edge Functions.

```
☕ Nghỉ ngơi 5 phút...
```

**Tại sao?**
- Edge Functions cache environment variables
- Secrets cần sync across infrastructure
- Không cần restart trong Figma Make

---

### Bước 3: Test Email

#### Option A: Test trong App (Đơn giản)

1. Mở app: `http://localhost:5173`
2. Settings → Email Notifications
3. Nhập email
4. Click **Test**
5. Check inbox!

#### Option B: Test bằng Tool (Nâng cao)

1. Mở file: `/test-email.html` trong browser
2. Nhập email
3. Click **Gửi Test Email**
4. Xem response chi tiết

---

## ✅ CHECKLIST

```
□ Tạo secret RESEND_API_KEY trong Vault
□ Value: re_MPAeaRd7_Nkfnhqz31LN8cYR44RqDXMQB
□ Click Save
□ ĐỢI 5 PHÚT ⏱️
□ Test email
□ Check inbox (và spam folder)
```

---

## ❌ NẾU LỖI

### Error: "RESEND_API_KEY is not set"

**Nguyên nhân:** Secret chưa sync

**Giải pháp:**
1. Verify secret trong Dashboard → Vault
2. **Đợi thêm 5 phút**
3. Try again

---

### Email không đến inbox

**Kiểm tra:**
- Spam/Junk folder
- Promotions tab (Gmail)
- Email chính xác không?

---

## 🔍 DEBUG

### Check Supabase Logs

```
Dashboard → Edge Functions → make-server-c138835e → Logs
```

**Tìm:**
- `RESEND_API_KEY is not set` → Đợi thêm
- `Email sent successfully` → Success!
- `Failed to send email` → API key issue

---

### Check Resend Logs

```
https://resend.com/emails
```

Xem email có được gửi không.

---

## 📚 TÀI LIỆU CHI TIẾT

- **Full Setup:** `/EMAIL_NOTIFICATIONS_SETUP.md` (400+ dòng)
- **Troubleshooting:** `/EMAIL_TROUBLESHOOTING.md` (300+ dòng)
- **Test Tool:** `/test-email.html` (Visual tester)

---

## ⏰ TIMELINE

```
00:00 - Tạo secret trong Vault ✅
00:30 - Click Save ✅
05:00 - Đợi 5 phút ⏱️
05:30 - Test email ✅
05:31 - Check inbox ✅
```

**Total: ~6 phút** (bao gồm 5 phút đợi)

---

## 💡 TIPS

1. **Luôn đợi 5 phút** sau khi tạo secret
2. **Không cần restart** Edge Function trong Figma Make
3. **Check spam folder** nếu không thấy email
4. **Dùng `/test-email.html`** để debug chi tiết
5. **Xem logs** nếu có lỗi

---

## 🎯 KẾT QUẢ MONG ĐỢI

**Test Email Success:**
```
Subject: ✅ Test Email - 1Pixel Email Notifications
From: onboarding@resend.dev

🎉
Email đã được cấu hình thành công!

Hệ thống email notifications đang hoạt động bình thường.
```

---

**That's it! Chỉ 2 bước + đợi 5 phút! 🚀**

---

**Last Updated:** January 21, 2026
