import { useState } from 'react';
import { X, Plus, Pencil, Trash2, Tag, Palette } from 'lucide-react';
import { toast } from 'sonner@2.0.3';
import { ConfirmDialog } from './ConfirmDialog';

export interface Category {
  id: string;
  name: string;
  color: string;
}

interface CategoryManagerProps {
  categories: Category[];
  onAddCategory: (category: Omit<Category, 'id'>) => void;
  onUpdateCategory: (category: Category) => void;
  onDeleteCategory: (id: string) => void;
  onClose: () => void;
}

export function CategoryManager({ categories, onAddCategory, onUpdateCategory, onDeleteCategory, onClose }: CategoryManagerProps) {
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({ name: '', color: '#4DBFAD' });
  const [colorError, setColorError] = useState('');
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

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
      toast.error('Vui lòng nhập tên danh mục');
      return;
    }

    if (!validateHexColor(formData.color)) {
      toast.error('Vui lòng nhập mã màu hợp lệ');
      return;
    }

    if (editingId) {
      onUpdateCategory({
        id: editingId,
        name: formData.name.trim(),
        color: formData.color.toUpperCase()
      });
      toast.success('Đã cập nhật danh mục thành công');
      setEditingId(null);
    } else {
      onAddCategory({
        name: formData.name.trim(),
        color: formData.color.toUpperCase()
      });
      toast.success('Đã thêm danh mục mới thành công');
      setIsAdding(false);
    }
    
    setFormData({ name: '', color: '#4DBFAD' });
  };

  const handleEdit = (category: Category) => {
    setEditingId(category.id);
    setFormData({ name: category.name, color: category.color });
    setIsAdding(false);
  };

  const handleCancel = () => {
    setIsAdding(false);
    setEditingId(null);
    setFormData({ name: '', color: '#4DBFAD' });
  };

  const handleDelete = (id: string) => {
    setDeleteConfirm(id);
  };

  const getColorClass = (color: string) => {
    return `bg-${color.toLowerCase().replace('#', '')}-100 text-${color.toLowerCase().replace('#', '')}-700 border-${color.toLowerCase().replace('#', '')}-200`;
  };

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-black/60 via-[#4DBFAD]/20 to-[#2563B4]/20 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-4 sm:p-6 border-b border-gray-200 bg-gradient-to-r from-[#4DBFAD]/10 to-[#2563B4]/10 rounded-t-lg sticky top-0 z-10">
          <div className="flex items-center gap-2 sm:gap-3 min-w-0">
            <div className="bg-gradient-to-br from-[#4DBFAD] to-[#2563B4] p-2 rounded-lg flex-shrink-0">
              <Tag className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
            </div>
            <h2 className="text-lg sm:text-2xl font-bold text-gray-900 truncate">
              Quản Lý Danh Mục
            </h2>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors flex-shrink-0 ml-2"
          >
            <X className="w-5 h-5 sm:w-6 sm:h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="p-4 sm:p-6">
          {/* Add Button */}
          {!isAdding && !editingId && (
            <button
              onClick={() => setIsAdding(true)}
              className="w-full mb-4 flex items-center justify-center gap-2 px-4 py-3 border-2 border-dashed border-gray-300 rounded-lg text-gray-600 hover:border-[#4DBFAD] hover:text-[#4DBFAD] transition-colors text-sm sm:text-base"
            >
              <Plus className="w-4 h-4 sm:w-5 sm:h-5" />
              Thêm Danh Mục Mới
            </button>
          )}

          {/* Add/Edit Form */}
          {(isAdding || editingId) && (
            <form onSubmit={handleSubmit} className="mb-6 p-3 sm:p-4 bg-gradient-to-br from-[#4DBFAD]/5 to-[#2563B4]/5 rounded-lg border border-[#4DBFAD]/20">
              <h3 className="font-semibold text-gray-900 mb-3 sm:mb-4 text-sm sm:text-base">
                {editingId ? 'Chỉnh Sửa Danh Mục' : 'Thêm Danh Mục Mới'}
              </h3>
              
              <div className="space-y-3 sm:space-y-4">
                {/* Name */}
                <div>
                  <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-2">
                    Tên Danh Mục
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-3 sm:px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#4DBFAD] focus:border-transparent text-sm"
                    placeholder="VD: Email, Banking, Gaming..."
                    autoFocus
                  />
                </div>

                {/* Color */}
                <div>
                  <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-2">
                    Màu Sắc
                  </label>
                  
                  {/* Color Picker */}
                  <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4 mb-3">
                    <input
                      type="color"
                      value={formData.color}
                      onChange={(e) => handleColorChange(e.target.value)}
                      className="h-10 sm:h-12 w-16 sm:w-20 border-2 border-gray-300 rounded-lg cursor-pointer"
                    />
                    <div className="flex-1 w-full flex items-center gap-2">
                      <span 
                        className="inline-block w-8 h-8 sm:w-10 sm:h-10 rounded-lg border-2 border-gray-300 shadow-sm flex-shrink-0"
                        style={{ backgroundColor: formData.color }}
                      ></span>
                      <input
                        type="text"
                        value={formData.color}
                        onChange={(e) => handleColorChange(e.target.value)}
                        className="flex-1 px-3 sm:px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#4DBFAD] focus:border-transparent font-mono uppercase text-sm"
                        placeholder="#4DBFAD"
                      />
                    </div>
                  </div>
                  
                  {colorError && <p className="text-xs text-red-500 mb-2">{colorError}</p>}
                  
                  {/* Preset Colors */}
                  <div className="p-3 bg-white rounded-lg border border-gray-200">
                    <div className="flex items-center gap-2 mb-2">
                      <Palette className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-gray-600" />
                      <span className="text-xs font-medium text-gray-700">Bộ màu gợi ý:</span>
                    </div>
                    <div className="grid grid-cols-6 sm:grid-cols-8 gap-1.5 sm:gap-2">
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
                            <span className="absolute inset-0 flex items-center justify-center text-white text-xs font-bold drop-shadow">
                              ✓
                            </span>
                          )}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Preview */}
                <div>
                  <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-2">
                    Xem Trước
                  </label>
                  <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2">
                    <span 
                      className="inline-block text-xs sm:text-sm px-3 sm:px-4 py-2 rounded-lg font-medium border-2 shadow-sm"
                      style={{ 
                        backgroundColor: `${formData.color}15`,
                        borderColor: formData.color,
                        color: formData.color
                      }}
                    >
                      {formData.name || 'Tên danh mục'}
                    </span>
                    <span className="text-xs text-gray-500 font-mono">{formData.color}</span>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 justify-end pt-2">
                  <button
                    type="button"
                    onClick={handleCancel}
                    className="w-full sm:w-auto px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm"
                  >
                    Hủy
                  </button>
                  <button
                    type="submit"
                    className="w-full sm:w-auto px-4 py-2 bg-gradient-to-r from-[#4DBFAD] to-[#2563B4] text-white rounded-lg hover:opacity-90 transition-opacity text-sm font-medium"
                  >
                    {editingId ? 'Cập Nhật' : 'Thêm Mới'}
                  </button>
                </div>
              </div>
            </form>
          )}

          {/* Categories List */}
          <div className="space-y-2">
            <h3 className="font-semibold text-gray-900 mb-3 text-sm sm:text-base">
              Danh Sách Danh Mục ({categories.length})
            </h3>
            
            {categories.length === 0 ? (
              <div className="text-center py-8 text-gray-500 text-sm">
                Chưa có danh mục nào. Thêm danh mục đầu tiên!
              </div>
            ) : (
              categories.map((category) => (
                <div
                  key={category.id}
                  className="flex items-center justify-between p-3 sm:p-4 bg-white border border-gray-200 rounded-lg hover:shadow-sm transition-shadow"
                >
                  <div className="flex items-center gap-2 sm:gap-3 flex-1 min-w-0">
                    <div 
                      className="w-6 h-6 sm:w-8 sm:h-8 rounded-lg border-2 border-gray-300 shadow-sm flex-shrink-0"
                      style={{ backgroundColor: category.color }}
                    />
                    <span className="font-medium text-gray-900 text-sm sm:text-base truncate">{category.name}</span>
                    <span 
                      className="hidden sm:inline-flex text-xs px-2.5 sm:px-3 py-1 rounded-lg font-medium border-2 flex-shrink-0"
                      style={{
                        backgroundColor: `${category.color}15`,
                        borderColor: category.color,
                        color: category.color
                      }}
                    >
                      {category.color}
                    </span>
                  </div>
                  
                  <div className="flex gap-1 sm:gap-2 flex-shrink-0 ml-2">
                    <button
                      onClick={() => handleEdit(category)}
                      className="p-1.5 sm:p-2 text-gray-400 hover:text-[#4DBFAD] hover:bg-[#4DBFAD]/10 rounded-lg transition-colors"
                      title="Chỉnh sửa"
                    >
                      <Pencil className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(category.id)}
                      className="p-1.5 sm:p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                      title="Xóa"
                    >
                      <Trash2 className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 sm:p-6 border-t border-gray-200 bg-gray-50 rounded-b-lg sticky bottom-0">
          <button
            onClick={onClose}
            className="w-full px-4 py-2 bg-gradient-to-r from-[#4DBFAD] to-[#2563B4] text-white rounded-lg hover:opacity-90 transition-opacity text-sm font-medium"
          >
            Đóng
          </button>
        </div>
      </div>

      {/* Delete Confirmation Dialog */}
      {deleteConfirm && (
        <ConfirmDialog
          title="Xác Nhận Xóa"
          message={`Bạn có chắc chắn muốn xóa danh mục "${categories.find(cat => cat.id === deleteConfirm)?.name}"? Các mật khẩu thuộc danh mục này sẽ được chuyển sang "Khác".`}
          onConfirm={() => {
            onDeleteCategory(deleteConfirm);
            setDeleteConfirm(null);
          }}
          onCancel={() => setDeleteConfirm(null)}
        />
      )}
    </div>
  );
}