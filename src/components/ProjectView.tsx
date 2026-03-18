import { X, User, Phone, Calendar, ExternalLink, Eye, EyeOff, Copy, Banknote, Lock, Globe, FileText } from 'lucide-react';
import { Project } from './ProjectList';
import { useState } from 'react';
import { isoToVNDate } from '../utils/dateFormat';

interface ProjectViewProps {
  project: Project;
  onClose: () => void;
}

export function ProjectView({ project, onClose }: ProjectViewProps) {
  const [showPassword, setShowPassword] = useState(false);

  const getStatusBadge = (status: Project['status']) => {
    switch (status) {
      case 'planning':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'in-progress':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'completed':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'on-hold':
        return 'bg-gray-100 text-gray-800 border-gray-200';
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
    }
  };

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-black/60 via-[#4DBFAD]/20 to-[#2563B4]/20 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-5xl w-full max-h-[90vh] flex flex-col">
        {/* Header - Fixed */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-gradient-to-r from-[#4DBFAD]/10 to-[#2563B4]/10 flex-shrink-0">
          <h2 className="text-2xl font-bold text-gray-900">Chi Tiết Project</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content - Scrollable */}
        <div className="overflow-y-auto project-modal-scroll p-6 space-y-6 flex-1">
          {/* Project Name & Status */}
          <div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">
              {project.name}
            </h3>
            <div className="flex items-center gap-3">
              <span
                className={`inline-flex px-3 py-1 rounded-full text-sm font-medium border ${getStatusBadge(
                  project.status
                )}`}
              >
                {getStatusText(project.status)}
              </span>
              <span className="text-sm text-gray-600">
                <Calendar className="w-4 h-4 inline mr-1" />
                {isoToVNDate(project.createdAt)}
              </span>
            </div>
          </div>

          {/* Customer Information */}
          <div className="bg-gradient-to-br from-blue-50 to-blue-100/50 rounded-lg p-5 border border-blue-200">
            <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
              <User className="w-5 h-5 text-blue-600" />
              Thông Tin Khách Hàng
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-600 mb-1">Tên Khách Hàng</p>
                <p className="text-gray-900 font-medium">{project.customer}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600 mb-1">Số Điện Thoại</p>
                <p className="text-gray-900 font-medium">
                  <Phone className="w-4 h-4 inline mr-1 text-blue-600" />
                  {project.customerPhone}
                </p>
              </div>
              <div className="md:col-span-2">
                <p className="text-sm text-gray-600 mb-1">Giá Trị Dự Án</p>
                <p className="text-gray-900 font-semibold text-lg flex items-center gap-2">
                  <Banknote className="w-5 h-5 text-blue-600" />
                  {project.price.toLocaleString('vi-VN')} VNĐ
                </p>
              </div>
            </div>
          </div>

          {/* Admin Information */}
          {(project.adminUrl || project.adminUsername || project.adminPassword) && (
            <div className="bg-gradient-to-br from-purple-50 to-purple-100/50 rounded-lg p-5 border border-purple-200">
              <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                <Lock className="w-5 h-5 text-purple-600" />
                Thông Tin Quản Trị
              </h4>
              <div className="space-y-3">
                {project.adminUrl && (
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Đường Dẫn Admin</p>
                    <a
                      href={project.adminUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-purple-600 hover:text-purple-700 font-medium flex items-center gap-1 break-all"
                    >
                      <Globe className="w-4 h-4 flex-shrink-0" />
                      {project.adminUrl}
                    </a>
                  </div>
                )}
                {project.adminUsername && (
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Tài Khoản</p>
                    <div className="flex items-center gap-2">
                      <code className="bg-white px-3 py-1 rounded border border-purple-200 font-mono text-sm">
                        {project.adminUsername}
                      </code>
                      <button
                        onClick={() => {
                          navigator.clipboard.writeText(project.adminUsername);
                          alert('Đã sao chép tài khoản!');
                        }}
                        className="text-xs text-purple-600 hover:text-purple-700 underline"
                      >
                        Sao chép
                      </button>
                    </div>
                  </div>
                )}
                {project.adminPassword && (
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Mật Khẩu</p>
                    <div className="flex items-center gap-2">
                      <code className="bg-white px-3 py-1 rounded border border-purple-200 font-mono text-sm">
                        {showPassword ? project.adminPassword : '••••••••'}
                      </code>
                      <button
                        onClick={() => setShowPassword(!showPassword)}
                        className="text-xs text-purple-600 hover:text-purple-700 underline"
                      >
                        {showPassword ? 'Ẩn' : 'Hiện'}
                      </button>
                      <button
                        onClick={() => {
                          navigator.clipboard.writeText(project.adminPassword);
                          alert('Đã sao chép mật khẩu!');
                        }}
                        className="text-xs text-purple-600 hover:text-purple-700 underline"
                      >
                        Sao chép
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Description */}
          <div className="bg-gray-50 rounded-lg p-5 border border-gray-200">
            <div className="flex items-center gap-2 mb-3">
              <FileText className="w-5 h-5 text-gray-600" />
              <h4 className="font-semibold text-gray-900">Mô Tả</h4>
            </div>
            <p className="text-gray-900 whitespace-pre-wrap leading-relaxed">
              {project.description}
            </p>
          </div>
        </div>

        {/* Footer - Fixed */}
        <div className="flex justify-end p-6 border-t border-gray-200 bg-gray-50 flex-shrink-0">
          <button
            onClick={onClose}
            className="px-6 py-2 bg-gradient-to-r from-[#4DBFAD] to-[#2563B4] text-white rounded-lg hover:opacity-90 transition-opacity"
          >
            Đóng
          </button>
        </div>
      </div>
    </div>
  );
}