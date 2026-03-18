import { useState, useEffect } from 'react';
import { Password } from './PasswordList';
import { Category } from './CategoryManager';
import { X, Eye, EyeOff, Key, User, Lock, Globe, FileText } from 'lucide-react';
import { CustomSelect } from './CustomSelect';

interface PasswordFormProps {
  password?: Password | null;
  categories: Category[];
  onSubmit: (password: any) => void;
  onClose: () => void;
}

export function PasswordForm({ password, categories, onSubmit, onClose }: PasswordFormProps) {
  const [formData, setFormData] = useState({
    title: '',
    username: '',
    password: '',
    website: '',
    notes: '',
    category: categories.length > 0 ? categories[0].id : ''
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    if (password) {
      setFormData({
        title: password.title || '',
        username: password.username || '',
        password: password.password || '',
        website: password.website || '',
        notes: password.notes || '',
        category: password.category || (categories.length > 0 ? categories[0].id : '')
      });
    } else {
      // For new passwords, find "Chưa Phân Loại" or use first category
      const uncategorized = categories.find(cat => cat.id === 'uncategorized');
      setFormData({
        title: '',
        username: '',
        password: '',
        website: '',
        notes: '',
        category: uncategorized ? uncategorized.id : (categories.length > 0 ? categories[0].id : '')
      });
    }
  }, [password, categories]);

  const validate = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.title.trim()) {
      newErrors.title = 'Tiêu đề là bắt buộc';
    }
    if (!formData.username.trim()) {
      newErrors.username = 'Tài khoản là bắt buộc';
    }
    if (!formData.password.trim()) {
      newErrors.password = 'Mật khẩu là bắt buộc';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validate()) {
      return;
    }

    const submitData = {
      ...(password && { id: password.id, createdAt: password.createdAt }),
      title: formData.title.trim(),
      username: formData.username.trim(),
      password: formData.password.trim(),
      website: formData.website.trim(),
      notes: formData.notes.trim(),
      category: formData.category
    };

    onSubmit(submitData);
  };

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const generatePassword = () => {
    const length = 16;
    const charset = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+-=[]{}|;:,.<>?';
    let newPassword = '';
    for (let i = 0; i < length; i++) {
      newPassword += charset.charAt(Math.floor(Math.random() * charset.length));
    }
    handleChange('password', newPassword);
    setShowPassword(true);
  };

  // Convert categories to CustomSelect options
  const categoryOptions = categories.map(cat => ({
    value: cat.id,
    label: cat.name,
    hexColor: cat.color
  }));

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-black/60 via-[#4DBFAD]/20 to-[#2563B4]/20 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-3xl w-full max-h-[90vh] flex flex-col">
        {/* Header - Fixed */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-gradient-to-r from-[#4DBFAD]/10 to-[#2563B4]/10 flex-shrink-0">
          <div className="flex items-center gap-3">
            <div className="bg-gradient-to-br from-[#4DBFAD] to-[#2563B4] p-2 rounded-lg">
              <Key className="w-5 h-5 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900">
              {password ? 'Chỉnh Sửa Mật Khẩu' : 'Thêm Mật Khẩu Mới'}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Form - Scrollable */}
        <form onSubmit={handleSubmit} className="flex flex-col flex-1 min-h-0">
          <div className="overflow-y-auto project-modal-scroll p-6 space-y-6 flex-1">
            {/* Title */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <div className="flex items-center gap-2">
                  <FileText className="w-4 h-4 text-gray-500" />
                  <span>Tiêu Đề <span className="text-red-500">*</span></span>
                </div>
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => handleChange('title', e.target.value)}
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#4DBFAD] focus:border-transparent ${
                  errors.title ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="VD: Gmail - Công Ty"
              />
              {errors.title && (
                <p className="mt-1 text-sm text-red-500">{errors.title}</p>
              )}
            </div>

            {/* Website */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <div className="flex items-center gap-2">
                  <Globe className="w-4 h-4 text-gray-500" />
                  <span>Website</span>
                </div>
              </label>
              <input
                type="text"
                value={formData.website}
                onChange={(e) => handleChange('website', e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#4DBFAD] focus:border-transparent"
                placeholder="VD: https://gmail.com hoặc gmail.com"
              />
            </div>

            {/* Category */}
            <div>
              <CustomSelect
                value={formData.category}
                onChange={(value) => handleChange('category', value)}
                options={categoryOptions}
                label="Danh Mục"
                required
              />
            </div>

            {/* Username */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <div className="flex items-center gap-2">
                  <User className="w-4 h-4 text-gray-500" />
                  <span>Tài Khoản <span className="text-red-500">*</span></span>
                </div>
              </label>
              <input
                type="text"
                value={formData.username}
                onChange={(e) => handleChange('username', e.target.value)}
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#4DBFAD] focus:border-transparent ${
                  errors.username ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="VD: user@example.com"
                autoComplete="off"
              />
              {errors.username && (
                <p className="mt-1 text-sm text-red-500">{errors.username}</p>
              )}
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Lock className="w-4 h-4 text-gray-500" />
                    <span>Mật Khẩu <span className="text-red-500">*</span></span>
                  </div>
                  <button
                    type="button"
                    onClick={generatePassword}
                    className="text-xs text-[#2563B4] hover:underline"
                  >
                    Tạo mật khẩu mạnh
                  </button>
                </div>
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={formData.password}
                  onChange={(e) => handleChange('password', e.target.value)}
                  className={`w-full px-4 py-2 pr-10 border rounded-lg focus:ring-2 focus:ring-[#4DBFAD] focus:border-transparent ${
                    errors.password ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="••••••••"
                  autoComplete="new-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
              {errors.password && (
                <p className="mt-1 text-sm text-red-500">{errors.password}</p>
              )}
            </div>

            {/* Notes */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <div className="flex items-center gap-2">
                  <FileText className="w-4 h-4 text-gray-500" />
                  <span>Ghi Chú</span>
                </div>
              </label>
              <textarea
                value={formData.notes}
                onChange={(e) => handleChange('notes', e.target.value)}
                rows={3}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#4DBFAD] focus:border-transparent resize-none"
                placeholder="Ghi chú bổ sung (tùy chọn)..."
              />
            </div>
          </div>

          {/* Actions - Fixed */}
          <div className="flex gap-3 justify-end p-6 pt-4 border-t border-gray-200 flex-shrink-0 bg-white">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Hủy
            </button>
            <button
              type="submit"
              className="px-6 py-2 bg-gradient-to-r from-[#4DBFAD] to-[#2563B4] text-white rounded-lg hover:opacity-90 transition-opacity"
            >
              {password ? 'Cập Nhật' : 'Thêm Mới'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}