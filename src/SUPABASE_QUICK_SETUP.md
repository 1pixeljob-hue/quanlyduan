# ⚡ SUPABASE SETUP - QUICK REFERENCE

## 🎯 3 Bước Setup (< 2 phút)

### 1️⃣ Mở Supabase Dashboard
```
https://supabase.com/dashboard
→ Chọn project: dqylfuxfsbgvtenypolu
→ Click "SQL Editor"
```

### 2️⃣ Chạy SQL Script
```
→ Click "New Query"
→ Copy nội dung file: /supabase-setup.sql
→ Paste vào editor
→ Click "Run" (hoặc Ctrl+Enter)
```

### 3️⃣ Xác Nhận
```
→ Vào "Table Editor"
→ Kiểm tra bảng: kv_store_c138835e ✅
→ Vào app → Cài Đặt → Debug Panel
→ Click "Kiểm tra kết nối"
→ Thấy "Kết nối thành công!" ✅
```

---

## 🔍 Kiểm Tra Nhanh

### Trong App
```
1. Login: quydev / Spencil@123
2. Cài Đặt → Debug Panel → Hiện Debug Panel
3. Click "Kiểm tra kết nối"
4. Xem kết quả: 🟢 Xanh = OK | 🔴 Đỏ = Lỗi
```

### Trong Console (F12)
```javascript
// Test health endpoint
fetch('https://dqylfuxfsbgvtenypolu.supabase.co/functions/v1/make-server-c138835e/health')
  .then(r => r.json())
  .then(d => console.log('✅ OK:', d))
  .catch(e => console.error('❌ Error:', e));
```

---

## ⚠️ Lỗi Thường Gặp

| Lỗi | Nguyên Nhân | Giải Pháp |
|-----|-------------|-----------|
| `404 Not Found` | Edge Function chưa sẵn sàng | Đợi 30s, refresh, thử lại |
| `Không tải được dữ liệu` | Bảng chưa tạo | Chạy SQL script |
| `CORS error` | Browser block | Tắt AdBlock, thử trình duyệt khác |
| `0 records tất cả` | DB mới/rỗng | BÌNH THƯỜNG - Thử thêm data |

---

## 📦 Files Quan Trọng

```
/supabase-setup.sql          ← SQL script đầy đủ
/DATABASE_SETUP.md           ← Hướng dẫn chi tiết
/components/DebugPanel.tsx   ← Component debug
/utils/supabase/info.tsx     ← Credentials (auto-generated)
/supabase/functions/server/  ← Backend code
```

---

## 🎯 Checklist Success

- [ ] Bảng `kv_store_c138835e` tồn tại
- [ ] Debug Panel: "Kết nối thành công"
- [ ] Thêm được hosting/project mới
- [ ] Không có lỗi trong Console
- [ ] Loading duck hiện khi thực hiện tác vụ

**Nếu TẤT CẢ checked → Hoàn Hảo! 🎉**

---

## 🆘 Cần Trợ Giúp?

1. Đọc chi tiết: [DATABASE_SETUP.md](./DATABASE_SETUP.md)
2. Kiểm tra Console logs (F12)
3. Screenshot Debug Panel
4. Check Network tab (F12)

---

**Project ID**: `dqylfuxfsbgvtenypolu`  
**Backend**: Supabase Edge Functions  
**Storage**: KV Store (key-value)  
**Auth**: quydev / Spencil@123

---

Made with ❤️ by 1Pixel
