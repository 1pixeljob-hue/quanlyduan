import { useState, useEffect } from 'react';
import { Hosting } from '../App';
import { X } from 'lucide-react';
import { DateInput } from './DateInput';
import { LoadingDuckInline } from './LoadingDuck';
import { NumberInput } from './NumberInput';

interface HostingFormProps {
  hosting?: Hosting | null;
  onSubmit: (hosting: any) => void;
  onClose: () => void;
}

export function HostingForm({ hosting, onSubmit, onClose }: HostingFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    domain: '',
    provider: 'Inet',
    registrationDate: '',
    expirationDate: '',
    price: '1100000',
    notes: ''
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (hosting) {
      setFormData({
        name: hosting.name,
        domain: hosting.domain,
        provider: hosting.provider,
        registrationDate: hosting.registrationDate,
        expirationDate: hosting.expirationDate,
        price: hosting.price.toString(),
        notes: hosting.notes || ''
      });
    } else {
      // Reset to default values when adding new hosting
      setFormData({
        name: '',
        domain: '',
        provider: 'Inet',
        registrationDate: '',
        expirationDate: '',
        price: '1100000',
        notes: ''
      });
    }
  }, [hosting]);

  const validate = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Tên hosting là bắt buộc';
    }
    if (!formData.domain.trim()) {
      newErrors.domain = 'Tên miền là bắt buộc';
    }
    if (!formData.provider.trim()) {
      newErrors.provider = 'Nhà cung cấp là bắt buộc';
    }
    if (!formData.registrationDate) {
      newErrors.registrationDate = 'Ngày đăng ký là bắt buộc';
    }
    if (!formData.expirationDate) {
      newErrors.expirationDate = 'Ngày hết hạn là bắt buộc';
    }
    if (formData.registrationDate && formData.expirationDate) {
      if (new Date(formData.expirationDate) <= new Date(formData.registrationDate)) {
        newErrors.expirationDate = 'Ngày hết hạn phải sau ngày đăng ký';
      }
    }
    if (!formData.price || parseFloat(formData.price) <= 0) {
      newErrors.price = 'Giá phải lớn hơn 0';
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
      ...(hosting && { id: hosting.id }),
      name: formData.name.trim(),
      domain: formData.domain.trim(),
      provider: formData.provider.trim(),
      registrationDate: formData.registrationDate,
      expirationDate: formData.expirationDate,
      price: parseFloat(formData.price),
      notes: formData.notes.trim()
    };

    onSubmit(submitData);
  };

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
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
            {hosting ? 'Chỉnh Sửa Hosting' : 'Thêm Hosting Mới'}
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
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Name */}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tên Hosting <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => handleChange('name', e.target.value)}
                  className={`w-full h-11 px-4 border rounded-lg shadow-sm hover:shadow-md hover:border-[#4DBFAD] focus:ring-2 focus:ring-[#4DBFAD] focus:border-transparent transition-all duration-200 ${
                    errors.name ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="VD: Website Chính"
                />
                {errors.name && (
                  <p className="mt-1 text-sm text-red-500">{errors.name}</p>
                )}
              </div>

              {/* Domain */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tên Miền <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.domain}
                  onChange={(e) => handleChange('domain', e.target.value)}
                  onBlur={() => handleUrlBlur('domain')}
                  className={`w-full h-11 px-4 border rounded-lg shadow-sm hover:shadow-md hover:border-[#4DBFAD] focus:ring-2 focus:ring-[#4DBFAD] focus:border-transparent transition-all duration-200 ${
                    errors.domain ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="VD: example.com"
                />
                {errors.domain && (
                  <p className="mt-1 text-sm text-red-500">{errors.domain}</p>
                )}
              </div>

              {/* Provider */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nhà Cung Cấp <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.provider}
                  onChange={(e) => handleChange('provider', e.target.value)}
                  className={`w-full h-11 px-4 border rounded-lg shadow-sm hover:shadow-md hover:border-[#4DBFAD] focus:ring-2 focus:ring-[#4DBFAD] focus:border-transparent transition-all duration-200 ${
                    errors.provider ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="VD: HostGator, Bluehost"
                />
                {errors.provider && (
                  <p className="mt-1 text-sm text-red-500">{errors.provider}</p>
                )}
              </div>

              {/* Registration Date */}
              <div>
                <DateInput
                  value={formData.registrationDate}
                  onChange={(value) => handleChange('registrationDate', value)}
                  label="Ngày Đăng Ký"
                  required
                />
                {errors.registrationDate && (
                  <p className="mt-1 text-sm text-red-500">{errors.registrationDate}</p>
                )}
              </div>

              {/* Expiration Date */}
              <div>
                <DateInput
                  value={formData.expirationDate}
                  onChange={(value) => handleChange('expirationDate', value)}
                  label="Ngày Hết Hạn"
                  required
                />
                {errors.expirationDate && (
                  <p className="mt-1 text-sm text-red-500">{errors.expirationDate}</p>
                )}
              </div>

              {/* Price */}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Giá (VNĐ) <span className="text-red-500">*</span>
                </label>
                <NumberInput
                  value={formData.price}
                  onChange={(value) => handleChange('price', value)}
                  className={`w-full pl-11 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#4DBFAD] focus:border-transparent ${errors.price ? 'border-red-500' : 'border-gray-300'}`}
                  placeholder="VD: 1200000"
                  min={0}
                  step={1000}
                  icon={
                    <svg className="w-5 h-5 text-gray-400" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                      <rect x="2" y="5" width="20" height="14" rx="2"/>
                      <line x1="2" y1="10" x2="22" y2="10"/>
                    </svg>
                  }
                />
                {!errors.price && formData.price && parseFloat(formData.price) > 0 && (
                  <p className="mt-1 text-sm text-gray-500">
                    <span className="font-medium text-[#2563B4]">
                      {parseFloat(formData.price).toLocaleString('vi-VN')} VNĐ
                    </span>
                  </p>
                )}
                {errors.price && (
                  <p className="mt-1 text-sm text-red-500">{errors.price}</p>
                )}
              </div>

              {/* Notes */}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Ghi Chú
                </label>
                <textarea
                  value={formData.notes}
                  onChange={(e) => handleChange('notes', e.target.value)}
                  rows={3}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#4DBFAD] focus:border-transparent resize-none"
                  placeholder="Thêm ghi chú về hosting này..."
                />
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
              {isSubmitting ? <LoadingDuckInline /> : (hosting ? 'Cập Nhật' : 'Thêm Mới')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}