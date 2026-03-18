import { useState, useEffect } from 'react';
import { Project } from './ProjectList';
import { X, Eye, EyeOff, Banknote, Calendar } from 'lucide-react';
import { DateInput } from './DateInput';
import { LoadingDuckInline } from './LoadingDuck';
import { CustomSelect } from './CustomSelect';
import { NumberInput } from './NumberInput';

interface ProjectFormProps {
  project?: Project | null;
  onSubmit: (project: any) => void;
  onClose: () => void;
}

export function ProjectForm({ project, onSubmit, onClose }: ProjectFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    customer: '',
    customerPhone: '',
    adminUrl: '',
    adminUsername: '',
    adminPassword: '',
    status: 'planning' as Project['status'],
    description: '',
    price: 0,
    createdAt: ''
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [showPassword, setShowPassword] = useState(false);

  // Status options with colors
  const statusOptions = [
    { value: 'planning', label: 'Lên Kế Hoạch', bgColor: 'bg-blue-100', color: 'text-blue-800' },
    { value: 'in-progress', label: 'Đang Thực Hiện', bgColor: 'bg-orange-100', color: 'text-orange-800' },
    { value: 'pending-acceptance', label: 'Chờ Nghiệm Thu', bgColor: 'bg-purple-100', color: 'text-purple-800' },
    { value: 'completed', label: 'Hoàn Thành', bgColor: 'bg-green-100', color: 'text-green-800' },
    { value: 'on-hold', label: 'Tạm Dừng', bgColor: 'bg-gray-100', color: 'text-gray-800' }
  ];

  useEffect(() => {
    if (project) {
      setFormData({
        name: project.name || '',
        customer: project.customer || '',
        customerPhone: project.customerPhone || '',
        adminUrl: project.adminUrl || '',
        adminUsername: project.adminUsername || '',
        adminPassword: project.adminPassword || '',
        status: project.status,
        description: project.description || '',
        price: project.price || 0,
        createdAt: project.createdAt || ''
      });
    } else {
      // Reset to empty values when no project
      setFormData({
        name: '',
        customer: '',
        customerPhone: '',
        adminUrl: '',
        adminUsername: '',
        adminPassword: '',
        status: 'planning',
        description: '',
        price: 0,
        createdAt: ''
      });
    }
  }, [project]);

  const validate = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Tên project là bắt buộc';
    }
    if (!formData.customer.trim()) {
      newErrors.customer = 'Tên khách hàng là bắt buộc';
    }
    // Validate phone only if provided
    if (formData.customerPhone.trim() && !/^[0-9]{10,11}$/.test(formData.customerPhone.trim())) {
      newErrors.customerPhone = 'Số điện thoại không hợp lệ (10-11 số)';
    }
    if (!formData.createdAt) {
      newErrors.createdAt = 'Ngày tạo là bắt buộc';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validate()) {
      return;
    }

    setIsSubmitting(true);
    const submitData = {
      ...(project && { id: project.id }),
      name: formData.name.trim(),
      customer: formData.customer.trim(),
      customerPhone: formData.customerPhone.trim(),
      adminUrl: formData.adminUrl.trim(),
      adminUsername: formData.adminUsername.trim(),
      adminPassword: formData.adminPassword.trim(),
      status: formData.status,
      description: formData.description.trim(),
      price: formData.price,
      createdAt: formData.createdAt // Already in ISO format from DateInput
    };

    onSubmit(submitData);
  };

  const handleChange = (field: string, value: string) => {
    const finalValue = field === 'price' ? Number(value) : value;
    setFormData(prev => ({ ...prev, [field]: finalValue }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const normalizeUrl = (url: string): string => {
    if (!url || !url.trim()) return '';
    
    const trimmed = url.trim();
    
    // Check if URL already has a protocol
    if (/^https?:\/\//i.test(trimmed)) {
      return trimmed;
    }
    
    // Add https:// prefix
    return `https://${trimmed}`;
  };

  const handleUrlBlur = (field: string) => {
    const currentValue = formData[field as keyof typeof formData] as string;
    if (currentValue && currentValue.trim()) {
      const normalized = normalizeUrl(currentValue);
      setFormData(prev => ({ ...prev, [field]: normalized }));
    }
  };

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-black/60 via-[#4DBFAD]/20 to-[#2563B4]/20 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-3xl w-full max-h-[90vh] flex flex-col">
        {/* Header - Fixed */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-gradient-to-r from-[#4DBFAD]/10 to-[#2563B4]/10 flex-shrink-0">
          <h2 className="text-2xl font-bold text-gray-900">
            {project ? 'Chỉnh Sửa Project' : 'Thêm Project Mới'}
          </h2>
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
            {/* Project Information Section */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4 pb-2 border-b border-gray-200">
                Thông Tin Project
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Name */}
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Tên Project <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => handleChange('name', e.target.value)}
                    className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#4DBFAD] focus:border-transparent ${
                      errors.name ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="VD: Website Thương Mại Điện Tử"
                  />
                  {errors.name && (
                    <p className="mt-1 text-sm text-red-500">{errors.name}</p>
                  )}
                </div>

                {/* Status */}
                <div className="md:col-span-2">
                  <CustomSelect
                    value={formData.status}
                    onChange={(value) => handleChange('status', value)}
                    options={statusOptions}
                    label="Trạng Thái"
                    required
                  />
                </div>

                {/* Description */}
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Mô Tả
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => handleChange('description', e.target.value)}
                    rows={4}
                    className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#4DBFAD] focus:border-transparent resize-none ${
                      errors.description ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="Mô tả chi tiết về project..."
                  />
                  {errors.description && (
                    <p className="mt-1 text-sm text-red-500">{errors.description}</p>
                  )}
                </div>

                {/* Created Date */}
                <div className="md:col-span-2">
                  <DateInput
                    value={formData.createdAt}
                    onChange={(value) => handleChange('createdAt', value)}
                    label="Ngày Tạo"
                    required
                  />
                  <p className="mt-1 text-sm text-gray-500">
                    Ngày bắt đầu thực hiện dự án
                  </p>
                  {errors.createdAt && (
                    <p className="mt-1 text-sm text-red-500">{errors.createdAt}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Customer Information Section */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4 pb-2 border-b border-gray-200">
                Thông Tin Khách Hàng
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Customer Name */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Tên Khách Hàng <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.customer}
                    onChange={(e) => handleChange('customer', e.target.value)}
                    className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#4DBFAD] focus:border-transparent ${
                      errors.customer ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="VD: Nguyễn Văn A"
                  />
                  {errors.customer && (
                    <p className="mt-1 text-sm text-red-500">{errors.customer}</p>
                  )}
                </div>

                {/* Customer Phone */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Số Điện Thoại
                  </label>
                  <input
                    type="tel"
                    value={formData.customerPhone}
                    onChange={(e) => handleChange('customerPhone', e.target.value)}
                    className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#4DBFAD] focus:border-transparent ${
                      errors.customerPhone ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="VD: 0912345678"
                  />
                  {errors.customerPhone && (
                    <p className="mt-1 text-sm text-red-500">{errors.customerPhone}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Admin Information Section */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4 pb-2 border-b border-gray-200">
                Thông Tin Quản Trị
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Admin URL */}
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Đường Dẫn Admin
                  </label>
                  <input
                    type="url"
                    value={formData.adminUrl}
                    onChange={(e) => handleChange('adminUrl', e.target.value)}
                    onBlur={() => handleUrlBlur('adminUrl')}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#4DBFAD] focus:border-transparent"
                    placeholder="VD: https://example.com/admin"
                  />
                </div>

                {/* Admin Username */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Tài Khoản Admin
                  </label>
                  <input
                    type="text"
                    value={formData.adminUsername}
                    onChange={(e) => handleChange('adminUsername', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#4DBFAD] focus:border-transparent"
                    placeholder="VD: admin"
                    autoComplete="off"
                  />
                </div>

                {/* Admin Password */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Mật Khẩu Admin
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={formData.adminPassword}
                      onChange={(e) => handleChange('adminPassword', e.target.value)}
                      className="w-full px-4 py-2 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#4DBFAD] focus:border-transparent"
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
                </div>
              </div>
            </div>

            {/* Price Section */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4 pb-2 border-b border-gray-200">
                Thông Tin Tài Chính
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Price */}
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Giá Trị Dự Án (VNĐ)
                  </label>
                  <NumberInput
                    value={formData.price}
                    onChange={(value) => handleChange('price', value)}
                    className="w-full pl-11 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#4DBFAD] focus:border-transparent"
                    placeholder="VD: 15000000"
                    min={0}
                    step={100000}
                    icon={<Banknote className="w-5 h-5 text-gray-400" />}
                  />
                  <p className="mt-1 text-sm text-gray-500">
                    {formData.price > 0 && (
                      <span className="font-medium text-[#2563B4]">
                        {formData.price.toLocaleString('vi-VN')} VNĐ
                      </span>
                    )}
                  </p>
                </div>
              </div>
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
              {isSubmitting ? (
                <LoadingDuckInline className="w-5 h-5" />
              ) : (
                project ? 'Cập Nhật' : 'Thêm Mới'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}