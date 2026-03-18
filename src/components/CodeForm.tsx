import { useState, useEffect } from 'react';
import { CodeSnippet } from './CodeList';
import { X, Code, FileText, Tag, FileCode } from 'lucide-react';
import { CustomSelect } from './CustomSelect';

interface CodeFormProps {
  code?: CodeSnippet | null;
  onSubmit: (code: any) => void;
  onClose: () => void;
}

const codeTypes = [
  { value: 'javascript', label: 'JavaScript', bgColor: 'bg-yellow-100', color: 'text-yellow-800' },
  { value: 'typescript', label: 'TypeScript', bgColor: 'bg-blue-100', color: 'text-blue-800' },
  { value: 'html', label: 'HTML', bgColor: 'bg-orange-100', color: 'text-orange-800' },
  { value: 'css', label: 'CSS', bgColor: 'bg-cyan-100', color: 'text-cyan-800' },
  { value: 'php', label: 'PHP', bgColor: 'bg-indigo-100', color: 'text-indigo-800' },
  { value: 'python', label: 'Python', bgColor: 'bg-green-100', color: 'text-green-800' },
  { value: 'sql', label: 'SQL', bgColor: 'bg-purple-100', color: 'text-purple-800' },
  { value: 'json', label: 'JSON', bgColor: 'bg-gray-100', color: 'text-gray-800' },
  { value: 'other', label: 'Khác', bgColor: 'bg-slate-100', color: 'text-slate-800' }
];

export function CodeForm({ code, onSubmit, onClose }: CodeFormProps) {
  const [formData, setFormData] = useState({
    name: '',
    type: 'javascript',
    content: '',
    description: ''
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (code) {
      setFormData({
        name: code.name || '',
        type: code.type || 'javascript',
        content: code.content || '',
        description: code.description || ''
      });
    } else {
      setFormData({
        name: '',
        type: 'javascript',
        content: '',
        description: ''
      });
    }
  }, [code]);

  const validate = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Tên code là bắt buộc';
    }
    if (!formData.content.trim()) {
      newErrors.content = 'Nội dung code là bắt buộc';
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
      ...(code && { id: code.id, createdAt: code.createdAt }),
      name: formData.name.trim(),
      type: formData.type,
      content: formData.content.trim(),
      description: formData.description.trim()
    };

    onSubmit(submitData);
  };

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-black/60 via-[#4DBFAD]/20 to-[#2563B4]/20 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-3xl w-full max-h-[90vh] flex flex-col">
        {/* Header - Fixed */}
        <div className="flex items-center justify-between p-4 sm:p-6 border-b border-gray-200 bg-gradient-to-r from-[#4DBFAD]/10 to-[#2563B4]/10 flex-shrink-0 rounded-t-lg">
          <div className="flex items-center gap-2 sm:gap-3 min-w-0">
            <div className="bg-gradient-to-br from-[#4DBFAD] to-[#2563B4] p-2 rounded-lg flex-shrink-0">
              <Code className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
            </div>
            <h2 className="text-lg sm:text-2xl font-bold text-gray-900 truncate">
              {code ? 'Chỉnh Sửa Code' : 'Thêm Code Mới'}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors flex-shrink-0 ml-2"
          >
            <X className="w-5 h-5 sm:w-6 sm:h-6" />
          </button>
        </div>

        {/* Form - Scrollable */}
        <form onSubmit={handleSubmit} className="flex flex-col flex-1 min-h-0">
          <div className="overflow-y-auto project-modal-scroll p-4 sm:p-6 space-y-4 sm:space-y-6 flex-1">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
              {/* Name */}
              <div>
                <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-2">
                  <div className="flex items-center gap-2">
                    <FileCode className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-gray-500" />
                    <span>Tên Code <span className="text-red-500">*</span></span>
                  </div>
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => handleChange('name', e.target.value)}
                  className={`w-full px-3 sm:px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#4DBFAD] focus:border-transparent text-sm ${
                    errors.name ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="VD: React useEffect Hook"
                />
                {errors.name && (
                  <p className="mt-1 text-xs sm:text-sm text-red-500">{errors.name}</p>
                )}
              </div>

              {/* Type */}
              <div>
                <CustomSelect
                  value={formData.type}
                  onChange={(value) => handleChange('type', value)}
                  options={codeTypes}
                  label="Loại Code"
                  required
                />
              </div>
            </div>

            {/* Description */}
            <div>
              <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-2">
                <div className="flex items-center gap-2">
                  <FileText className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-gray-500" />
                  <span>Mô Tả</span>
                </div>
              </label>
              <input
                type="text"
                value={formData.description}
                onChange={(e) => handleChange('description', e.target.value)}
                className="w-full px-3 sm:px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#4DBFAD] focus:border-transparent text-sm"
                placeholder="VD: Hook để xử lý side effects trong React"
              />
            </div>

            {/* Content */}
            <div>
              <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-2">
                <div className="flex items-center gap-2">
                  <Code className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-gray-500" />
                  <span>Nội Dung Code <span className="text-red-500">*</span></span>
                </div>
              </label>
              <textarea
                value={formData.content}
                onChange={(e) => handleChange('content', e.target.value)}
                rows={10}
                className={`w-full px-3 sm:px-4 py-2 sm:py-3 border rounded-lg focus:ring-2 focus:ring-[#4DBFAD] focus:border-transparent resize-none font-mono text-xs sm:text-sm bg-gray-900 text-gray-100 ${
                  errors.content ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="// Nhập code của bạn tại đây..."
              />
              {errors.content && (
                <p className="mt-1 text-xs sm:text-sm text-red-500">{errors.content}</p>
              )}
              <p className="mt-2 text-xs text-gray-500">
                {formData.content.split('\n').length} dòng • {formData.content.length} ký tự
              </p>
            </div>
          </div>

          {/* Actions - Fixed */}
          <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 justify-end p-4 sm:p-6 sm:pt-4 border-t border-gray-200 flex-shrink-0 bg-white rounded-b-lg">
            <button
              type="button"
              onClick={onClose}
              className="w-full sm:w-auto px-4 sm:px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm"
            >
              Hủy
            </button>
            <button
              type="submit"
              className="w-full sm:w-auto px-4 sm:px-6 py-2 bg-gradient-to-r from-[#4DBFAD] to-[#2563B4] text-white rounded-lg hover:opacity-90 transition-opacity text-sm font-medium"
            >
              {code ? 'Cập Nhật' : 'Thêm Mới'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}