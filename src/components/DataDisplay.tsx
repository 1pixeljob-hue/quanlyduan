import { AlertCircle, Calendar, DollarSign, Tag, Link as LinkIcon, User, FileText, Globe, Server, Code } from 'lucide-react';

interface DataDisplayProps {
  data: any;
  moduleName: 'hosting' | 'project' | 'password' | 'codex';
}

export function DataDisplay({ data, moduleName }: DataDisplayProps) {
  if (!data) return null;

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

  const formatDateTime = (dateString: string) => {
    if (!dateString) return '-';
    const date = new Date(dateString);
    return date.toLocaleString('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatMoney = (amount: number) => {
    return new Intl.NumberFormat('vi-VN').format(amount) + ' VNĐ';
  };

  const getStatusBadge = (status: string) => {
    const badges: Record<string, { label: string; className: string }> = {
      active: { label: 'Hoạt động', className: 'bg-green-100 text-green-800' },
      expiring: { label: 'Sắp hết hạn', className: 'bg-yellow-100 text-yellow-800' },
      expired: { label: 'Đã hết hạn', className: 'bg-red-100 text-red-800' },
      'planning': { label: 'Lên kế hoạch', className: 'bg-blue-100 text-blue-800' },
      'in-progress': { label: 'Đang thực hiện', className: 'bg-purple-100 text-purple-800' },
      'pending-acceptance': { label: 'Chờ nghiệm thu', className: 'bg-orange-100 text-orange-800' },
      'completed': { label: 'Hoàn thành', className: 'bg-green-100 text-green-800' },
      'on-hold': { label: 'Tạm dừng', className: 'bg-gray-100 text-gray-800' },
    };
    const badge = badges[status] || { label: status, className: 'bg-gray-100 text-gray-800' };
    return (
      <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${badge.className}`}>
        {badge.label}
      </span>
    );
  };

  // Render field based on type
  const renderField = (label: string, value: any, icon?: React.ReactNode) => {
    if (value === null || value === undefined || value === '') return null;

    // Skip internal fields
    if (['id', 'createdAt', 'created_at'].includes(label)) return null;

    return (
      <div className="flex items-start gap-3 py-2.5 px-3 hover:bg-gray-50 rounded-lg transition-colors">
        {icon && <div className="text-gray-400 mt-0.5">{icon}</div>}
        <div className="flex-1 min-w-0">
          <div className="text-xs font-medium text-gray-500 mb-1">{getFieldLabel(label)}</div>
          <div className="text-sm text-gray-900 break-words">{formatValue(label, value)}</div>
        </div>
      </div>
    );
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

  const formatValue = (field: string, value: any): React.ReactNode => {
    // Status
    if (field === 'status') {
      return getStatusBadge(value);
    }

    // Dates
    if (field.toLowerCase().includes('date')) {
      return formatDate(value);
    }

    // Money
    if (field === 'price' || field === 'budget') {
      return <span className="font-semibold text-teal-700">{formatMoney(value)}</span>;
    }

    // Progress
    if (field === 'progress') {
      return (
        <div className="flex items-center gap-2">
          <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-teal-600 to-blue-600 transition-all"
              style={{ width: `${value}%` }}
            />
          </div>
          <span className="text-xs font-medium text-gray-600">{value}%</span>
        </div>
      );
    }

    // Password - hide it
    if (field === 'password') {
      return <span className="font-mono text-gray-400">••••••••</span>;
    }

    // URLs
    if (field === 'website' || field === 'domain' || value?.toString().startsWith('http')) {
      return (
        <a 
          href={value.startsWith('http') ? value : `https://${value}`} 
          target="_blank" 
          rel="noopener noreferrer"
          className="text-blue-600 hover:text-blue-700 hover:underline flex items-center gap-1"
        >
          {value}
          <LinkIcon className="w-3 h-3" />
        </a>
      );
    }

    // Arrays
    if (Array.isArray(value)) {
      return (
        <div className="flex flex-wrap gap-1.5">
          {value.map((item, i) => (
            <span key={i} className="px-2 py-0.5 bg-blue-100 text-blue-700 rounded text-xs">
              {item}
            </span>
          ))}
        </div>
      );
    }

    // Long text (description, notes, content)
    if (field === 'description' || field === 'notes' || field === 'content') {
      return <div className="text-sm text-gray-700 whitespace-pre-wrap">{value}</div>;
    }

    // Default
    return value;
  };

  const getFieldIcon = (field: string) => {
    const icons: Record<string, React.ReactNode> = {
      name: <FileText className="w-4 h-4" />,
      domain: <Globe className="w-4 h-4" />,
      provider: <Server className="w-4 h-4" />,
      registrationDate: <Calendar className="w-4 h-4" />,
      expirationDate: <Calendar className="w-4 h-4" />,
      startDate: <Calendar className="w-4 h-4" />,
      endDate: <Calendar className="w-4 h-4" />,
      price: <DollarSign className="w-4 h-4" />,
      budget: <DollarSign className="w-4 h-4" />,
      status: <AlertCircle className="w-4 h-4" />,
      customer: <User className="w-4 h-4" />,
      username: <User className="w-4 h-4" />,
      website: <Globe className="w-4 h-4" />,
      category: <Tag className="w-4 h-4" />,
      type: <Code className="w-4 h-4" />,
    };
    return icons[field];
  };

  // Render based on module type
  const renderHostingData = () => {
    return (
      <div className="space-y-1">
        {renderField('name', data.name, getFieldIcon('name'))}
        {renderField('domain', data.domain, getFieldIcon('domain'))}
        {renderField('provider', data.provider, getFieldIcon('provider'))}
        {renderField('registrationDate', data.registrationDate, getFieldIcon('registrationDate'))}
        {renderField('expirationDate', data.expirationDate, getFieldIcon('expirationDate'))}
        {renderField('price', data.price, getFieldIcon('price'))}
        {renderField('status', data.status, getFieldIcon('status'))}
        {renderField('notes', data.notes, <FileText className="w-4 h-4" />)}
      </div>
    );
  };

  const renderProjectData = () => {
    return (
      <div className="space-y-1">
        {renderField('name', data.name, getFieldIcon('name'))}
        {renderField('customer', data.customer, getFieldIcon('customer'))}
        {renderField('description', data.description, <FileText className="w-4 h-4" />)}
        {renderField('startDate', data.startDate, getFieldIcon('startDate'))}
        {renderField('endDate', data.endDate, getFieldIcon('endDate'))}
        {renderField('budget', data.budget, getFieldIcon('budget'))}
        {renderField('progress', data.progress)}
        {renderField('status', data.status, getFieldIcon('status'))}
      </div>
    );
  };

  const renderPasswordData = () => {
    return (
      <div className="space-y-1">
        {renderField('title', data.title, getFieldIcon('name'))}
        {renderField('username', data.username, getFieldIcon('username'))}
        {renderField('password', data.password)}
        {renderField('website', data.website, getFieldIcon('website'))}
        {renderField('category', data.category, getFieldIcon('category'))}
        {renderField('notes', data.notes, <FileText className="w-4 h-4" />)}
      </div>
    );
  };

  const renderCodexData = () => {
    return (
      <div className="space-y-1">
        {renderField('name', data.name, getFieldIcon('name'))}
        {renderField('type', data.type, getFieldIcon('type'))}
        {renderField('description', data.description, <FileText className="w-4 h-4" />)}
        {renderField('tags', data.tags)}
        {renderField('version', data.version)}
        {renderField('author', data.author, <User className="w-4 h-4" />)}
        {data.content && (
          <div className="mt-4">
            <div className="text-xs font-medium text-gray-500 mb-2">Nội dung code</div>
            <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg text-xs overflow-x-auto border border-gray-700 font-mono">
              {data.content}
            </pre>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4">
      {moduleName === 'hosting' && renderHostingData()}
      {moduleName === 'project' && renderProjectData()}
      {moduleName === 'password' && renderPasswordData()}
      {moduleName === 'codex' && renderCodexData()}
    </div>
  );
}
