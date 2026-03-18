import { useState } from 'react';
import { Hosting } from '../App';
import { Pencil, Trash2, ExternalLink, Calendar, AlertCircle, CheckCircle, Server, Globe, Banknote, Clock, Edit2, MoreVertical, Eye, X } from 'lucide-react';
import { isoToVNDate } from '../utils/dateFormat';
import { Pagination } from './Pagination';
import { Checkbox } from './Checkbox';

interface HostingListProps {
  hostings: Hosting[];
  onEdit: (hosting: Hosting) => void;
  onDelete: (id: string) => void;
}

export function HostingList({ hostings, onEdit, onDelete }: HostingListProps) {
  const [activeCard, setActiveCard] = useState<string | null>(null);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [viewDetailsId, setViewDetailsId] = useState<string | null>(null);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Sort hostings by status order: expired -> expiring -> active
  const statusOrder: { [key in Hosting['status']]: number} = {
    'expired': 1,
    'expiring': 2,
    'active': 3
  };

  const sortedHostings = [...hostings].sort((a, b) => {
    const orderA = statusOrder[a.status];
    const orderB = statusOrder[b.status];
    
    // Sort by status order first
    if (orderA !== orderB) {
      return orderA - orderB;
    }
    
    // If same status, sort by expiration date
    return new Date(a.expirationDate).getTime() - new Date(b.expirationDate).getTime();
  });

  // Pagination
  const paginatedHostings = sortedHostings.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);
  const paginatedIds = paginatedHostings.map(h => h.id);
  
  // Select/Deselect all on current page
  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedIds([...new Set([...selectedIds, ...paginatedIds])]);
    } else {
      setSelectedIds(selectedIds.filter(id => !paginatedIds.includes(id)));
    }
  };

  const handleSelectOne = (id: string, checked: boolean) => {
    if (checked) {
      setSelectedIds([...selectedIds, id]);
    } else {
      setSelectedIds(selectedIds.filter(selectedId => selectedId !== id));
    }
  };

  const allPageSelected = paginatedIds.length > 0 && paginatedIds.every(id => selectedIds.includes(id));
  const somePageSelected = paginatedIds.some(id => selectedIds.includes(id)) && !allPageSelected;

  const getStatusBadge = (status: Hosting['status']) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'expiring':
        return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'expired':
        return 'bg-red-100 text-red-800 border-red-200';
    }
  };

  const getStatusText = (status: Hosting['status']) => {
    switch (status) {
      case 'active':
        return 'Hoạt động';
      case 'expiring':
        return 'Sắp hết hạn';
      case 'expired':
        return 'Đã hết hạn';
    }
  };

  const getStatusIcon = (status: Hosting['status']) => {
    switch (status) {
      case 'active':
        return <CheckCircle className="w-4 h-4" />;
      case 'expiring':
        return <AlertCircle className="w-4 h-4" />;
      case 'expired':
        return <AlertCircle className="w-4 h-4" />;
    }
  };

  const getDaysRemaining = (expirationDate: string) => {
    const today = new Date();
    const expDate = new Date(expirationDate);
    const days = Math.ceil((expDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
    return days;
  };

  const getUsageDuration = (registrationDate: string, expirationDate: string) => {
    const startDate = new Date(registrationDate);
    const endDate = new Date(expirationDate);
    
    // Calculate total months
    const yearsDiff = endDate.getFullYear() - startDate.getFullYear();
    const monthsDiff = endDate.getMonth() - startDate.getMonth();
    const totalMonths = yearsDiff * 12 + monthsDiff;
    
    // If less than 1 month, show in days
    if (totalMonths < 1) {
      const days = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
      return `${days} ngày`;
    }
    
    // If less than 12 months, show in months
    if (totalMonths < 12) {
      return `${totalMonths} tháng`;
    }
    
    // If 12 months or more, show in years and months
    const years = Math.floor(totalMonths / 12);
    const months = totalMonths % 12;
    
    if (months === 0) {
      return `${years} năm`;
    }
    
    return `${years} năm ${months} tháng`;
  };

  if (hostings.length === 0) {
    return (
      <div className="mt-8 bg-white rounded-lg shadow-sm border border-gray-200 p-8 sm:p-12 text-center">
        <Server className="w-12 h-12 sm:w-16 sm:h-16 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2">
          Chưa có hosting nào
        </h3>
        <p className="text-sm sm:text-base text-gray-600">
          Bắt đầu bằng cách thêm hosting đầu tiên của bạn
        </p>
      </div>
    );
  }

  return (
    <div className="mt-6 sm:mt-8 space-y-4 sm:space-y-6">
      {/* Details Modal */}
      {viewDetailsId && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4" onClick={() => setViewDetailsId(null)}>
          <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] flex flex-col" onClick={(e) => e.stopPropagation()}>
            {(() => {
              const hosting = hostings.find(h => h.id === viewDetailsId);
              if (!hosting) return null;
              
              return (
                <>
                  {/* Header - Fixed */}
                  <div className="bg-gradient-to-r from-[#4DBFAD] to-[#2563B4] text-white px-4 sm:px-6 py-3 sm:py-4 flex items-center justify-between flex-shrink-0 rounded-t-lg">
                    <div className="flex items-center gap-2 sm:gap-3">
                      <Server className="w-5 h-5 sm:w-6 sm:h-6" />
                      <h3 className="text-lg sm:text-xl font-bold">Chi Tiết Hosting</h3>
                    </div>
                    <button
                      onClick={() => setViewDetailsId(null)}
                      className="p-1.5 sm:p-2 hover:bg-white/20 rounded-lg transition-colors"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>

                  {/* Content - Scrollable */}
                  <div className="overflow-y-auto project-modal-scroll p-4 sm:p-6 space-y-4 sm:space-y-6 flex-1">
                    {/* Status Badge */}
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                      <span className={`inline-flex items-center gap-1.5 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm font-medium border ${getStatusBadge(hosting.status)}`}>
                        {getStatusIcon(hosting.status)}
                        {getStatusText(hosting.status)}
                      </span>
                      <div className="flex items-center gap-2 text-xl sm:text-2xl font-bold text-[#2563B4]">
                        <Banknote className="w-5 h-5 sm:w-6 sm:h-6" />
                        {hosting.price.toLocaleString('vi-VN')} VNĐ
                      </div>
                    </div>

                    {/* Main Info */}
                    <div className="space-y-4">
                      <div>
                        <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Tên Hosting</label>
                        <div className="mt-1 text-base sm:text-lg font-bold text-gray-900">{hosting.name}</div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                        <div>
                          <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Domain</label>
                          <div className="mt-1 flex items-center gap-2">
                            <Globe className="w-4 h-4 text-gray-400 flex-shrink-0" />
                            <span className="font-semibold text-gray-900 text-sm sm:text-base break-all">{hosting.domain}</span>
                          </div>
                        </div>

                        <div>
                          <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Nhà Cung Cấp</label>
                          <div className="mt-1 flex items-center gap-2">
                            <Server className="w-4 h-4 text-gray-400 flex-shrink-0" />
                            <span className="font-semibold text-gray-900 text-sm sm:text-base">{hosting.provider}</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Dates Section */}
                    <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg p-4 sm:p-5 space-y-4">
                      <h4 className="font-bold text-gray-900 flex items-center gap-2 text-sm sm:text-base">
                        <Calendar className="w-4 h-4 sm:w-5 sm:h-5" />
                        Thông Tin Thời Gian
                      </h4>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                        <div>
                          <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Ngày Đăng Ký</label>
                          <div className="mt-1 text-sm sm:text-base font-semibold text-gray-900">
                            {isoToVNDate(hosting.registrationDate)}
                          </div>
                        </div>

                        <div>
                          <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Ngày Hết Hạn</label>
                          <div className={`mt-1 text-sm sm:text-base font-semibold ${
                            hosting.status === 'expired' 
                              ? 'text-red-600' 
                              : hosting.status === 'expiring'
                              ? 'text-orange-600'
                              : 'text-gray-900'
                          }`}>
                            {isoToVNDate(hosting.expirationDate)}
                          </div>
                        </div>
                      </div>

                      <div className="pt-3 sm:pt-4 border-t border-gray-200">
                        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                          <div>
                            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Thời Gian Sử Dụng</label>
                            <div className="mt-1 text-sm sm:text-base font-semibold text-gray-900">
                              {getUsageDuration(hosting.registrationDate, hosting.expirationDate)}
                            </div>
                          </div>

                          <div className="text-left sm:text-right">
                            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Còn Lại</label>
                            <div className="mt-1 flex items-center gap-2">
                              <Clock className={`w-4 h-4 sm:w-5 sm:h-5 ${
                                hosting.status === 'expired'
                                  ? 'text-red-500'
                                  : hosting.status === 'expiring'
                                  ? 'text-orange-500'
                                  : 'text-green-500'
                              }`} />
                              {getDaysRemaining(hosting.expirationDate) >= 0 ? (
                                <span className={`text-base sm:text-lg font-bold ${
                                  hosting.status === 'expiring' ? 'text-orange-600' : 'text-green-600'
                                }`}>
                                  {getDaysRemaining(hosting.expirationDate)} ngày
                                </span>
                              ) : (
                                <span className="text-base sm:text-lg font-bold text-red-600">
                                  Quá hạn {Math.abs(getDaysRemaining(hosting.expirationDate))} ngày
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Notes */}
                    {hosting.notes && (
                      <div>
                        <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Ghi Chú</label>
                        <div className="mt-2 p-3 sm:p-4 bg-blue-50 border border-blue-200 rounded-lg text-xs sm:text-sm text-gray-700 italic">
                          {hosting.notes}
                        </div>
                      </div>
                    )}

                    {/* Action Buttons */}
                    <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 pt-4 border-t border-gray-200">
                      <button
                        onClick={() => {
                          onEdit(hosting);
                          setViewDetailsId(null);
                        }}
                        className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 sm:py-3 text-sm sm:text-base text-white bg-gradient-to-r from-[#4DBFAD] to-[#2563B4] hover:opacity-90 rounded-lg transition-opacity font-medium"
                      >
                        <Edit2 className="w-4 h-4" />
                        Chỉnh Sửa
                      </button>
                      <button
                        onClick={() => {
                          onDelete(hosting.id);
                          setViewDetailsId(null);
                        }}
                        className="sm:flex-none px-4 py-2.5 sm:py-3 text-sm sm:text-base text-red-600 bg-red-50 hover:bg-red-100 rounded-lg transition-colors font-medium flex items-center justify-center gap-2"
                      >
                        <Trash2 className="w-4 h-4 sm:w-5 sm:h-5" />
                        <span className="sm:hidden">Xóa</span>
                      </button>
                    </div>
                  </div>
                </>
              );
            })()}
          </div>
        </div>
      )}

      {/* Selection Action Bar - Mobile & Desktop */}
      {selectedIds.length > 0 && (
        <div className="bg-gradient-to-r from-[#4DBFAD] to-[#2563B4] px-4 sm:px-6 py-3 rounded-lg flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-lg">
          <div className="flex items-center gap-2 sm:gap-3 text-white">
            <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0" />
            <span className="font-semibold text-sm sm:text-base">
              Đã chọn {selectedIds.length} hosting
            </span>
          </div>
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button
              onClick={() => setSelectedIds([])}
              className="flex-1 sm:flex-none px-3 sm:px-4 py-1.5 sm:py-2 bg-white/20 hover:bg-white/30 text-white rounded-lg transition-colors text-xs sm:text-sm font-medium"
            >
              Bỏ chọn
            </button>
            <button
              onClick={() => {
                if (confirm(`Bạn có chắc muốn xóa ${selectedIds.length} hosting đã chọn?`)) {
                  selectedIds.forEach(id => onDelete(id));
                  setSelectedIds([]);
                }
              }}
              className="flex-1 sm:flex-none px-3 sm:px-4 py-1.5 sm:py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors text-xs sm:text-sm font-medium flex items-center justify-center gap-1.5 sm:gap-2"
            >
              <Trash2 className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              Xóa {selectedIds.length}
            </button>
          </div>
        </div>
      )}

      {/* Mobile Card View */}
      <div className="block md:hidden space-y-4">
        {paginatedHostings.map((hosting) => {
          const daysRemaining = getDaysRemaining(hosting.expirationDate);
          const isSelected = selectedIds.includes(hosting.id);
          
          return (
            <div
              key={hosting.id}
              className={`bg-white rounded-lg border-2 transition-all ${
                isSelected 
                  ? 'border-[#4DBFAD] shadow-lg' 
                  : hosting.status === 'expired'
                  ? 'border-red-200 bg-red-50/30'
                  : hosting.status === 'expiring'
                  ? 'border-orange-200 bg-orange-50/30'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              {/* Card Header */}
              <div className="p-4 border-b border-gray-100">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-3 flex-1 min-w-0">
                    <Checkbox
                      checked={isSelected}
                      onChange={(checked) => handleSelectOne(hosting.id, checked)}
                    />
                    <div className="flex-1 min-w-0">
                      <h3 className="font-bold text-gray-900 text-base mb-1 break-words">
                        {hosting.name}
                      </h3>
                      <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
                        <Globe className="w-3.5 h-3.5 flex-shrink-0" />
                        <span className="break-all">{hosting.domain}</span>
                      </div>
                    </div>
                  </div>
                  
                  {/* Status Badge */}
                  <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium border flex-shrink-0 ${getStatusBadge(hosting.status)}`}>
                    {getStatusIcon(hosting.status)}
                    {getStatusText(hosting.status)}
                  </span>
                </div>
              </div>

              {/* Card Body */}
              <div className="p-4 space-y-3">
                {/* Provider & Price */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Server className="w-4 h-4 flex-shrink-0" />
                    <span>{hosting.provider}</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-base font-bold text-[#2563B4]">
                    <Banknote className="w-4 h-4" />
                    {hosting.price.toLocaleString('vi-VN')}
                  </div>
                </div>

                {/* Expiration Info */}
                <div className="bg-gray-50 rounded-lg p-3 space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Ngày hết hạn:</span>
                    <span className={`font-semibold ${
                      hosting.status === 'expired' 
                        ? 'text-red-600' 
                        : hosting.status === 'expiring'
                        ? 'text-orange-600'
                        : 'text-gray-900'
                    }`}>
                      {isoToVNDate(hosting.expirationDate)}
                    </span>
                  </div>
                  
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Thời gian còn lại:</span>
                    <div className="flex items-center gap-1.5">
                      <Clock className={`w-4 h-4 ${
                        hosting.status === 'expired'
                          ? 'text-red-500'
                          : hosting.status === 'expiring'
                          ? 'text-orange-500'
                          : 'text-green-500'
                      }`} />
                      {daysRemaining >= 0 ? (
                        <span className={`font-bold ${
                          hosting.status === 'expiring' ? 'text-orange-600' : 'text-green-600'
                        }`}>
                          {daysRemaining} ngày
                        </span>
                      ) : (
                        <span className="font-bold text-red-600">
                          Quá hạn {Math.abs(daysRemaining)} ngày
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Notes */}
                {hosting.notes && (
                  <div className="text-xs text-gray-600 italic bg-blue-50 border border-blue-100 rounded p-2 line-clamp-2">
                    {hosting.notes}
                  </div>
                )}
              </div>

              {/* Card Footer - Actions */}
              <div className="p-3 bg-gray-50 border-t border-gray-100 flex gap-2">
                <button
                  onClick={() => setViewDetailsId(hosting.id)}
                  className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 text-sm font-medium text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors"
                >
                  <Eye className="w-4 h-4" />
                  Chi tiết
                </button>
                <button
                  onClick={() => onEdit(hosting)}
                  className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 text-sm font-medium text-white bg-gradient-to-r from-[#4DBFAD] to-[#2563B4] hover:opacity-90 rounded-lg transition-opacity"
                >
                  <Edit2 className="w-4 h-4" />
                  Sửa
                </button>
                <button
                  onClick={() => onDelete(hosting.id)}
                  className="px-3 py-2 text-red-600 bg-red-50 hover:bg-red-100 rounded-lg transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Desktop Table View */}
      <div className="hidden md:block bg-white rounded-lg shadow-sm border-2 border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gradient-to-r from-gray-50 to-gray-100 border-b-2 border-gray-200">
              <tr>
                <th className="px-4 lg:px-6 py-4 text-left w-12">
                  <Checkbox
                    checked={allPageSelected}
                    indeterminate={somePageSelected}
                    onChange={handleSelectAll}
                  />
                </th>
                <th className="px-4 lg:px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                  Tên Hosting
                </th>
                <th className="px-4 lg:px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                  Domain
                </th>
                <th className="px-4 lg:px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                  Nhà Cung Cấp
                </th>
                <th className="px-4 lg:px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                  Ngày Hết Hạn
                </th>
                <th className="px-4 lg:px-6 py-4 text-center text-xs font-bold text-gray-700 uppercase tracking-wider">
                  Trạng Thái
                </th>
                <th className="px-4 lg:px-6 py-4 text-center text-xs font-bold text-gray-700 uppercase tracking-wider">
                  Thao Tác
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 bg-white">
              {paginatedHostings.map((hosting) => {
                const daysRemaining = getDaysRemaining(hosting.expirationDate);
                const isActive = activeCard === hosting.id;
                const isSelected = selectedIds.includes(hosting.id);
                
                return (
                  <tr
                    key={hosting.id}
                    className={`hover:bg-gray-50 transition-colors ${
                      isSelected ? 'bg-blue-50' :
                      hosting.status === 'expired' 
                        ? 'bg-red-50/30' 
                        : hosting.status === 'expiring'
                        ? 'bg-orange-50/30'
                        : ''
                    }`}
                    onMouseEnter={() => setActiveCard(hosting.id)}
                    onMouseLeave={() => setActiveCard(null)}
                  >
                    {/* Checkbox */}
                    <td className="px-4 lg:px-6 py-4">
                      <Checkbox
                        checked={isSelected}
                        onChange={(checked) => handleSelectOne(hosting.id, checked)}
                        onClick={(e) => e.stopPropagation()}
                      />
                    </td>

                    {/* Tên Hosting */}
                    <td className="px-4 lg:px-6 py-4">
                      <div>
                        <div className="font-semibold text-gray-900 mb-1">
                          {hosting.name}
                        </div>
                        {hosting.notes && (
                          <div className="text-xs text-gray-500 italic line-clamp-1">
                            {hosting.notes}
                          </div>
                        )}
                        <div className="text-xs text-gray-400 mt-1">
                          Sử dụng: {getUsageDuration(hosting.registrationDate, hosting.expirationDate)}
                        </div>
                      </div>
                    </td>

                    {/* Domain */}
                    <td className="px-4 lg:px-6 py-4">
                      <div className="flex items-center gap-2">
                        <Globe className="w-4 h-4 text-gray-400 flex-shrink-0" />
                        <span className="text-sm text-gray-900 font-medium">
                          {hosting.domain}
                        </span>
                      </div>
                    </td>

                    {/* Nhà Cung Cấp */}
                    <td className="px-4 lg:px-6 py-4">
                      <div className="flex items-center gap-2">
                        <Server className="w-4 h-4 text-gray-400" />
                        <span className="text-sm text-gray-700">
                          {hosting.provider}
                        </span>
                      </div>
                    </td>

                    {/* Ngày Hết Hạn */}
                    <td className="px-4 lg:px-6 py-4">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <Calendar className="w-4 h-4 text-gray-400" />
                          <span className={`text-sm font-medium ${
                            hosting.status === 'expired' 
                              ? 'text-red-600' 
                              : hosting.status === 'expiring'
                              ? 'text-orange-600'
                              : 'text-gray-900'
                          }`}>
                            {isoToVNDate(hosting.expirationDate)}
                          </span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className={`w-3.5 h-3.5 ${
                            hosting.status === 'expired'
                              ? 'text-red-500'
                              : hosting.status === 'expiring'
                              ? 'text-orange-500'
                              : 'text-green-500'
                          }`} />
                          {daysRemaining >= 0 ? (
                            <span className={`text-xs font-semibold ${
                              hosting.status === 'expiring' ? 'text-orange-600' : 'text-green-600'
                            }`}>
                              Còn {daysRemaining} ngày
                            </span>
                          ) : (
                            <span className="text-xs font-semibold text-red-600">
                              Quá hạn {Math.abs(daysRemaining)} ngày
                            </span>
                          )}
                        </div>
                      </div>
                    </td>

                    {/* Trạng Thái */}
                    <td className="px-4 lg:px-6 py-4 text-center">
                      <span
                          className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium border ${getStatusBadge(
                            hosting.status
                          )}`}
                        >
                          {getStatusIcon(hosting.status)}
                          {getStatusText(hosting.status)}
                        </span>
                    </td>

                    {/* Thao Tác - Dropdown */}
                    <td className="px-4 lg:px-6 py-4">
                      <div className="flex items-center justify-center relative">
                        <button
                          onClick={() => setOpenDropdown(openDropdown === hosting.id ? null : hosting.id)}
                          className="p-2 text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                          title="Thao tác"
                          id={`dropdown-trigger-${hosting.id}`}
                        >
                          <MoreVertical className="w-4 h-4" />
                        </button>

                        {/* Dropdown Menu */}
                        {openDropdown === hosting.id && (() => {
                          const trigger = document.getElementById(`dropdown-trigger-${hosting.id}`);
                          const rect = trigger?.getBoundingClientRect();
                          
                          return (
                            <>
                              {/* Backdrop */}
                              <div 
                                className="fixed inset-0 z-10" 
                                onClick={() => setOpenDropdown(null)}
                              />
                              
                              {/* Menu - Fixed positioning */}
                              <div 
                                className="fixed w-48 bg-white rounded-lg shadow-xl border-2 border-gray-200 py-2 z-20"
                                style={{
                                  top: rect ? `${rect.bottom + 8}px` : '0',
                                  right: rect ? `${window.innerWidth - rect.right}px` : '0',
                                }}
                              >
                                <button
                                  onClick={() => {
                                    setViewDetailsId(hosting.id);
                                    setOpenDropdown(null);
                                  }}
                                  className="w-full flex items-center gap-3 px-4 py-2.5 text-left text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                                >
                                  <Eye className="w-4 h-4 text-blue-600" />
                                  <span className="font-medium">Xem Chi Tiết</span>
                                </button>
                                
                                <button
                                  onClick={() => {
                                    onEdit(hosting);
                                    setOpenDropdown(null);
                                  }}
                                  className="w-full flex items-center gap-3 px-4 py-2.5 text-left text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                                >
                                  <Edit2 className="w-4 h-4 text-[#4DBFAD]" />
                                  <span className="font-medium">Chỉnh Sửa</span>
                                </button>
                                
                                <div className="my-1 border-t border-gray-200" />
                                
                                <button
                                  onClick={() => {
                                    onDelete(hosting.id);
                                    setOpenDropdown(null);
                                  }}
                                  className="w-full flex items-center gap-3 px-4 py-2.5 text-left text-sm text-red-600 hover:bg-red-50 transition-colors"
                                >
                                  <Trash2 className="w-4 h-4" />
                                  <span className="font-medium">Xóa</span>
                                </button>
                              </div>
                            </>
                          );
                        })()}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <Pagination
          totalItems={hostings.length}
          itemsPerPage={itemsPerPage}
          currentPage={currentPage}
          onPageChange={setCurrentPage}
        />
      </div>

      {/* Mobile Pagination */}
      <div className="block md:hidden">
        <Pagination
          totalItems={hostings.length}
          itemsPerPage={itemsPerPage}
          currentPage={currentPage}
          onPageChange={setCurrentPage}
        />
      </div>
    </div>
  );
}