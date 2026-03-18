# Hướng dẫn Deploy Module Log - Supabase Edge Function

## ⚠️ Quan trọng
Figma Make không thể tự động deploy edge function do hạn chế quyền. Bạn cần deploy **thủ công** qua Supabase Dashboard.

---

## 📋 Các bước Deploy

### Bước 1: Truy cập Supabase Dashboard

1. Mở trình duyệt và truy cập: https://supabase.com/dashboard
2. Đăng nhập vào tài khoản Supabase của bạn
3. Chọn project đang sử dụng

### Bước 2: Mở Edge Functions Editor

1. Trong menu bên trái, click vào **"Edge Functions"**
2. Tìm function tên **"server"** (hoặc "make-server-c138835e")
3. Click vào function đó để mở editor

### Bước 3: Cập nhật Code

1. Trong editor, tìm đến section **LOG ROUTES** (sau CODEX ROUTES)
2. Thêm đoạn code sau **TRƯỚC** section `// ==================== MIGRATION ROUTE ====================`:

```typescript
// ==================== LOG ROUTES ====================

// Get all logs
app.get("/make-server-c138835e/logs", async (c) => {
  try {
    const logs = await kv.getByPrefix("log:");
    return c.json({ success: true, data: logs });
  } catch (error) {
    console.error("Error fetching logs:", error);
    return c.json({ success: false, error: String(error) }, 500);
  }
});

// Create log
app.post("/make-server-c138835e/logs", async (c) => {
  try {
    const log = await c.req.json();
    const key = `log:${log.id}`;
    await kv.set(key, log);
    return c.json({ success: true, data: log });
  } catch (error) {
    console.error("Error creating log:", error);
    return c.json({ success: false, error: String(error) }, 500);
  }
});

// Delete log
app.delete("/make-server-c138835e/logs/:id", async (c) => {
  try {
    const id = c.req.param("id");
    const key = `log:${id}`;
    await kv.del(key);
    return c.json({ success: true });
  } catch (error) {
    console.error("Error deleting log:", error);
    return c.json({ success: false, error: String(error) }, 500);
  }
});

// Bulk delete logs
app.post("/make-server-c138835e/logs/bulk-delete", async (c) => {
  try {
    const { ids } = await c.req.json();
    if (!Array.isArray(ids)) {
      return c.json({ success: false, error: "ids must be an array" }, 400);
    }
    
    for (const id of ids) {
      const key = `log:${id}`;
      await kv.del(key);
    }
    
    return c.json({ success: true, message: `Deleted ${ids.length} logs` });
  } catch (error) {
    console.error("Error bulk deleting logs:", error);
    return c.json({ success: false, error: String(error) }, 500);
  }
});
```

### Bước 4: Deploy Function

1. Sau khi thêm code, click nút **"Deploy"** hoặc **"Save & Deploy"**
2. Đợi vài giây để Supabase deploy function
3. Kiểm tra status - phải hiển thị **"Deployed"** với màu xanh

### Bước 5: Kiểm tra Function hoạt động

1. Quay lại ứng dụng Figma Make
2. Reload trang
3. Click vào tab **"Log"** trong sidebar
4. Nếu không còn lỗi 404 → Deploy thành công! ✅

---

## 🔧 Deploy qua Supabase CLI (Nâng cao)

Nếu bạn đã cài Supabase CLI:

```bash
# 1. Login vào Supabase
supabase login

# 2. Link project
supabase link --project-ref YOUR_PROJECT_ID

# 3. Deploy edge function
supabase functions deploy server
```

---

## ✅ Xác nhận Deploy thành công

Sau khi deploy, bạn có thể test bằng cách:

1. **Xóa một hosting hoặc project** → Log sẽ được tạo tự động
2. **Vào tab Log** → Xem danh sách logs
3. **Test restore** → Click icon Restore trên log đã xóa
4. **Test bulk delete** → Chọn nhiều logs và xóa cùng lúc

---

## 🆘 Troubleshooting

### Lỗi: Function not found
- Kiểm tra lại tên function phải là **"server"**
- Đảm bảo đã deploy trong đúng project

### Lỗi: Still showing 404
- Clear cache trình duyệt (Ctrl + Shift + R)
- Đợi 30s-1 phút sau khi deploy
- Kiểm tra Edge Function logs trong Supabase Dashboard

### Lỗi: Syntax error khi deploy
- Kiểm tra lại code đã copy đúng chưa
- Đảm bảo không thiếu dấu ngoặc `{` hoặc `}`
- Kiểm tra vị trí thêm code (phải ở sau CODEX ROUTES)

---

## 📚 Tài liệu tham khảo

- Supabase Edge Functions: https://supabase.com/docs/guides/functions
- Supabase CLI: https://supabase.com/docs/guides/cli

---

## 💡 Lưu ý

- Edge function code trong file `/supabase/functions/server/index.tsx` đã được cập nhật đầy đủ
- Bạn chỉ cần **copy code LOG ROUTES từ file đó** và paste vào Supabase Dashboard
- Sau khi deploy thành công, module Log sẽ hoạt động hoàn chỉnh mà không cần thao tác gì thêm

---

✨ **Chúc bạn deploy thành công!** ✨
