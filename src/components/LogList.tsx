import { useState, useEffect } from 'react';
import { Log } from '../types/log';
import { logApi, hostingApi, projectApi } from '../utils/api';
import { Checkbox } from './Checkbox';
import { DataDisplay } from './DataDisplay';
import { DataComparison } from './DataComparison';
import { Search, Trash2, RotateCcw, Eye, X, FileText, Server, Folder, Lock, Code, AlertCircle, CheckCircle } from 'lucide-react';
import { toast } from 'sonner@2.0.3';
import { LoadingDuck } from './LoadingDuck';

export function LogList() {
  const [logs, setLogs] = useState<Log[]>([]);
  const [filteredLogs, setFilteredLogs] = useState<Log[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedModule, setSelectedModule] = useState<string>('all');
  const [selectedAction, setSelectedAction] = useState<string>('all');
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [currentPage, setCurrentPage] = useState(1);
  const [viewingLog, setViewingLog] = useState<Log | null>(null);
  const itemsPerPage = 10;

  useEffect(() => {
    loadLogs();
    
    // Auto-refresh logs every 10 seconds when the tab is active (silent refresh)
    const intervalId = setInterval(() => {
      loadLogsQuietly();
    }, 10000);
    
    return () => clearInterval(intervalId);
  }, []);

  useEffect(() => {
    filterLogs();
  }, [logs, searchTerm, selectedModule, selectedAction]);

  const loadLogs = async () => {
    try {
      setLoading(true);
      const data = await logApi.getAll();
      // Sort logs by created_at descending (newest first)
      const sortedData = (data || []).sort((a, b) => 
        new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      );
      setLogs(sortedData);
    } catch (error) {
      console.error('Error loading logs:', error);
      setLogs([]); // Set empty array on error
      toast.error('Không thể tải logs. Vui lòng kiểm tra kết nối backend và database.');
    } finally {
      setLoading(false);
    }
  };

  // Silent refresh without loading spinner
  const loadLogsQuietly = async () => {
    try {
      const data = await logApi.getAll();
      // Sort logs by created_at descending (newest first)
      const sortedData = (data || []).sort((a, b) => 
        new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      );
      setLogs(sortedData);
    } catch (error) {
      console.error('Error loading logs quietly:', error);
    }
  };

  const filterLogs = () => {
    let filtered = [...logs];

    if (searchTerm) {
      filtered = filtered.filter(log =>
        log.item_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        log.user.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (selectedModule !== 'all') {
      filtered = filtered.filter(log => log.module_name === selectedModule);
    }

    if (selectedAction !== 'all') {
      filtered = filtered.filter(log => log.action_type === selectedAction);
    }

    setFilteredLogs(filtered);
    setCurrentPage(1);
  };

  const handleRestore = async (log: Log) => {
    if (log.action_type !== 'delete') {
      toast.error('Chỉ có thể restore các item đã bị xóa', {
        description: 'Vui lòng chọn một log với hành động "Xóa"'
      });
      return;
    }

    const restorePromise = async () => {
      if (log.module_name === 'hosting') {
        await hostingApi.create(log.old_data);
        return 'Đã khôi phục hosting thành công!';
      } else if (log.module_name === 'project') {
        await projectApi.create(log.old_data);
        return 'Đã khôi phục project thành công!';
      }
      throw new Error('Module không được hỗ trợ');
    };

    toast.promise(restorePromise(), {
      loading: `Đang khôi phục ${log.item_name}...`,
      success: (message) => ({
        title: message,
        description: `${getModuleName(log.module_name)}: ${log.item_name}`
      }),
      error: (err) => ({
        title: 'Không thể khôi phục item này',
        description: err.message || 'Vui lòng thử lại sau'
      })
    });

    try {
      await restorePromise();
      await loadLogs();
    } catch (error) {
      console.error('Error restoring:', error);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Bạn có chắc chắn muốn xóa log này?')) return;

    const log = logs.find(l => l.id === id);
    const logName = log ? log.item_name : 'log';

    const deletePromise = async () => {
      await logApi.delete(id);
      await loadLogs();
      return logName;
    };

    toast.promise(deletePromise(), {
      loading: 'Đang xóa log...',
      success: (name) => ({
        title: 'Đã xóa log thành công!',
        description: `Log của "${name}" đã được xóa khỏi hệ thống`
      }),
      error: {
        title: 'Không thể xóa log này',
        description: 'Vui lòng thử lại sau'
      }
    });
  };

  const handleDeleteSelected = async () => {
    if (selectedIds.size === 0) return;
    
    const count = selectedIds.size;
    if (!confirm(`Bạn có chắc chắn muốn xóa ${count} log đã chọn?`)) return;

    const deletePromise = async () => {
      await logApi.deleteMany(Array.from(selectedIds));
      setSelectedIds(new Set());
      await loadLogs();
      return count;
    };

    toast.promise(deletePromise(), {
      loading: `Đang xóa ${count} log...`,
      success: (count) => ({
        title: `Đã xóa ${count} log thành công!`,
        description: 'Các log đã được xóa khỏi hệ thống'
      }),
      error: {
        title: 'Không thể xóa các log đã chọn',
        description: 'Một số log có thể đã bị lỗi. Vui lòng thử lại'
      }
    });
  };

  const handleSelectOne = (id: string, checked: boolean) => {
    const newSelected = new Set(selectedIds);
    if (checked) {
      newSelected.add(id);
    } else {
      newSelected.delete(id);
    }
    setSelectedIds(newSelected);
  };

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      const pageIds = currentLogs.map(log => log.id);
      setSelectedIds(new Set(pageIds));
    } else {
      setSelectedIds(new Set());
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    return `${day}/${month}/${year} ${hours}:${minutes}`;
  };

  const getActionBadge = (action: string) => {
    const badges = {
      create: 'bg-green-100 text-green-700 border-green-200',
      update: 'bg-blue-100 text-blue-700 border-blue-200',
      delete: 'bg-red-100 text-red-700 border-red-200',
    };
    return badges[action as keyof typeof badges] || 'bg-gray-100 text-gray-700 border-gray-200';
  };

  const getModuleIcon = (module: string) => {
    const icons = {
      hosting: <Server className="w-4 h-4" />,
      project: <Folder className="w-4 h-4" />,
      password: <Lock className="w-4 h-4" />,
      codex: <Code className="w-4 h-4" />,
    };
    return icons[module as keyof typeof icons] || <FileText className="w-4 h-4" />;
  };

  const getModuleName = (module: string) => {
    const names = {
      hosting: 'Hosting',
      project: 'Project',
      password: 'Password',
      codex: 'CodeX',
    };
    return names[module as keyof typeof names] || module;
  };

  const getActionName = (action: string) => {
    const names = {
      create: 'Tạo mới',
      update: 'Cập nhật',
      delete: 'Xóa',
    };
    return names[action as keyof typeof names] || action;
  };

  // Pagination
  const totalPages = Math.ceil(filteredLogs.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentLogs = filteredLogs.slice(startIndex, endIndex);

  const allPageSelected = currentLogs.length > 0 && currentLogs.every(log => selectedIds.has(log.id));
  const somePageSelected = currentLogs.some(log => selectedIds.has(log.id)) && !allPageSelected;

  if (loading) {
    return <LoadingDuck />;
  }

  // Show empty state if no logs
  if (logs.length === 0 && !loading) {
    return (
      <div className="space-y-6">
        {/* Empty State */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 sm:p-12">
          <div className="text-center max-w-md mx-auto">
            <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br from-teal-100 to-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <FileText className="w-6 h-6 sm:w-8 sm:h-8 text-teal-600" />
            </div>
            <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2">
              Chưa có logs nào
            </h3>
            <p className="text-sm sm:text-base text-gray-600 mb-6">
              Logs sẽ tự động được ghi lại khi bạn thực hiện các thao tác CREATE, UPDATE hoặc DELETE trên các module Hosting, Project, Password và CodeX.
            </p>
            <button
              onClick={loadLogs}
              className="px-6 py-2.5 bg-gradient-to-r from-teal-600 to-blue-600 text-white rounded-lg hover:shadow-lg transition-all duration-200 font-medium text-sm"
            >
              Làm mới
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Logs</h1>
          <p className="text-sm sm:text-base text-gray-600 mt-1">Theo dõi các hành động và restore dữ liệu đã xóa</p>
        </div>
      </div>

      {/* Filters & Search Bar */}
      <div className="bg-white rounded-lg sm:rounded-xl shadow-sm border-2 border-gray-200 p-4 sm:p-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          {/* Search */}
          <div className="sm:col-span-2 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 sm:w-5 sm:h-5" />
            <input
              type="text"
              placeholder="Tìm kiếm theo tên item hoặc user..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 sm:pl-10 pr-4 py-2 sm:py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent text-sm"
            />
          </div>

          {/* Module Filter */}
          <select
            value={selectedModule}
            onChange={(e) => setSelectedModule(e.target.value)}
            className="px-3 sm:px-4 py-2 sm:py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent text-sm"
          >
            <option value="all">Tất cả Module</option>
            <option value="hosting">Hosting</option>
            <option value="project">Project</option>
            <option value="password">Password</option>
            <option value="codex">CodeX</option>
          </select>

          {/* Action Filter */}
          <select
            value={selectedAction}
            onChange={(e) => setSelectedAction(e.target.value)}
            className="px-3 sm:px-4 py-2 sm:py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent text-sm"
          >
            <option value="all">Tất cả Hành động</option>
            <option value="create">Tạo mới</option>
            <option value="update">Cập nhật</option>
            <option value="delete">Xóa</option>
          </select>
        </div>
      </div>

      {/* Selection Action Bar */}
      {selectedIds.size > 0 && (
        <div className="bg-teal-50 border-2 border-teal-200 rounded-lg p-3 sm:p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-teal-600 flex-shrink-0" />
            <span className="text-sm sm:text-base text-teal-700 font-medium">
              Đã chọn {selectedIds.size} log
            </span>
          </div>
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button
              onClick={() => setSelectedIds(new Set())}
              className="flex-1 sm:flex-none px-3 sm:px-4 py-2 bg-white border border-teal-300 text-teal-700 rounded-lg hover:bg-teal-50 transition-colors text-sm font-medium"
            >
              Bỏ chọn
            </button>
            <button
              onClick={handleDeleteSelected}
              className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-3 sm:px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm font-medium"
            >
              <Trash2 className="w-4 h-4" />
              Xóa {selectedIds.size}
            </button>
          </div>
        </div>
      )}

      {/* Mobile Card View */}
      <div className="block md:hidden space-y-3">
        {currentLogs.length === 0 ? (
          <div className="bg-white rounded-lg border-2 border-gray-200 p-8 text-center">
            <AlertCircle className="w-12 h-12 text-gray-400 mx-auto mb-3" />
            <p className="text-sm text-gray-500">Không có log nào</p>
          </div>
        ) : (
          currentLogs.map((log) => {
            const isSelected = selectedIds.has(log.id);
            return (
              <div
                key={log.id}
                className={`bg-white rounded-lg border-2 transition-all ${
                  isSelected 
                    ? 'border-teal-500 shadow-lg' 
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                {/* Card Header */}
                <div className="p-3 border-b border-gray-100">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-start gap-2 flex-1 min-w-0">
                      <Checkbox
                        checked={isSelected}
                        onChange={(checked) => handleSelectOne(log.id, checked)}
                      />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap mb-2">
                          <div className="flex items-center gap-1.5 text-xs font-medium text-gray-700 bg-gray-100 px-2 py-1 rounded">
                            {getModuleIcon(log.module_name)}
                            {getModuleName(log.module_name)}
                          </div>
                          <span className={`px-2 py-1 rounded text-xs font-medium border ${getActionBadge(log.action_type)}`}>
                            {getActionName(log.action_type)}
                          </span>
                        </div>
                        <h3 className="font-semibold text-gray-900 text-sm mb-1">
                          {log.item_name}
                        </h3>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Card Body */}
                <div className="p-3 space-y-2 text-sm">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-500 text-xs">User:</span>
                    <span className="text-gray-900 font-medium">{log.user}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-500 text-xs">Thời gian:</span>
                    <span className="text-gray-700 text-xs">{formatDate(log.created_at)}</span>
                  </div>
                </div>

                {/* Card Footer - Actions */}
                <div className="p-3 bg-gray-50 border-t border-gray-100 flex gap-2">
                  <button
                    onClick={() => setViewingLog(log)}
                    className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 text-sm font-medium text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors"
                  >
                    <Eye className="w-4 h-4" />
                    Chi tiết
                  </button>
                  {log.action_type === 'delete' && (
                    <button
                      onClick={() => handleRestore(log)}
                      className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 text-sm font-medium text-green-600 bg-green-50 hover:bg-green-100 rounded-lg transition-colors"
                    >
                      <RotateCcw className="w-4 h-4" />
                      Restore
                    </button>
                  )}
                  <button
                    onClick={() => handleDelete(log.id)}
                    className="px-3 py-2 text-red-600 bg-red-50 hover:bg-red-100 rounded-lg transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Desktop Table View */}
      <div className="hidden md:block bg-white rounded-xl shadow-sm border-2 border-gray-200 overflow-hidden">
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
                  Module
                </th>
                <th className="px-4 lg:px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                  Hành động
                </th>
                <th className="px-4 lg:px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                  Item
                </th>
                <th className="px-4 lg:px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                  User
                </th>
                <th className="px-4 lg:px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                  Thời gian
                </th>
                <th className="px-4 lg:px-6 py-4 text-center text-xs font-bold text-gray-700 uppercase tracking-wider w-32">
                  Thao tác
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {currentLogs.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center">
                    <AlertCircle className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                    <p className="text-gray-500">Không có log nào</p>
                  </td>
                </tr>
              ) : (
                currentLogs.map((log) => {
                  const isSelected = selectedIds.has(log.id);
                  return (
                    <tr
                      key={log.id}
                      className={`hover:bg-gray-50 transition-colors ${
                        isSelected ? 'bg-teal-50' : ''
                      }`}
                    >
                      {/* Checkbox */}
                      <td className="px-4 lg:px-6 py-4">
                        <Checkbox
                          checked={isSelected}
                          onChange={(checked) => handleSelectOne(log.id, checked)}
                        />
                      </td>

                      {/* Module */}
                      <td className="px-4 lg:px-6 py-4">
                        <div className="flex items-center gap-2">
                          <span className="text-gray-500">
                            {getModuleIcon(log.module_name)}
                          </span>
                          <span className="font-medium text-gray-900 text-sm">
                            {getModuleName(log.module_name)}
                          </span>
                        </div>
                      </td>

                      {/* Action */}
                      <td className="px-4 lg:px-6 py-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getActionBadge(log.action_type)}`}>
                          {getActionName(log.action_type)}
                        </span>
                      </td>

                      {/* Item Name */}
                      <td className="px-4 lg:px-6 py-4">
                        <span className="text-gray-900 text-sm">{log.item_name}</span>
                      </td>

                      {/* User */}
                      <td className="px-4 lg:px-6 py-4">
                        <span className="text-gray-600 text-sm">{log.user}</span>
                      </td>

                      {/* Time */}
                      <td className="px-4 lg:px-6 py-4">
                        <span className="text-gray-600 text-sm">{formatDate(log.created_at)}</span>
                      </td>

                      {/* Actions */}
                      <td className="px-4 lg:px-6 py-4">
                        <div className="flex items-center justify-center gap-2">
                          <button
                            onClick={() => setViewingLog(log)}
                            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                            title="Xem chi tiết"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          {log.action_type === 'delete' && (
                            <button
                              onClick={() => handleRestore(log)}
                              className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                              title="Restore"
                            >
                              <RotateCcw className="w-4 h-4" />
                            </button>
                          )}
                          <button
                            onClick={() => handleDelete(log.id)}
                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                            title="Xóa log"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="px-4 sm:px-6 py-3 sm:py-4 border-t border-gray-200 flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="text-xs sm:text-sm text-gray-600">
              Hiển thị {startIndex + 1} - {Math.min(endIndex, filteredLogs.length)} / {filteredLogs.length} logs
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="px-3 sm:px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-sm"
              >
                Trước
              </button>
              <div className="flex items-center gap-1">
                {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                  let page;
                  if (totalPages <= 5) {
                    page = i + 1;
                  } else if (currentPage <= 3) {
                    page = i + 1;
                  } else if (currentPage >= totalPages - 2) {
                    page = totalPages - 4 + i;
                  } else {
                    page = currentPage - 2 + i;
                  }
                  return (
                    <button
                      key={page}
                      onClick={() => setCurrentPage(page)}
                      className={`w-8 h-8 sm:w-10 sm:h-10 rounded-lg transition-colors text-sm ${
                        currentPage === page
                          ? 'bg-teal-600 text-white'
                          : 'hover:bg-gray-100 text-gray-700'
                      }`}
                    >
                      {page}
                    </button>
                  );
                })}
              </div>
              <button
                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="px-3 sm:px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-sm"
              >
                Sau
              </button>
            </div>
          </div>
        )}
      </div>

      {/* View Log Detail Modal */}
      {viewingLog && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg sm:rounded-xl shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col">
            {/* Header */}
            <div className="flex items-center justify-between p-4 sm:p-6 border-b border-gray-200 bg-gradient-to-r from-teal-50 to-blue-50">
              <h2 className="text-lg sm:text-2xl font-bold text-gray-900">Chi tiết Log</h2>
              <button
                onClick={() => setViewingLog(null)}
                className="p-1.5 sm:p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="w-5 h-5 sm:w-6 sm:h-6" />
              </button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 sm:space-y-6">
              {/* Basic Info */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                <div>
                  <label className="text-xs sm:text-sm font-medium text-gray-600">Module</label>
                  <div className="flex items-center gap-2 mt-1">
                    {getModuleIcon(viewingLog.module_name)}
                    <span className="text-sm sm:text-base text-gray-900">{getModuleName(viewingLog.module_name)}</span>
                  </div>
                </div>
                <div>
                  <label className="text-xs sm:text-sm font-medium text-gray-600">Hành động</label>
                  <div className="mt-1">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getActionBadge(viewingLog.action_type)}`}>
                      {getActionName(viewingLog.action_type)}
                    </span>
                  </div>
                </div>
                <div>
                  <label className="text-xs sm:text-sm font-medium text-gray-600">Item</label>
                  <p className="text-sm sm:text-base text-gray-900 mt-1">{viewingLog.item_name}</p>
                </div>
                <div>
                  <label className="text-xs sm:text-sm font-medium text-gray-600">User</label>
                  <p className="text-sm sm:text-base text-gray-900 mt-1">{viewingLog.user}</p>
                </div>
                <div className="sm:col-span-2">
                  <label className="text-xs sm:text-sm font-medium text-gray-600">Thời gian</label>
                  <p className="text-sm sm:text-base text-gray-900 mt-1">{formatDate(viewingLog.created_at)}</p>
                </div>
              </div>

              {/* Data Changes */}
              {viewingLog.action_type === 'delete' && viewingLog.old_data && (
                <div>
                  <label className="text-xs sm:text-sm font-medium text-gray-600 mb-3 block">Dữ liệu đã xóa</label>
                  <DataDisplay data={viewingLog.old_data} moduleName={viewingLog.module_name} />
                </div>
              )}

              {viewingLog.action_type === 'create' && viewingLog.new_data && (
                <div>
                  <label className="text-xs sm:text-sm font-medium text-gray-600 mb-3 block">Dữ liệu mới</label>
                  <DataDisplay data={viewingLog.new_data} moduleName={viewingLog.module_name} />
                </div>
              )}

              {viewingLog.action_type === 'update' && (
                <div>
                  <label className="text-xs sm:text-sm font-medium text-gray-600 mb-3 block">Thay đổi</label>
                  <DataComparison 
                    oldData={viewingLog.old_data} 
                    newData={viewingLog.new_data} 
                    moduleName={viewingLog.module_name} 
                  />
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-end gap-2 sm:gap-3 p-4 sm:p-6 border-t border-gray-200 bg-gray-50">
              {viewingLog.action_type === 'delete' && (
                <button
                  onClick={() => {
                    handleRestore(viewingLog);
                    setViewingLog(null);
                  }}
                  className="w-full sm:w-auto px-4 sm:px-6 py-2 sm:py-2.5 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center gap-2 text-sm font-medium"
                >
                  <RotateCcw className="w-4 h-4" />
                  Restore
                </button>
              )}
              <button
                onClick={() => setViewingLog(null)}
                className="w-full sm:w-auto px-4 sm:px-6 py-2 sm:py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium"
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}