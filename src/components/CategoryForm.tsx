import { useState } from 'react';
import { X, Tag, Palette } from 'lucide-react';
import { Category } from './CategoryManager';

interface CategoryFormProps {
  onSubmit: (category: Omit<Category, 'id'>) => void;
  onClose: () => void;
}

export function CategoryForm({ onSubmit, onClose }: CategoryFormProps) {
  const [formData, setFormData] = useState({ name: '', color: '#4DBFAD' });
  const [colorError, setColorError] = useState('');

  // Bộ màu gợi ý phổ biến
  const presetColors = [
    { hex: '#4DBFAD', name: 'Teal (1Pixel)' },
    { hex: '#2563B4', name: 'Blue (1Pixel)' },
    { hex: '#EF4444', name: 'Đỏ' },
    { hex: '#F97316', name: 'Cam' },
    { hex: '#F59E0B', name: 'Vàng' },
    { hex: '#10B981', name: 'Xanh Lá' },
    { hex: '#06B6D4', name: 'Xanh Ngọc' },
    { hex: '#3B82F6', name: 'Xanh Dương' },
    { hex: '#6366F1', name: 'Indigo' },
    { hex: '#8B5CF6', name: 'Tím' },
    { hex: '#A855F7', name: 'Tím Hồng' },
    { hex: '#EC4899', name: 'Hồng' },
    { hex: '#F43F5E', name: 'Hồng Đào' },
    { hex: '#64748B', name: 'Xám' },
    { hex: '#0F172A', name: 'Đen Xanh' },
  ];

  const validateHexColor = (hex: string): boolean => {
    const hexPattern = /^#[0-9A-Fa-f]{6}$/;
    return hexPattern.test(hex);
  };

  const handleColorChange = (color: string) => {
    setFormData(prev => ({ ...prev, color: color.toUpperCase() }));
    if (validateHexColor(color)) {
      setColorError('');
    } else {
      setColorError('Mã màu không hợp lệ (VD: #4DBFAD)');
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name.trim()) {
      alert('Vui lòng nhập tên danh mục');
      return;
    }

    if (!validateHexColor(formData.color)) {
      setColorError('Vui lòng nhập mã màu hợp lệ');
      return;
    }

    onSubmit({
      name: formData.name.trim(),
      color: formData.color.toUpperCase()
    });
  };

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 z-[60]">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-gradient-to-r from-[#4DBFAD]/10 to-[#2563B4]/10">
          <div className="flex items-center gap-3">
            <div className="bg-gradient-to-br from-[#4DBFAD] to-[#2563B4] p-2 rounded-lg">
              <Tag className="w-5 h-5 text-white" />
            </div>
            <h2 className="text-xl font-bold text-gray-900">Tạo Danh Mục Mới</h2>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Tên Danh Mục <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#4DBFAD] focus:border-transparent"
              placeholder="VD: Công Việc, Cá Nhân, ..."
              autoFocus
            />
          </div>

          {/* Color */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Màu Sắc
            </label>
            <div className="flex items-center gap-4">
              <input
                type="color"
                value={formData.color}
                onChange={(e) => handleColorChange(e.target.value)}
                className="h-12 w-20 border-2 border-gray-300 rounded-lg cursor-pointer"
              />
              <div className="flex-1 flex items-center gap-2">
                <span 
                  className="inline-block w-10 h-10 rounded-lg border-2 border-gray-300"
                  style={{ backgroundColor: formData.color }}
                ></span>
                <input
                  type="text"
                  value={formData.color}
                  onChange={(e) => handleColorChange(e.target.value)}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#4DBFAD] focus:border-transparent font-mono uppercase"
                  placeholder="#4DBFAD"
                  pattern="^#[0-9A-Fa-f]{6}$"
                />
              </div>
            </div>
            <p className="text-xs text-gray-500 mt-2">Chọn màu hoặc nhập mã màu (VD: #4DBFAD, #2563B4)</p>
            {colorError && <p className="text-xs text-red-500 mt-1">{colorError}</p>}
            
            {/* Preset Colors */}
            <div className="mt-4 p-3 bg-gray-50 rounded-lg border border-gray-200">
              <div className="flex items-center gap-2 mb-2">
                <Palette className="w-4 h-4 text-gray-600" />
                <span className="text-sm font-medium text-gray-700">Bộ màu gợi ý:</span>
              </div>
              <div className="grid grid-cols-8 gap-2">
                {presetColors.map((color) => (
                  <button
                    key={color.hex}
                    type="button"
                    onClick={() => handleColorChange(color.hex)}
                    className={`group relative w-full aspect-square rounded-lg border-2 transition-all hover:scale-110 ${
                      formData.color.toUpperCase() === color.hex
                        ? 'border-gray-900 ring-2 ring-[#4DBFAD] scale-110'
                        : 'border-gray-300 hover:border-gray-400'
                    }`}
                    style={{ backgroundColor: color.hex }}
                    title={`${color.name} - ${color.hex}`}
                  >
                    {formData.color.toUpperCase() === color.hex && (
                      <span className="absolute inset-0 flex items-center justify-center text-white text-xs font-bold">
                        ✓
                      </span>
                    )}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3 justify-end pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Hủy
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-gradient-to-r from-[#4DBFAD] to-[#2563B4] text-white rounded-lg hover:opacity-90 transition-opacity"
            >
              Tạo Danh Mục
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}