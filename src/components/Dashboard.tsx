import { useState, useEffect } from 'react';
import { Server, FolderKanban, Lock, Code, Activity, AlertCircle, CheckCircle, Clock, Calendar, Plus, FileText, Maximize2, ChevronRight, Edit2, X, Eye } from 'lucide-react';
import { Hosting } from '../App';
import { Project } from './ProjectList';
import { Password } from './PasswordList';
import { CodeSnippet } from './CodeList';
import { isoToVNDate } from '../utils/dateFormat';
import { logApi } from '../utils/api';
import { Log } from '../types/log';
import { DataDisplay } from './DataDisplay';
import { DataComparison } from './DataComparison';
import { formatCurrency } from '../utils/formatMoney';

interface DashboardProps {
  hostings: Hosting[];
  projects: Project[];
  passwords?: Password[];
  codes?: CodeSnippet[];
  onEditProject?: (project: Project) => void;
  onEditHosting?: (hosting: Hosting) => void;
  onAddHosting?: () => void;
  onAddProject?: () => void;
  onAddPassword?: () => void;
  onAddCode?: () => void;
}

interface ActivityItem {
  id: string;
  type: 'hosting' | 'project' | 'password' | 'code';
  action: string;
  title: string;
  timestamp: string;
  color: string;
}

interface UpcomingItem {
  id: string;
  title: string;
  subtitle: string;
  date: string;
  color: string;
  icon: any;
}

export function Dashboard({ 
  hostings, 
  projects, 
  passwords = [], 
  codes = [],
  onEditProject, 
  onEditHosting,
  onAddHosting,
  onAddProject,
  onAddPassword,
  onAddCode
}: DashboardProps) {
  const [recentLogs, setRecentLogs] = useState<Log[]>([]);
  const [logsLoading, setLogsLoading] = useState(true);
  const [viewingLog, setViewingLog] = useState<Log | null>(null);

  const currentHour = new Date().getHours();
  const greeting = currentHour < 12 ? 'Chào buổi sáng' : currentHour < 18 ? 'Chào buổi chiều' : 'Chào buổi tối';

  // Load recent logs
  useEffect(() => {
    loadRecentLogs();
    
    // Auto-refresh logs every 15 seconds (silent)
    const intervalId = setInterval(() => {
      loadRecentLogsQuietly();
    }, 15000);
    
    return () => clearInterval(intervalId);
  }, []);

  const loadRecentLogs = async () => {
    try {
      setLogsLoading(true);
      const logs = await logApi.getAll();
      // Sort by created_at descending (newest first) and take top 5
      const sortedLogs = (logs || [])
        .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
        .slice(0, 5);
      setRecentLogs(sortedLogs);
    } catch (error) {
      console.error('Error loading recent logs:', error);
      setRecentLogs([]);
    } finally {
      setLogsLoading(false);
    }
  };

  // Silent refresh without loading state
  const loadRecentLogsQuietly = async () => {
    try {
      const logs = await logApi.getAll();
      const sortedLogs = (logs || [])
        .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
        .slice(0, 5);
      setRecentLogs(sortedLogs);
    } catch (error) {
      console.error('Error loading recent logs quietly:', error);
    }
  };

  // Stats calculations
  const activeHostings = hostings.filter(h => h.status === 'active').length;
  const expiringHostings = hostings.filter(h => h.status === 'expiring');
  const expiredHostings = hostings.filter(h => h.status === 'expired');
  
  const inProgressProjects = projects.filter(p => p.status === 'in-progress');
  const completedProjects = projects.filter(p => p.status === 'completed');
  const pendingProjects = projects.filter(p => p.status === 'pending-acceptance');

  const totalRevenue = completedProjects.reduce((sum, p) => sum + (p.price || 0), 0);
  const totalPendingRevenue = pendingProjects.reduce((sum, p) => sum + (p.price || 0), 0);

  // Stats cards data
  const statsCards = [
    {
      title: 'Tổng Hosting',
      value: hostings.length.toString(),
      subtitle: `${activeHostings} đang hoạt động`,
      icon: Server,
      color: 'text-gray-600'
    },
    {
      title: 'Sắp Hết Hạn',
      value: expiringHostings.length.toString(),
      subtitle: 'hosting cần gia hạn',
      icon: AlertCircle,
      color: 'text-orange-600'
    },
    {
      title: 'Đang Thực Hiện',
      value: inProgressProjects.length.toString(),
      subtitle: 'đang triển khai',
      icon: FolderKanban,
      color: 'text-blue-600'
    },
    {
      title: 'Chờ Nghiệm Thu',
      value: pendingProjects.length.toString(),
      subtitle: `${formatCurrency(totalPendingRevenue)} VNĐ`,
      icon: CheckCircle,
      color: 'text-purple-600'
    },
    {
      title: 'Doanh Thu',
      value: `${formatCurrency(totalRevenue)}`,
      subtitle: 'VNĐ hoàn thành',
      icon: Activity,
      color: 'text-green-600'
    }
  ];

  // Get days remaining
  const getDaysRemaining = (expirationDate: string) => {
    const today = new Date();
    const expDate = new Date(expirationDate);
    const days = Math.ceil((expDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
    return days;
  };

  // Recent activities (last 5 items sorted by createdAt)
  const recentActivities: ActivityItem[] = [];

  // Add hostings
  hostings
    .sort((a, b) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime())
    .slice(0, 2)
    .forEach(h => {
      recentActivities.push({
        id: h.id,
        type: 'hosting',
        action: 'đã thêm hosting',
        title: h.name,
        timestamp: h.createdAt || new Date().toISOString(),
        color: 'bg-blue-500'
      });
    });

  // Add projects
  projects
    .sort((a, b) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime())
    .slice(0, 2)
    .forEach(p => {
      const action = p.status === 'completed' ? 'đã hoàn thành project' : 
                     p.status === 'in-progress' ? 'đang thực hiện project' :
                     'đã thêm project';
      recentActivities.push({
        id: p.id,
        type: 'project',
        action,
        title: p.name,
        timestamp: p.createdAt || new Date().toISOString(),
        color: 'bg-purple-500'
      });
    });

  // Add passwords
  passwords
    .sort((a, b) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime())
    .slice(0, 1)
    .forEach(p => {
      recentActivities.push({
        id: p.id,
        type: 'password',
        action: 'đã lưu password',
        title: p.title,
        timestamp: p.createdAt || new Date().toISOString(),
        color: 'bg-orange-500'
      });
    });

  // Sort all activities by timestamp and take top 5
  const sortedActivities = recentActivities
    .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
    .slice(0, 5);

  // Upcoming items (deadlines, events)
  const upcomingHostings: UpcomingItem[] = [];
  const upcomingProjects: UpcomingItem[] = [];

  // Add expiring hostings
  expiringHostings
    .sort((a, b) => getDaysRemaining(a.expirationDate) - getDaysRemaining(b.expirationDate))
    .slice(0, 5)
    .forEach(h => {
      const days = getDaysRemaining(h.expirationDate);
      upcomingHostings.push({
        id: h.id,
        title: h.name,
        subtitle: `Còn ${days} ngày`,
        date: isoToVNDate(h.expirationDate),
        color: 'text-orange-600',
        icon: AlertCircle
      });
    });

  // Add expired hostings
  expiredHostings
    .slice(0, 3)
    .forEach(h => {
      const days = Math.abs(getDaysRemaining(h.expirationDate));
      upcomingHostings.push({
        id: h.id,
        title: h.name,
        subtitle: `Quá hạn ${days} ngày`,
        date: isoToVNDate(h.expirationDate),
        color: 'text-red-600',
        icon: AlertCircle
      });
    });

  // Add pending projects
  pendingProjects
    .slice(0, 5)
    .forEach(p => {
      upcomingProjects.push({
        id: p.id,
        title: p.name,
        subtitle: p.customer,
        date: 'Chờ nghiệm thu',
        color: 'text-purple-600',
        icon: CheckCircle
      });
    });

  // Add in-progress projects
  inProgressProjects
    .slice(0, 3)
    .forEach(p => {
      upcomingProjects.push({
        id: p.id,
        title: p.name,
        subtitle: p.customer,
        date: 'Đang thực hiện',
        color: 'text-blue-600',
        icon: FolderKanban
      });
    });

  // Format relative time
  const getRelativeTime = (timestamp: string) => {
    const now = new Date();
    const past = new Date(timestamp);
    const diffMs = now.getTime() - past.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Vừa xong';
    if (diffMins < 60) return `${diffMins} phút trước`;
    if (diffHours < 24) return `${diffHours} giờ trước`;
    if (diffDays < 7) return `${diffDays} ngày trước`;
    return isoToVNDate(timestamp);
  };

  // Quick actions
  const quickActions = [
    { 
      label: 'Thêm Hosting', 
      icon: Server, 
      onClick: onAddHosting 
    },
    { 
      label: 'Thêm Project', 
      icon: FolderKanban, 
      onClick: onAddProject 
    },
    { 
      label: 'Lưu Password', 
      icon: Lock, 
      onClick: onAddPassword 
    },
    { 
      label: 'Tạo Code Snippet', 
      icon: Code, 
      onClick: onAddCode 
    }
  ];

  // Helper functions for log detail modal
  const getModuleIcon = (module: string) => {
    const icons = {
      hosting: <Server className="w-4 h-4" />,
      project: <FolderKanban className="w-4 h-4" />,
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

  const getActionBadge = (action: string) => {
    const badges = {
      create: 'bg-green-100 text-green-700',
      update: 'bg-blue-100 text-blue-700',
      delete: 'bg-red-100 text-red-700',
    };
    return badges[action as keyof typeof badges] || 'bg-gray-100 text-gray-700';
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

  return (
    <div className="space-y-8">
      {/* Welcome Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">
          {greeting}, <span className="text-[#4DBFAD]">Quydev</span>
        </h1>
        <p className="text-sm text-gray-500 mt-1">
          Đây là những gì đang diễn ra trong hệ thống hôm nay
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {statsCards.map((card, index) => {
          const Icon = card.icon;
          return (
            <div
              key={index}
              className="bg-white rounded-lg border border-gray-200 p-5 hover:shadow-md transition-shadow duration-200 group"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <p className="text-xs text-gray-500 font-medium mb-2">{card.title}</p>
                  <p className="text-3xl font-bold text-gray-900 mb-1">{card.value}</p>
                  <p className="text-sm text-gray-500">{card.subtitle}</p>
                </div>
                <div className="ml-3">
                  <Icon className={`w-5 h-5 ${card.color} opacity-60 group-hover:opacity-100 transition-opacity`} />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Main Content Grid - 3 Columns */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Cần Chú Ý & Sắp Tới - Hosting */}
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-base font-semibold text-gray-900">Tình Trạng Hosting</h2>
          </div>
          <div className="p-6">
            {upcomingHostings.length > 0 ? (
              <div className="space-y-4">
                {upcomingHostings.map((item, index) => {
                  const Icon = item.icon;
                  const hosting = hostings.find(h => h.id === item.id);
                  if (!hosting) return null;
                  
                  return (
                    <div key={item.id} className="group">
                      <div className="flex items-start gap-3 cursor-pointer hover:bg-gray-50 -mx-2 px-2 py-2 rounded-lg transition-colors">
                        <div className={`${item.color} mt-0.5 flex-shrink-0`}>
                          <Icon className="w-4 h-4" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-900 truncate">
                            {item.title}
                          </p>
                          <p className="text-xs text-gray-500 mt-0.5">
                            {item.subtitle}
                          </p>
                        </div>
                        <div className="flex items-center gap-2 flex-shrink-0">
                          <p className={`text-xs font-medium ${item.color}`}>{item.date}</p>
                          {onEditHosting && (
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                onEditHosting(hosting);
                              }}
                              className="opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:bg-gray-200 rounded"
                              title="Chỉnh sửa"
                            >
                              <Edit2 className="w-3.5 h-3.5 text-gray-600" />
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-8">
                <CheckCircle className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                <p className="text-sm text-gray-500">Mọi thứ đều ổn!</p>
                <p className="text-xs text-gray-400 mt-1">Không có hosting nào cần chú ý</p>
              </div>
            )}
          </div>
        </div>

        {/* Cần Chú Ý & Sắp Tới - Project */}
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-base font-semibold text-gray-900">Tiến Độ Dự Án</h2>
          </div>
          <div className="p-6">
            {upcomingProjects.length > 0 ? (
              <div className="space-y-4">
                {upcomingProjects.map((item, index) => {
                  const Icon = item.icon;
                  const project = projects.find(p => p.id === item.id);
                  if (!project) return null;
                  
                  return (
                    <div key={item.id} className="group">
                      <div className="flex items-start gap-3 cursor-pointer hover:bg-gray-50 -mx-2 px-2 py-2 rounded-lg transition-colors">
                        <div className={`${item.color} mt-0.5 flex-shrink-0`}>
                          <Icon className="w-4 h-4" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-900 truncate">
                            {item.title}
                          </p>
                          <p className="text-xs text-gray-500 mt-0.5">
                            {item.subtitle}
                          </p>
                        </div>
                        <div className="flex items-center gap-2 flex-shrink-0">
                          <p className={`text-xs font-medium ${item.color}`}>{item.date}</p>
                          {onEditProject && (
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                onEditProject(project);
                              }}
                              className="opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:bg-gray-200 rounded"
                              title="Chỉnh sửa"
                            >
                              <Edit2 className="w-3.5 h-3.5 text-gray-600" />
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-8">
                <CheckCircle className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                <p className="text-sm text-gray-500">Mọi thứ đều ổn!</p>
                <p className="text-xs text-gray-400 mt-1">Không có project nào cần chú ý</p>
              </div>
            )}
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-base font-semibold text-gray-900">Hoạt Động Gần Đây</h2>
          </div>
          <div className="p-6">
            {logsLoading ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-teal-600 mx-auto"></div>
                <p className="text-xs text-gray-400 mt-2">Đang tải...</p>
              </div>
            ) : recentLogs.length > 0 ? (
              <div className="space-y-4">
                {recentLogs.map((log) => {
                  // Map action type to color
                  const colorMap = {
                    create: 'bg-green-500',
                    update: 'bg-blue-500',
                    delete: 'bg-red-500'
                  };
                  const dotColor = colorMap[log.action_type as keyof typeof colorMap] || 'bg-gray-500';
                  
                  // Map action type to Vietnamese
                  const actionMap = {
                    create: 'đã tạo',
                    update: 'đã cập nhật',
                    delete: 'đã xóa'
                  };
                  const actionText = actionMap[log.action_type as keyof typeof actionMap] || log.action_type;
                  
                  // Map module name to Vietnamese
                  const moduleMap = {
                    hosting: 'hosting',
                    project: 'project',
                    password: 'password',
                    codex: 'code snippet'
                  };
                  const moduleText = moduleMap[log.module_name as keyof typeof moduleMap] || log.module_name;
                  
                  return (
                    <div 
                      key={log.id} 
                      className="flex items-start gap-3 group cursor-pointer hover:bg-gray-50 -mx-2 px-2 py-2 rounded-lg transition-colors"
                      onClick={() => setViewingLog(log)}
                      title="Click để xem chi tiết"
                    >
                      <div className={`w-2 h-2 rounded-full ${dotColor} mt-2 flex-shrink-0`} />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-gray-900">
                          <span className="font-medium">{log.user}</span>{' '}
                          <span className="text-gray-600">{actionText} {moduleText}</span>{' '}
                          <span className="font-medium truncate inline-block max-w-[150px] align-bottom" title={log.item_name}>
                            {log.item_name}
                          </span>
                        </p>
                        <p className="text-xs text-gray-400 mt-0.5">
                          {getRelativeTime(log.created_at)}
                        </p>
                      </div>
                      <Eye className="w-4 h-4 text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0 mt-1" />
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-8">
                <Activity className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                <p className="text-sm text-gray-500">Chưa có hoạt động nào</p>
                <p className="text-xs text-gray-400 mt-1">Logs sẽ xuất hiện khi bạn thực hiện các thao tác</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-lg border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-base font-semibold text-gray-900">Hành Động Nhanh</h2>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {quickActions.map((action, index) => {
              const Icon = action.icon;
              if (!action.onClick) return null;
              return (
                <button
                  key={index}
                  onClick={action.onClick}
                  className="flex items-center justify-center gap-3 h-11 px-4 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 hover:border-gray-400 transition-all duration-200 font-medium"
                >
                  <Icon className="w-4 h-4" />
                  <span className="text-sm">{action.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Critical Alert Banner - Only if there are critical items */}
      {(expiredHostings.length > 0 || expiringHostings.length > 5) && (
        <div className="bg-gradient-to-r from-orange-50 to-red-50 border-l-4 border-orange-500 rounded-lg p-5">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-orange-600 mt-0.5 flex-shrink-0" />
            <div className="flex-1">
              <h3 className="text-sm font-semibold text-gray-900 mb-1">
                Cảnh Báo Quan Trọng
              </h3>
              <p className="text-sm text-gray-700">
                {expiredHostings.length > 0 && `${expiredHostings.length} hosting đã hết hạn. `}
                {expiringHostings.length > 5 && `${expiringHostings.length} hosting sắp hết hạn trong 30 ngày tới.`}
              </p>
              <div className="flex gap-3 mt-3">
                <button className="text-xs font-medium text-orange-700 hover:text-orange-800 underline">
                  Xem chi tiết
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* View Log Detail Modal */}
      {viewingLog && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-5xl w-full max-h-[90vh] overflow-hidden flex flex-col">
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h2 className="text-2xl font-bold text-gray-900">Chi tiết Log</h2>
              <button
                onClick={() => setViewingLog(null)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {/* Basic Info */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-600">Module</label>
                  <div className="flex items-center gap-2 mt-1">
                    {getModuleIcon(viewingLog.module_name)}
                    <span className="text-gray-900">{getModuleName(viewingLog.module_name)}</span>
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Hành động</label>
                  <div className="mt-1">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${getActionBadge(viewingLog.action_type)}`}>
                      {viewingLog.action_type === 'create' && 'Tạo mới'}
                      {viewingLog.action_type === 'update' && 'Cập nhật'}
                      {viewingLog.action_type === 'delete' && 'Xóa'}
                    </span>
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Item</label>
                  <p className="text-gray-900 mt-1">{viewingLog.item_name}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">User</label>
                  <p className="text-gray-900 mt-1">{viewingLog.user}</p>
                </div>
                <div className="col-span-2">
                  <label className="text-sm font-medium text-gray-600">Thời gian</label>
                  <p className="text-gray-900 mt-1">{formatDate(viewingLog.created_at)}</p>
                </div>
              </div>

              {/* Data Changes */}
              {viewingLog.action_type === 'delete' && viewingLog.old_data && (
                <div>
                  <label className="text-sm font-medium text-gray-600 mb-3 block">Dữ liệu đã xóa</label>
                  <DataDisplay data={viewingLog.old_data} moduleName={viewingLog.module_name} />
                </div>
              )}

              {viewingLog.action_type === 'create' && viewingLog.new_data && (
                <div>
                  <label className="text-sm font-medium text-gray-600 mb-3 block">Dữ liệu mới</label>
                  <DataDisplay data={viewingLog.new_data} moduleName={viewingLog.module_name} />
                </div>
              )}

              {viewingLog.action_type === 'update' && (
                <div>
                  <label className="text-sm font-medium text-gray-600 mb-3 block">Thay đổi</label>
                  <DataComparison 
                    oldData={viewingLog.old_data} 
                    newData={viewingLog.new_data} 
                    moduleName={viewingLog.module_name} 
                  />
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="flex items-center justify-end gap-3 p-6 border-t border-gray-200">
              <button
                onClick={() => setViewingLog(null)}
                className="px-6 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
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