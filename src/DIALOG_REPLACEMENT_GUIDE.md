# 🎯 Dialog & Toast Replacement Guide

Hướng dẫn thay thế tất cả `alert()` và `confirm()` cũ bằng Dialog/Toast mới.

## 📋 Danh sách cần thay thế trong App.tsx:

### ✅ Đã thay thế:
1. ✓ Line 137: Load data error → `showError()`
2. ✓ Line 178-186: Logout confirm → `showConfirm()`
3. ✓ Line 229-234: Calendar download confirm + success toast
4. ✓ Line 236: Save error → `toastError()`

### ⚠️ Cần thay thế:

#### Update Hosting (Line 268):
```typescript
// CŨ:
alert('Không thể cập nhật dữ liệu lên Supabase. Vui lòng kiểm tra kết nối.');

// MỚI:
toastError('Không thể cập nhật dữ liệu lên Supabase. Vui lòng kiểm tra kết nối.');
```

#### Delete Hosting (Line 273-292):
```typescript
// CŨ:
if (confirm('Bạn có chắc chắn muốn xóa hosting này?')) {
  try {
    // Delete logic
  } catch (error) {
    alert('Không thể xóa dữ liệu từ Supabase. Vui lòng kiểm tra kết nối.');
  }
}

// MỚI:
showConfirm(
  'Bạn có chắc chắn muốn xóa hosting này?',
  async () => {
    try {
      await api.hostingApi.delete(id);
      setHostings(hostings.filter(h => h.id !== id));
      toastSuccess('Đã xóa hosting thành công!');
      
      if (googleCalendar.isAuthorized()) {
        try {
          await googleCalendar.deleteHostingEvent(id);
        } catch (err) {
          console.error('Failed to delete from Google Calendar:', err);
        }
      }
    } catch (error) {
      console.error('Error deleting hosting from Supabase:', error);
      toastError('Không thể xóa dữ liệu từ Supabase. Vui lòng kiểm tra kết nối.');
    }
  }
);
```

#### Save/Update/Delete Project (Lines 324, 341, 346-355):
- `alert()` → `toastError()`
- `confirm()` → `showConfirm()` + `toastSuccess()`

#### Save/Update/Delete Password (Lines 395, 412, 417-426):
- `alert()` → `toastError()`
- `confirm()` → `showConfirm()` + `toastSuccess()`

#### Delete Category (Lines 478-487):
```typescript
showConfirm(
  'Bạn có chắc chắn muốn xóa loại này?',
  async () => {
    try {
      await api.categoryApi.delete(id);
      setCategories(categories.filter(c => c.id !== id));
      toastSuccess('Đã xóa danh mục thành công!');
    } catch (error) {
      console.error('Error deleting category:', error);
      toastError('Có lỗi khi xóa danh mục.');
    }
  }
);
```

#### Delete Code (Lines 539-548):
```typescript
showConfirm(
  'Bạn có chắc chắn muốn xóa đoạn mã này?',
  async () => {
    try {
      await api.codexApi.delete(id);
      setCodes(codes.filter(c => c.id !== id));
      toastSuccess('Đã xóa snippet thành công!');
    } catch (error) {
      console.error('Error deleting code:', error);
      toastError('Có lỗi khi xóa đoạn mã.');
    }
  }
);
```

#### Import Data (Lines 584-587):
```typescript
// CŨ:
alert(`Đã nhập thành công ${data.length} hosting vào Supabase!`);

// MỚI:
toastSuccess(`Đã nhập thành công ${data.length} hosting vào Supabase!`);

// Error:
toastError('Có lỗi khi nhập dữ liệu lên Supabase. Vui lòng thử lại.');
```

#### Clear Data (Lines 592-604):
```typescript
showConfirm(
  'Bạn có chắc chắn muốn xóa tất cả dữ liệu từ Supabase? Hành động này không thể hoàn tác.',
  async () => {
    try {
      for (const hosting of hostings) {
        await api.hostingApi.delete(hosting.id);
      }
      setHostings([]);
      toastSuccess('Đã xóa tất cả dữ liệu từ Supabase!');
    } catch (error) {
      console.error('Error clearing data from Supabase:', error);
      toastError('Có lỗi khi xóa dữ liệu từ Supabase. Vui lòng thử lại.');
    }
  },
  { confirmText: 'Xóa tất cả', cancelText: 'Hủy bỏ' }
);
```

#### Export Calendar (Line 678):
```typescript
// CŨ:
if (expiringHostings.length === 0) {
  alert('Không có hosting nào sắp hết hạn!');
  return;
}

// MỚI:
if (expiringHostings.length === 0) {
  toastInfo('Không có hosting nào sắp hết hạn!');
  return;
}
downloadMultipleICS(expiringHostings);
toastSuccess('Đã tải file lịch nhắc nhở!');
```

---

## 📝 Các files khác cần thay thế:

### CategoryManager.tsx (Line 40, 75):
```typescript
// Import hooks
import { useDialog } from '../hooks/useDialog';
import { useToast } from '../hooks/useToast';

// In component:
const { showConfirm } = useDialog();
const { toastError, toastSuccess } = useToast();

// Line 40:
if (!formData.name.trim()) {
  toastError('Vui lòng nhập tên danh mục');
  return;
}

// Line 75:
showConfirm(
  'Bạn có chắc chắn muốn xóa danh mục này? Các mật khẩu thuộc danh mục này sẽ được chuyển sang "Khác".',
  () => onDeleteCategory(id)
);
```

### CodeX.tsx (Line 112):
```typescript
const { showConfirm } = useDialog();
const { toastSuccess } = useToast();

// Line 112:
showConfirm(
  'Bạn có chắc chắn muốn xóa snippet này?',
  () => {
    onDelete(id);
    if (selectedSnippet?.id === id) {
      setSelectedSnippet(null);
    }
    toastSuccess('Đã xóa snippet thành công!');
  }
);
```

### ProjectView.tsx (Lines 136, 161):
```typescript
const { toastSuccess } = useToast();

// Line 136:
onClick={() => {
  navigator.clipboard.writeText(project.adminUsername);
  toastSuccess('Đã sao chép tài khoản!');
}}

// Line 161:
onClick={() => {
  navigator.clipboard.writeText(project.adminPassword);
  toastSuccess('Đã sao chép mật khẩu!');
}}
```

### Settings.tsx (Lines 25, 27):
```typescript
const { toastSuccess, toastError } = useToast();

// Line 25:
onImportData(data);
toastSuccess('Nhập dữ liệu thành công!');

// Line 27:
toastError('Lỗi khi nhập dữ liệu. Vui lòng kiểm tra file JSON.');
```

---

## 🎨 Quy tắc sử dụng:

| Tình huống | Sử dụng | Ví dụ |
|------------|---------|-------|
| Xác nhận xóa/thay đổi quan trọng | `showConfirm()` | Dialog với OK/Cancel |
| Thông báo lỗi quan trọng | `showError()` | Dialog lỗi với icon đỏ |
| Thông báo thành công nhanh | `toastSuccess()` | Toast xanh, tự tắt 3s |
| Thông báo lỗi nhanh | `toastError()` | Toast đỏ, tự tắt 3s |
| Thông tin đơn giản | `toastInfo()` | Toast xanh dương, tự tắt 3s |
| Copy clipboard | `toastSuccess()` | "Đã sao chép!" |
| Import/Export | `toastSuccess()` | "Đã xuất/nhập thành công!" |

---

## ✨ Lợi ích:
- ✅ UI đẹp, chuyên nghiệp hơn
- ✅ Brand colors (Teal + Blue)
- ✅ Animation mượt mà
- ✅ Progress bar cho toast
- ✅ Icons trực quan
- ✅ Không chặn UI (toast)
- ✅ Responsive tốt
