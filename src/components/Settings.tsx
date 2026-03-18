import { useState } from 'react';
import { Bell, Calendar, DollarSign, Download, Upload, Trash2, Database, Server, Bug } from 'lucide-react';
import { Hosting } from '../App';
import { Project } from './ProjectList';
import { NumberInput } from './NumberInput';
import { DebugPanel } from './DebugPanel';
import * as googleCalendar from '../utils/googleCalendar';
import { toast } from 'sonner';

interface SettingsProps {
  onExportData: () => void;
  onImportData: (data: any) => void;
  onClearData: () => void;
  hostings: Hosting[];
  projects: Project[];
}

export function Settings({ onExportData, onImportData, onClearData, hostings, projects }: SettingsProps) {
  const [notificationDays, setNotificationDays] = useState(30);
  const [isGoogleAuthorized, setIsGoogleAuthorized] = useState(googleCalendar.isAuthorized());
  const [isSyncing, setIsSyncing] = useState(false);
  const [showDebugPanel, setShowDebugPanel] = useState(false);

  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        try {
          const data = JSON.parse(event.target?.result as string);
          onImportData(data);
          toast.success('Nhập dữ liệu thành công!');
        } catch (error) {
          toast.error('Lỗi khi nhập dữ liệu. Vui lòng kiểm tra file JSON.');
        }
      };
      reader.readAsText(file);
    }
  };

  // Google Calendar handlers
  const handleConnectGoogleCalendar = async () => {
    try {
      await googleCalendar.authorizeGoogleCalendar();
      setIsGoogleAuthorized(true);
      toast.success('Kết nối thành công! 📅', {
        description: 'Bạn có thể đồng bộ hosting lên Google Calendar',
      });
    } catch (error: any) {
      console.error('Connect error:', error);
      toast.error('Kết nối thất bại', {
        description: error.message || 'Vui lòng thử lại hoặc kiểm tra quyền truy cập',
      });
    }
  };

  const handleDisconnectGoogleCalendar = () => {
    googleCalendar.signOutGoogleCalendar();
    setIsGoogleAuthorized(false);
    toast.success('Đã ngắt kết nối Google Calendar');
  };

  const handleSyncAllHostings = async () => {
    if (hostings.length === 0) {
      toast.info('Không có hosting nào để đồng bộ');
      return;
    }

    setIsSyncing(true);

    const syncPromise = async () => {
      const count = await googleCalendar.syncAllHostingsToCalendar(hostings);
      return count;
    };

    toast.promise(syncPromise(), {
      loading: `Đang đồng bộ ${hostings.length} hosting...`,
      success: (count) => ({
        title: 'Đồng bộ thành công! 🎉',
        description: `Đã thêm ${count} hosting vào Google Calendar`,
      }),
      error: {
        title: 'Đồng bộ thất bại',
        description: 'Vui lòng thử lại',
      },
    });

    setIsSyncing(false);
  };

  // Tính tổng dữ liệu
  const totalHostings = hostings.length;
  const totalProjects = projects.length;
  const activeHostings = hostings.filter(h => h.status === 'active').length;
  const expiringHostings = hostings.filter(h => h.status === 'expiring').length;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Cài Đặt</h2>
      </div>

      {/* Database Info */}
      <div className="bg-gradient-to-br from-[#4DBFAD] to-[#2563B4] rounded-lg shadow-lg p-6 text-white">
        <div className="flex items-center gap-3 mb-4">
          <div className="bg-white/20 p-3 rounded-lg backdrop-blur-sm">
            <Database className="w-6 h-6 text-white" />
          </div>
          <div>
            <h3 className="text-xl font-bold">Backend API + MySQL Database</h3>
            <p className="text-sm text-white/80">Hệ thống lưu trữ dữ liệu tập trung</p>
          </div>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
            <div className="text-2xl font-bold">{totalHostings}</div>
            <div className="text-sm text-white/80">Hostings</div>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
            <div className="text-2xl font-bold">{totalProjects}</div>
            <div className="text-sm text-white/80">Projects</div>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
            <div className="text-2xl font-bold">{activeHostings}</div>
            <div className="text-sm text-white/80">Hoạt động</div>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
            <div className="text-2xl font-bold text-yellow-300">{expiringHostings}</div>
            <div className="text-sm text-white/80">Sắp hết hạn</div>
          </div>
        </div>

        <div className="mt-4 pt-4 border-t border-white/20">
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-2">
              <Server className="w-4 h-4" />
              <span>Trạng thái kết nối</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              <span className="font-medium">Đã kết nối</span>
            </div>
          </div>
        </div>
      </div>

      {/* Notification Settings */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="bg-gradient-to-br from-[#4DBFAD] to-[#2563B4] p-2 rounded-lg">
            <Bell className="w-5 h-5 text-white" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900">
            Cài Đặt Thông Báo
          </h3>
        </div>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Cảnh báo trước khi hết hạn (ngày)
            </label>
            <NumberInput
              value={notificationDays.toString()}
              onChange={(value) => setNotificationDays(parseInt(value) || 1)}
              min={1}
              max={365}
              className="w-full md:w-64 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#4DBFAD] focus:border-transparent"
              icon={<Bell className="w-5 h-5 text-gray-400" />}
            />
            <p className="mt-2 text-sm text-gray-600">
              Hệ thống sẽ hiển thị cảnh báo khi hosting còn {notificationDays} ngày nữa là hết hạn
            </p>
          </div>
        </div>
      </div>

      {/* Google Calendar Integration */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="bg-gradient-to-br from-green-500 to-blue-500 p-2 rounded-lg">
            <Calendar className="w-5 h-5 text-white" />
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-gray-900">
              Google Calendar Integration
            </h3>
            <p className="text-sm text-gray-600">
              Tự động đồng bộ ngày hết hạn hosting lên Google Calendar
            </p>
          </div>
          {isGoogleAuthorized && (
            <div className="flex items-center gap-2 px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              Đã kết nối
            </div>
          )}
        </div>

        <div className="space-y-4">
          {!isGoogleAuthorized ? (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <div className="bg-blue-100 p-2 rounded-lg">
                  <Calendar className="w-5 h-5 text-blue-600" />
                </div>
                <div className="flex-1">
                  <h4 className="font-medium text-blue-900 mb-1">
                    Kết nối Google Calendar
                  </h4>
                  <p className="text-sm text-blue-700 mb-3">
                    Sau khi kết nối, hệ thống sẽ tự động tạo 3 sự kiện nhắc nhở cho mỗi hosting:
                  </p>
                  <ul className="text-sm text-blue-700 space-y-1 mb-4 ml-4">
                    <li className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                      <span>🔵 7 ngày trước hết hạn</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                      <span>🟠 1 ngày trước hết hạn</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                      <span>🔴 Ngày hết hạn</span>
                    </li>
                  </ul>
                  <button
                    onClick={handleConnectGoogleCalendar}
                    className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-green-500 to-blue-500 text-white rounded-lg hover:shadow-lg hover:scale-105 transition-all duration-200 font-medium"
                  >
                    <Calendar className="w-5 h-5" />
                    Kết nối Google Calendar
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <div className="bg-green-100 p-2 rounded-lg">
                  <Calendar className="w-5 h-5 text-green-600" />
                </div>
                <div className="flex-1">
                  <h4 className="font-medium text-green-900 mb-1">
                    ✅ Đã kết nối với Google Calendar
                  </h4>
                  <p className="text-sm text-green-700 mb-4">
                    Hệ thống sẽ tự động đồng bộ khi bạn thêm/sửa/xóa hosting
                  </p>

                  <div className="flex flex-col sm:flex-row gap-3">
                    <button
                      onClick={handleSyncAllHostings}
                      disabled={isSyncing || hostings.length === 0}
                      className="flex items-center justify-center gap-2 px-4 py-2 bg-gradient-to-r from-[#4DBFAD] to-[#2563B4] text-white rounded-lg hover:shadow-lg hover:scale-105 transition-all duration-200 font-medium disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                    >
                      <Calendar className="w-5 h-5" />
                      {isSyncing ? 'Đang đồng bộ...' : `Đồng bộ ${hostings.length} Hosting`}
                    </button>
                    <button
                      onClick={handleDisconnectGoogleCalendar}
                      className="flex items-center justify-center gap-2 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors font-medium"
                    >
                      Ngắt kết nối
                    </button>
                  </div>

                  {hostings.length === 0 && (
                    <p className="text-sm text-amber-600 mt-3">
                      ⚠️ Chưa có hosting nào để đồng bộ
                    </p>
                  )}
                </div>
              </div>
            </div>
          )}

          <div className="bg-gray-50 rounded-lg p-4 text-sm text-gray-600">
            <h5 className="font-medium text-gray-900 mb-2">💡 Lưu ý:</h5>
            <ul className="space-y-1 ml-4">
              <li>• Mỗi hosting sẽ tạo 3 events với màu sắc khác nhau</li>
              <li>• Email & popup reminder sẽ được gửi tự động</li>
              <li>• Thêm/Sửa/Xóa hosting sẽ tự động cập nhật Calendar</li>
              <li>• Xem events tại: <a href="https://calendar.google.com" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">calendar.google.com</a></li>
            </ul>
          </div>
        </div>
      </div>

      {/* Data Management */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="bg-gradient-to-br from-[#4DBFAD] to-[#2563B4] p-2 rounded-lg">
            <Calendar className="w-5 h-5 text-white" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900">
            Quản Lý Dữ Liệu
          </h3>
        </div>
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={onExportData}
              className="flex items-center justify-center gap-2 px-4 py-2 bg-gradient-to-r from-[#4DBFAD] to-[#2563B4] text-white rounded-lg hover:opacity-90 transition-opacity"
            >
              <Download className="w-5 h-5" />
              Xuất Dữ Liệu
            </button>
            <label className="flex items-center justify-center gap-2 px-4 py-2 bg-gradient-to-r from-[#2563B4] to-[#4DBFAD] text-white rounded-lg hover:opacity-90 transition-opacity cursor-pointer">
              <Upload className="w-5 h-5" />
              Nhập Dữ Liệu
              <input
                type="file"
                accept=".json"
                onChange={handleImport}
                className="hidden"
              />
            </label>
            <button
              onClick={onClearData}
              className="flex items-center justify-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
            >
              <Trash2 className="w-5 h-5" />
              Xóa Tất Cả Dữ Liệu
            </button>
          </div>
          <p className="text-sm text-gray-600">
            Xuất dữ liệu để sao lưu hoặc chuyển sang thiết bị khác. Nhập dữ liệu để khôi phục từ file backup.
          </p>
        </div>
      </div>

      {/* Display Settings */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="bg-gradient-to-br from-[#4DBFAD] to-[#2563B4] p-2 rounded-lg">
            <DollarSign className="w-5 h-5 text-white" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900">
            Hiển Thị
          </h3>
        </div>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium text-gray-900">Đơn Vị Tiền Tệ</h4>
              <p className="text-sm text-gray-600">Hiển thị giá theo VNĐ</p>
            </div>
            <span className="text-sm font-medium text-gray-900">VNĐ</span>
          </div>
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-gray-900">Định dạng ngày</p>
              <p className="text-sm text-gray-600">Hiển thị ngày theo định dạng Việt Nam</p>
            </div>
            <span className="text-sm font-medium text-gray-900">DD/MM/YYYY</span>
          </div>
        </div>
      </div>

      {/* About */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Thông Tin Hệ Thống
        </h3>
        <div className="space-y-3 text-sm">
          <div className="flex justify-between items-center">
            <span className="text-gray-600">Phiên bản:</span>
            <span className="font-medium text-gray-900">2.0.0</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-600">Lưu trữ:</span>
            <div className="flex items-center gap-2">
              <Database className="w-4 h-4 text-[#4DBFAD]" />
              <span className="font-medium text-gray-900">MySQL Database</span>
            </div>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-600">Backend:</span>
            <div className="flex items-center gap-2">
              <Server className="w-4 h-4 text-[#2563B4]" />
              <span className="font-medium text-gray-900">Node.js + Express</span>
            </div>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-600">Đơn vị phát triển:</span>
            <span className="font-medium text-gray-900">1Pixel</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-600">Logo & Branding:</span>
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded bg-gradient-to-br from-[#4DBFAD] to-[#2563B4]"></div>
              <span className="text-xs font-mono text-gray-500">Teal & Blue</span>
            </div>
          </div>
        </div>
      </div>

      {/* Debug Panel */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="bg-gradient-to-br from-[#4DBFAD] to-[#2563B4] p-2 rounded-lg">
            <Bug className="w-5 h-5 text-white" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900">
            Debug Panel
          </h3>
        </div>
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={() => setShowDebugPanel(!showDebugPanel)}
              className="flex items-center justify-center gap-2 px-4 py-2 bg-gradient-to-r from-[#4DBFAD] to-[#2563B4] text-white rounded-lg hover:opacity-90 transition-opacity"
            >
              <Bug className="w-5 h-5" />
              {showDebugPanel ? 'Ẩn Debug Panel' : 'Hiện Debug Panel'}
            </button>
          </div>
          <p className="text-sm text-gray-600">
            Hiển thị thông tin gỡ lỗi và kiểm tra hệ thống.
          </p>
        </div>
        {showDebugPanel && <DebugPanel />}
      </div>
    </div>
  );
}