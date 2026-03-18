import { useState, useMemo } from 'react';
import { FolderKanban, Search, Plus, Edit2, Trash2, Eye, Calendar, User, Banknote, AlertCircle, CheckCircle, Clock, ChevronDown, ChevronUp, Filter, X, FileText, Phone, Lock, Copy, ExternalLink, MoreVertical } from 'lucide-react';
import { isoToVNDate } from '../utils/dateFormat';
import { formatCurrency, formatFullCurrency } from '../utils/formatMoney';
import { Pagination } from './Pagination';
import { Checkbox } from './Checkbox';

export interface Project {
  id: string;
  name: string;
  customer: string;
  customerPhone: string;
  adminUrl: string;
  adminUsername: string;
  adminPassword: string;
  status: 'planning' | 'in-progress' | 'completed' | 'on-hold' | 'pending-acceptance';
  description: string;
  createdAt: string;
  price: number;
}

interface ProjectListProps {
  projects: Project[];
  onEdit: (project: Project) => void;
  onDelete: (id: string) => void;
  onView: (project: Project) => void;
}

export function ProjectList({ projects, onEdit, onDelete, onView }: ProjectListProps) {
  const [copiedField, setCopiedField] = useState<string | null>(null);
  const [activeCard, setActiveCard] = useState<string | null>(null);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [viewDetailsId, setViewDetailsId] = useState<string | null>(null);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Sort projects by status order: planning -> in-progress -> pending-acceptance -> on-hold -> completed
  const statusOrder: { [key in Project['status']]: number } = {
    'planning': 1,
    'in-progress': 2,
    'pending-acceptance': 3,
    'on-hold': 4,
    'completed': 5
  };

  const sortedProjects = [...projects].sort((a, b) => {
    const orderA = statusOrder[a.status];
    const orderB = statusOrder[b.status];
    
    // Sort by status order first
    if (orderA !== orderB) {
      return orderA - orderB;
    }
    
    // If same status, sort by created date (newest first)
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
  });

  // Pagination
  const paginatedProjects = sortedProjects.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);
  const paginatedIds = paginatedProjects.map(p => p.id);
  
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

  const getStatusBadge = (status: Project['status']) => {
    switch (status) {
      case 'planning':
        return 'bg-gray-100 text-gray-700 border-gray-200';
      case 'in-progress':
        return 'bg-blue-100 text-blue-600 border-blue-200';
      case 'completed':
        return 'bg-green-100 text-green-700 border-green-200';
      case 'on-hold':
        return 'bg-gray-100 text-gray-600 border-gray-200';
      case 'pending-acceptance':
        return 'bg-purple-100 text-purple-600 border-purple-200';
    }
  };

  const getStatusText = (status: Project['status']) => {
    switch (status) {
      case 'planning':
        return 'Lên Kế Hoạch';
      case 'in-progress':
        return 'Đang Thực Hiện';
      case 'completed':
        return 'Hoàn Thành';
      case 'on-hold':
        return 'Tạm Dừng';
      case 'pending-acceptance':
        return 'Chờ Nghiệm Thu';
    }
  };

  const getStatusIcon = (status: Project['status']) => {
    switch (status) {
      case 'planning':
        return <Clock className="w-4 h-4" />;
      case 'in-progress':
        return <AlertCircle className="w-4 h-4" />;
      case 'completed':
        return <CheckCircle className="w-4 h-4" />;
      case 'on-hold':
        return <Clock className="w-4 h-4" />;
      case 'pending-acceptance':
        return <Clock className="w-4 h-4" />;
    }
  };

  const handleCopy = (text: string, fieldId: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(fieldId);
    setTimeout(() => setCopiedField(null), 2000);
  };

  if (projects.length === 0) {
    return (
      <div className="mt-8 bg-white rounded-lg shadow-sm border border-gray-200 p-8 sm:p-12 text-center">
        <FolderKanban className="w-12 h-12 sm:w-16 sm:h-16 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2">
          Chưa có project nào
        </h3>
        <p className="text-sm sm:text-base text-gray-600">
          Bắt đầu bằng cách thêm project đầu tiên của bạn
        </p>
      </div>
    );
  }

  return (
    <div className="mt-6 sm:mt-8 space-y-4 sm:space-y-6">
      {/* Details Modal */}
      {viewDetailsId && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4" onClick={() => setViewDetailsId(null)}>
          <div className="bg-white rounded-lg shadow-xl w-full max-w-3xl max-h-[90vh] flex flex-col" onClick={(e) => e.stopPropagation()}>
            {(() => {
              const project = projects.find(p => p.id === viewDetailsId);
              if (!project) return null;
              
              return (
                <>
                  {/* Header - Fixed */}
                  <div className="bg-gradient-to-r from-[#4DBFAD] to-[#2563B4] text-white px-4 sm:px-6 py-3 sm:py-4 flex items-center justify-between flex-shrink-0 rounded-t-lg">
                    <div className="flex items-center gap-2 sm:gap-3">
                      <FolderKanban className="w-5 h-5 sm:w-6 sm:h-6" />
                      <h3 className="text-lg sm:text-xl font-bold">Chi Tiết Project</h3>
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
                    {/* Status & Price Badge */}
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                      <span className={`inline-flex items-center gap-1.5 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm font-medium border ${getStatusBadge(project.status)}`}>
                        {getStatusIcon(project.status)}
                        {getStatusText(project.status)}
                      </span>
                      <div className="flex items-center gap-2 text-xl sm:text-2xl font-bold text-[#2563B4]">
                        <Banknote className="w-5 h-5 sm:w-6 sm:h-6" />
                        {formatFullCurrency(project.price)}
                      </div>
                    </div>

                    {/* Project Info */}
                    <div className="bg-gradient-to-br from-[#4DBFAD]/10 to-[#2563B4]/10 rounded-lg p-4 sm:p-5 space-y-4">
                      <div>
                        <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Tên Project</label>
                        <div className="mt-1 text-base sm:text-lg font-bold text-gray-900">{project.name}</div>
                      </div>

                      {project.description && (
                        <div>
                          <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Mô Tả</label>
                          <div className="mt-2 p-3 sm:p-4 bg-white/80 rounded-lg text-xs sm:text-sm text-gray-700 border border-gray-200">
                            {project.description}
                          </div>
                        </div>
                      )}

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 pt-3 sm:pt-4 border-t border-gray-200">
                        <div>
                          <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider flex items-center gap-1">
                            <User className="w-3.5 h-3.5" />
                            Khách Hàng
                          </label>
                          <div className="mt-1 text-sm sm:text-base font-semibold text-gray-900">{project.customer}</div>
                        </div>

                        <div>
                          <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider flex items-center gap-1">
                            <Phone className="w-3.5 h-3.5" />
                            Số Điện Thoại
                          </label>
                          <div className="mt-1 text-sm sm:text-base font-semibold text-gray-900">{project.customerPhone}</div>
                        </div>
                      </div>

                      <div>
                        <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider flex items-center gap-1">
                          <Calendar className="w-3.5 h-3.5" />
                          Ngày Tạo
                        </label>
                        <div className="mt-1 text-sm sm:text-base font-semibold text-gray-900">{isoToVNDate(project.createdAt)}</div>
                      </div>
                    </div>

                    {/* Admin Info */}
                    {project.adminUrl && (
                      <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg p-4 sm:p-5 space-y-4 border border-gray-200">
                        <h4 className="text-sm font-bold text-gray-700 flex items-center gap-2">
                          <Lock className="w-4 h-4" />
                          Thông Tin Quản Trị
                        </h4>

                        {/* URL */}
                        <div>
                          <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">URL</label>
                          <div className="mt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
                            <a
                              href={project.adminUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex-1 flex items-center gap-2 text-xs sm:text-sm text-[#2563B4] hover:text-[#4DBFAD] font-medium bg-white px-3 sm:px-4 py-2 sm:py-3 rounded-lg border-2 border-gray-200 transition-colors"
                            >
                              <ExternalLink className="w-4 h-4 flex-shrink-0" />
                              <span className="truncate">{project.adminUrl}</span>
                            </a>
                            <button
                              onClick={() => handleCopy(project.adminUrl, `${project.id}-url-modal`)}
                              className="sm:flex-none px-3 py-2 sm:p-3 text-gray-600 bg-white hover:bg-gray-100 border-2 border-gray-200 rounded-lg transition-colors flex items-center justify-center gap-2"
                              title="Sao chép"
                            >
                              {copiedField === `${project.id}-url-modal` ? (
                                <>
                                  <CheckCircle className="w-4 h-4 text-green-600" />
                                  <span className="sm:hidden text-sm text-green-600">Đã sao chép</span>
                                </>
                              ) : (
                                <>
                                  <Copy className="w-4 h-4" />
                                  <span className="sm:hidden text-sm">Sao chép</span>
                                </>
                              )}
                            </button>
                          </div>
                        </div>

                        {/* Username */}
                        {project.adminUsername && (
                          <div>
                            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Tài Khoản</label>
                            <div className="mt-2 flex items-center gap-2 bg-white rounded-lg px-3 sm:px-4 py-2 sm:py-3 border-2 border-gray-200">
                              <span className="flex-1 text-xs sm:text-sm font-mono text-gray-900 break-all">{project.adminUsername}</span>
                              <button
                                onClick={() => handleCopy(project.adminUsername, `${project.id}-username-modal`)}
                                className="p-2 text-gray-600 hover:text-[#2563B4] transition-colors flex-shrink-0"
                                title="Sao chép"
                              >
                                {copiedField === `${project.id}-username-modal` ? (
                                  <CheckCircle className="w-4 h-4 text-green-600" />
                                ) : (
                                  <Copy className="w-4 h-4" />
                                )}
                              </button>
                            </div>
                          </div>
                        )}

                        {/* Password */}
                        {project.adminPassword && (
                          <div>
                            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Mật Khẩu</label>
                            <div className="mt-2 flex items-center gap-2 bg-white rounded-lg px-3 sm:px-4 py-2 sm:py-3 border-2 border-gray-200">
                              <span className="flex-1 text-xs sm:text-sm font-mono text-gray-900 break-all">{project.adminPassword}</span>
                              <button
                                onClick={() => handleCopy(project.adminPassword, `${project.id}-password-modal`)}
                                className="p-2 text-gray-600 hover:text-[#2563B4] transition-colors flex-shrink-0"
                                title="Sao chép"
                              >
                                {copiedField === `${project.id}-password-modal` ? (
                                  <CheckCircle className="w-4 h-4 text-green-600" />
                                ) : (
                                  <Copy className="w-4 h-4" />
                                )}
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                    )}

                    {/* Action Buttons */}
                    <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 pt-4 border-t border-gray-200">
                      <button
                        onClick={() => {
                          onEdit(project);
                          setViewDetailsId(null);
                        }}
                        className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 sm:py-3 text-sm sm:text-base text-white bg-gradient-to-r from-[#4DBFAD] to-[#2563B4] hover:opacity-90 rounded-lg transition-opacity font-medium"
                      >
                        <Edit2 className="w-4 h-4" />
                        Chỉnh Sửa
                      </button>
                      <button
                        onClick={() => {
                          onDelete(project.id);
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
              Đã chọn {selectedIds.length} project
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
                if (confirm(`Bạn có chắc muốn xóa ${selectedIds.length} project đã chọn?`)) {
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
        {paginatedProjects.map((project) => {
          const isSelected = selectedIds.includes(project.id);
          
          return (
            <div
              key={project.id}
              className={`bg-white rounded-lg border-2 transition-all ${
                isSelected 
                  ? 'border-[#4DBFAD] shadow-lg' 
                  : project.status === 'completed'
                  ? 'border-green-200 bg-green-50/30'
                  : project.status === 'in-progress'
                  ? 'border-blue-200 bg-blue-50/30'
                  : project.status === 'pending-acceptance'
                  ? 'border-purple-200 bg-purple-50/30'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              {/* Card Header */}
              <div className="p-4 border-b border-gray-100">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-3 flex-1 min-w-0">
                    <Checkbox
                      checked={isSelected}
                      onChange={(checked) => handleSelectOne(project.id, checked)}
                    />
                    <div className="flex-1 min-w-0">
                      <h3 className="font-bold text-gray-900 text-base mb-1 break-words">
                        {project.name}
                      </h3>
                      {project.description && (
                        <p className="text-xs text-gray-600 line-clamp-2 mb-2">
                          {project.description}
                        </p>
                      )}
                    </div>
                  </div>
                  
                  {/* Status Badge */}
                  <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium border flex-shrink-0 ${getStatusBadge(project.status)}`}>
                    {getStatusIcon(project.status)}
                    <span className="hidden sm:inline">{getStatusText(project.status)}</span>
                  </span>
                </div>
              </div>

              {/* Card Body */}
              <div className="p-4 space-y-3">
                {/* Customer Info */}
                <div className="bg-gray-50 rounded-lg p-3 space-y-2">
                  <div className="flex items-center gap-2 text-sm">
                    <User className="w-4 h-4 text-gray-400 flex-shrink-0" />
                    <span className="font-medium text-gray-900">{project.customer}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Phone className="w-4 h-4 text-gray-400 flex-shrink-0" />
                    <span className="text-gray-700">{project.customerPhone}</span>
                  </div>
                </div>

                {/* Price & Date */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5 text-base font-bold text-[#2563B4]">
                    <Banknote className="w-4 h-4" />
                    {formatCurrency(project.price)}
                  </div>
                  <div className="flex items-center gap-1.5 text-xs text-gray-600">
                    <Calendar className="w-3.5 h-3.5" />
                    {isoToVNDate(project.createdAt)}
                  </div>
                </div>

                {/* Admin URL */}
                {project.adminUrl && (
                  <div className="text-xs text-gray-500 bg-blue-50 border border-blue-100 rounded p-2 flex items-center gap-1.5">
                    <ExternalLink className="w-3 h-3 flex-shrink-0" />
                    <span className="truncate">{project.adminUrl}</span>
                  </div>
                )}
              </div>

              {/* Card Footer - Actions */}
              <div className="p-3 bg-gray-50 border-t border-gray-100 flex gap-2">
                <button
                  onClick={() => setViewDetailsId(project.id)}
                  className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 text-sm font-medium text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors"
                >
                  <Eye className="w-4 h-4" />
                  Chi tiết
                </button>
                <button
                  onClick={() => onEdit(project)}
                  className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 text-sm font-medium text-white bg-gradient-to-r from-[#4DBFAD] to-[#2563B4] hover:opacity-90 rounded-lg transition-opacity"
                >
                  <Edit2 className="w-4 h-4" />
                  Sửa
                </button>
                <button
                  onClick={() => onDelete(project.id)}
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
                  Tên Project
                </th>
                <th className="px-4 lg:px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                  Khách Hàng
                </th>
                <th className="px-4 lg:px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                  Giá Trị
                </th>
                <th className="px-4 lg:px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                  Ngày Tạo
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
              {paginatedProjects.map((project) => {
                const isSelected = selectedIds.includes(project.id);
                
                return (
                  <tr
                    key={project.id}
                    className={`hover:bg-gray-50 transition-colors ${
                      isSelected ? 'bg-blue-50' :
                      project.status === 'completed' 
                        ? 'bg-green-50/30' 
                        : project.status === 'in-progress'
                        ? 'bg-yellow-50/30'
                        : project.status === 'pending-acceptance'
                        ? 'bg-orange-50/30'
                        : ''
                    }`}
                    onMouseEnter={() => setActiveCard(project.id)}
                    onMouseLeave={() => setActiveCard(null)}
                  >
                    {/* Checkbox */}
                    <td className="px-4 lg:px-6 py-4">
                      <Checkbox
                        checked={isSelected}
                        onChange={(checked) => handleSelectOne(project.id, checked)}
                        onClick={(e) => e.stopPropagation()}
                      />
                    </td>

                    {/* Tên Project */}
                    <td className="px-4 lg:px-6 py-4">
                      <div>
                        <div className="font-semibold text-gray-900 mb-1">
                          {project.name}
                        </div>
                        {project.description && (
                          <div className="text-xs text-gray-500 italic line-clamp-1">
                            {project.description}
                          </div>
                        )}
                        {project.adminUrl && (
                          <div className="text-xs text-gray-400 mt-1 flex items-center gap-1">
                            <ExternalLink className="w-3 h-3" />
                            <span className="truncate max-w-[200px]">{project.adminUrl}</span>
                          </div>
                        )}
                      </div>
                    </td>

                    {/* Khách Hàng */}
                    <td className="px-4 lg:px-6 py-4">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <User className="w-4 h-4 text-gray-400 flex-shrink-0" />
                          <span className="text-sm text-gray-900 font-medium">
                            {project.customer}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Phone className="w-3.5 h-3.5 text-gray-400 flex-shrink-0" />
                          <span className="text-xs text-gray-600">
                            {project.customerPhone}
                          </span>
                        </div>
                      </div>
                    </td>

                    {/* Giá Trị */}
                    <td className="px-4 lg:px-6 py-4">
                      <div className="flex items-center gap-2">
                        <Banknote className="w-4 h-4 text-[#4DBFAD]" />
                        <span className="text-sm font-bold text-[#2563B4]">
                          {formatCurrency(project.price)}
                        </span>
                      </div>
                    </td>

                    {/* Ngày Tạo */}
                    <td className="px-4 lg:px-6 py-4">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-gray-400" />
                        <span className="text-sm text-gray-700">
                          {isoToVNDate(project.createdAt)}
                        </span>
                      </div>
                    </td>

                    {/* Trạng Thái */}
                    <td className="px-4 lg:px-6 py-4 text-center">
                      <span
                          className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium border ${getStatusBadge(
                            project.status
                          )}`}
                        >
                          {getStatusIcon(project.status)}
                          {getStatusText(project.status)}
                        </span>
                    </td>

                    {/* Thao Tác - Dropdown */}
                    <td className="px-4 lg:px-6 py-4">
                      <div className="flex items-center justify-center relative">
                        <button
                          onClick={(e) => {
                            setOpenDropdown(openDropdown === project.id ? null : project.id);
                          }}
                          className="p-2 text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                          title="Thao tác"
                          id={`dropdown-trigger-${project.id}`}
                        >
                          <MoreVertical className="w-4 h-4" />
                        </button>

                        {/* Dropdown Menu */}
                        {openDropdown === project.id && (() => {
                          const trigger = document.getElementById(`dropdown-trigger-${project.id}`);
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
                                    setViewDetailsId(project.id);
                                    setOpenDropdown(null);
                                  }}
                                  className="w-full flex items-center gap-3 px-4 py-2.5 text-left text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                                >
                                  <Eye className="w-4 h-4 text-[#2563B4]" />
                                  <span className="font-medium">Xem Chi Tiết</span>
                                </button>
                                
                                <button
                                  onClick={() => {
                                    onEdit(project);
                                    setOpenDropdown(null);
                                  }}
                                  className="w-full flex items-center gap-3 px-4 py-2.5 text-left text-sm text-gray-700 hover:bg-blue-50 transition-colors"
                                >
                                  <Edit2 className="w-4 h-4 text-blue-600" />
                                  <span className="font-medium">Chỉnh Sửa</span>
                                </button>
                                
                                <div className="my-1 border-t border-gray-200" />
                                
                                <button
                                  onClick={() => {
                                    onDelete(project.id);
                                    setOpenDropdown(null);
                                  }}
                                  className="w-full flex items-center gap-3 px-4 py-2.5 text-left text-sm text-red-600 hover:bg-red-50 transition-colors"
                                >
                                  <Trash2 className="w-4 h-4" />
                                  <span className="font-medium">Xóa Project</span>
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
          totalItems={projects.length}
          itemsPerPage={itemsPerPage}
          currentPage={currentPage}
          onPageChange={setCurrentPage}
        />
      </div>

      {/* Mobile Pagination */}
      <div className="block md:hidden">
        <Pagination
          totalItems={projects.length}
          itemsPerPage={itemsPerPage}
          currentPage={currentPage}
          onPageChange={setCurrentPage}
        />
      </div>
    </div>
  );
}
