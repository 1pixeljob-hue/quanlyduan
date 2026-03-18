import { ArrowRight } from 'lucide-react';

interface DataComparisonProps {
  oldData: any;
  newData: any;
  moduleName: 'hosting' | 'project' | 'password' | 'codex';
}

export function DataComparison({ oldData, newData, moduleName }: DataComparisonProps) {
  if (!oldData || !newData) return null;

  // Format functions
  const formatDate = (dateString: string) => {
    if (!dateString) return '-';
    const date = new Date(dateString);
    return date.toLocaleDateString('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  const formatMoney = (amount: number) => {
    return new Intl.NumberFormat('vi-VN').format(amount) + ' VNĐ';
  };

  const getStatusLabel = (status: string) => {
    const labels: Record<string, string> = {
      active: 'Hoạt động',
      expiring: 'Sắp hết hạn',
      expired: 'Đã hết hạn',
      'planning': 'Lên kế hoạch',
      'in-progress': 'Đang thực hiện',
      'pending-acceptance': 'Chờ nghiệm thu',
      'completed': 'Hoàn thành',
      'on-hold': 'Tạm dừng',
    };
    return labels[status] || status;
  };

  const getFieldLabel = (field: string): string => {
    const labels: Record<string, string> = {
      name: 'Tên',
      domain: 'Domain',
      provider: 'Nhà cung cấp',
      registrationDate: 'Ngày đăng ký',
      expirationDate: 'Ngày hết hạn',
      price: 'Giá',
      status: 'Trạng thái',
      notes: 'Ghi chú',
      customer: 'Khách hàng',
      description: 'Mô tả',
      startDate: 'Ngày bắt đầu',
      endDate: 'Ngày kết thúc',
      budget: 'Ngân sách',
      progress: 'Tiến độ',
      title: 'Tiêu đề',
      username: 'Tên đăng nhập',
      password: 'Mật khẩu',
      website: 'Website',
      category: 'Loại',
      type: 'Loại ngôn ngữ',
      content: 'Nội dung',
      tags: 'Tags',
      version: 'Phiên bản',
      author: 'Tác giả',
    };
    return labels[field] || field;
  };

  const formatValue = (field: string, value: any): string => {
    if (value === null || value === undefined || value === '') return '-';

    // Status
    if (field === 'status') {
      return getStatusLabel(value);
    }

    // Dates
    if (field.toLowerCase().includes('date')) {
      return formatDate(value);
    }

    // Money
    if (field === 'price' || field === 'budget') {
      return formatMoney(value);
    }

    // Progress
    if (field === 'progress') {
      return `${value}%`;
    }

    // Password
    if (field === 'password') {
      return '••••••••';
    }

    // Arrays
    if (Array.isArray(value)) {
      return value.join(', ');
    }

    return String(value);
  };

  // Get all unique keys from both objects
  const allKeys = Array.from(new Set([...Object.keys(oldData), ...Object.keys(newData)]));
  
  // Filter out internal fields
  const fieldsToCompare = allKeys.filter(key => 
    !['id', 'createdAt', 'created_at'].includes(key)
  );

  // Find changed fields
  const changedFields = fieldsToCompare.filter(key => {
    const oldVal = oldData[key];
    const newVal = newData[key];
    return JSON.stringify(oldVal) !== JSON.stringify(newVal);
  });

  if (changedFields.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        Không có thay đổi nào
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {changedFields.map(field => {
        const oldValue = oldData[field];
        const newValue = newData[field];
        const isCodeContent = field === 'content';

        return (
          <div 
            key={field} 
            className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
          >
            <div className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
              {getFieldLabel(field)}
            </div>

            {isCodeContent ? (
              // Special handling for code content
              <div className="space-y-3">
                <div>
                  <div className="text-xs text-gray-500 mb-2">Trước</div>
                  <pre className="bg-red-50 text-red-900 p-3 rounded text-xs overflow-x-auto border border-red-200 font-mono">
                    {oldValue || '-'}
                  </pre>
                </div>
                <div className="flex justify-center">
                  <ArrowRight className="w-5 h-5 text-gray-400" />
                </div>
                <div>
                  <div className="text-xs text-gray-500 mb-2">Sau</div>
                  <pre className="bg-green-50 text-green-900 p-3 rounded text-xs overflow-x-auto border border-green-200 font-mono">
                    {newValue || '-'}
                  </pre>
                </div>
              </div>
            ) : (
              // Regular field comparison
              <div className="flex items-center gap-4">
                <div className="flex-1 bg-red-50 border border-red-200 rounded-lg p-3">
                  <div className="text-xs text-red-600 font-medium mb-1">Trước</div>
                  <div className="text-sm text-red-900 break-words">
                    {formatValue(field, oldValue)}
                  </div>
                </div>

                <ArrowRight className="w-5 h-5 text-gray-400 flex-shrink-0" />

                <div className="flex-1 bg-green-50 border border-green-200 rounded-lg p-3">
                  <div className="text-xs text-green-600 font-medium mb-1">Sau</div>
                  <div className="text-sm text-green-900 break-words">
                    {formatValue(field, newValue)}
                  </div>
                </div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
