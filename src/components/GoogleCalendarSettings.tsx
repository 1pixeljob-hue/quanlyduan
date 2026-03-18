import { useState, useEffect } from 'react';
import { Calendar, Check, X, RefreshCw, LogOut, AlertCircle, CheckCircle, Info } from 'lucide-react';
import * as googleCalendar from '../utils/googleCalendar';
import { Hosting } from '../App';
import { Project } from './ProjectList';

interface GoogleCalendarSettingsProps {
  hostings: Hosting[];
  projects: Project[];
}

export function GoogleCalendarSettings({ hostings, projects }: GoogleCalendarSettingsProps) {
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [syncStatus, setSyncStatus] = useState<string | null>(null);

  useEffect(() => {
    const init = async () => {
      try {
        await googleCalendar.initGoogleAPI();
        setIsInitialized(true);
        setIsAuthorized(googleCalendar.isAuthorized());
      } catch (err: any) {
        // Suppress console error for missing Client ID (it's optional)
        if (!err.message || !err.message.includes('Client ID')) {
          console.error('Failed to initialize Google Calendar API:', err);
        }
        
        // Don't set error for missing Client ID - it's optional
        if (err.message && err.message.includes('Client ID')) {
          setError(null); // Clear error, just show setup instructions
        } else {
          setError(err.message || 'Không thể khởi tạo Google Calendar API');
        }
        setIsInitialized(false);
      }
    };

    init();
  }, []);

  const handleAuthorize = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      await googleCalendar.authorizeGoogleCalendar();
      setIsAuthorized(true);
      setSyncStatus('✅ Đã kết nối thành công với Google Calendar!');
      
      setTimeout(() => setSyncStatus(null), 5000);
    } catch (err: any) {
      console.error('Authorization failed:', err);
      setError('Không thể kết nối. Vui lòng thử lại.');
      setIsAuthorized(false);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignOut = () => {
    googleCalendar.signOutGoogleCalendar();
    setIsAuthorized(false);
    setSyncStatus('🔓 Đã ngắt kết nối Google Calendar');
    setTimeout(() => setSyncStatus(null), 3000);
  };

  const handleSyncAllHostings = async () => {
    setIsLoading(true);
    setError(null);
    setSyncStatus(null);

    try {
      const count = await googleCalendar.syncAllHostingsToCalendar(hostings);
      setSyncStatus(`✅ Đã đồng bộ ${count} hosting lên Google Calendar!`);
    } catch (err: any) {
      console.error('Sync failed:', err);
      setError('Không thể đồng bộ. Vui lòng kiểm tra kết nối.');
    } finally {
      setIsLoading(false);
      setTimeout(() => setSyncStatus(null), 5000);
    }
  };

  const handleSyncAllProjects = async () => {
    setIsLoading(true);
    setError(null);
    setSyncStatus(null);

    try {
      const count = await googleCalendar.syncAllProjectsToCalendar(projects);
      setSyncStatus(`✅ Đã đồng bộ ${count} project lên Google Calendar!`);
    } catch (err: any) {
      console.error('Sync failed:', err);
      setError('Không thể đồng bộ. Vui lòng kiểm tra kết nối.');
    } finally {
      setIsLoading(false);
      setTimeout(() => setSyncStatus(null), 5000);
    }
  };

  if (!isInitialized && !error) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 bg-gradient-to-br from-[#4DBFAD] to-[#2563B4] rounded-lg">
            <Calendar className="w-6 h-6 text-white" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Google Calendar Integration</h3>
            <p className="text-sm text-gray-500">Tính năng tùy chọn - Đồng bộ hosting lên Google Calendar</p>
          </div>
        </div>

        <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <div className="flex items-start gap-3">
            <Info className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-blue-900 mb-2">
                📅 Chưa cấu hình Google Calendar API
              </p>
              <p className="text-sm text-blue-800 mb-3">
                Tính năng này hoàn toàn <strong>TÙY CHỌN</strong>. Hệ thống vẫn hoạt động bình thường mà không cần Google Calendar.
              </p>
              
              <div className="space-y-2 text-xs text-blue-700">
                <p><strong>✨ Lợi ích khi kích hoạt:</strong></p>
                <ul className="list-disc list-inside space-y-1 ml-2">
                  <li>Tự động đồng bộ hosting lên Google Calendar</li>
                  <li>3 lần nhắc nhở cho mỗi hosting (7 ngày, 1 ngày, ngày hết hạn)</li>
                  <li>Nhận email & popup reminders từ Google</li>
                  <li>Xem lịch hết hạn trên mọi thiết bị</li>
                </ul>
              </div>

              <div className="mt-4 pt-4 border-t border-blue-200">
                <p className="text-xs font-medium text-blue-900 mb-2">🚀 Để kích hoạt:</p>
                <ol className="text-xs text-blue-700 space-y-1 list-decimal list-inside ml-2">
                  <li>Tạo Google Cloud Project tại <a href="https://console.cloud.google.com" target="_blank" className="underline">console.cloud.google.com</a></li>
                  <li>Enable Google Calendar API</li>
                  <li>Tạo OAuth 2.0 Client ID</li>
                  <li>Thêm vào file <code className="bg-blue-100 px-1 rounded">.env</code>: <code className="bg-blue-100 px-1 rounded">VITE_GOOGLE_CLIENT_ID=your-id</code></li>
                  <li>Restart server: <code className="bg-blue-100 px-1 rounded">npm run dev</code></li>
                </ol>
              </div>

              <a 
                href="/GOOGLE_CALENDAR_SETUP.md" 
                target="_blank"
                className="inline-block mt-4 px-4 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition-colors"
              >
                📖 Xem hướng dẫn chi tiết (5 phút)
              </a>
            </div>
          </div>
        </div>

        <div className="mt-4 p-3 bg-gray-50 border border-gray-200 rounded-lg">
          <p className="text-xs text-gray-600">
            💡 <strong>Lưu ý:</strong> Nếu không cần tính năng này, bạn có thể bỏ qua. Hệ thống vẫn có thể xuất file ICS để import thủ công vào Google Calendar.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-gradient-to-br from-[#4DBFAD] to-[#2563B4] rounded-lg">
          <Calendar className="w-6 h-6 text-white" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Google Calendar Integration</h3>
          <p className="text-sm text-gray-500">Đồng bộ hosting và project lên Google Calendar</p>
        </div>
      </div>

      {/* Error Alert */}
      {error && (
        <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
          <div className="flex-1">
            <p className="text-sm font-medium text-red-900">Lỗi kết nối</p>
            <p className="text-sm text-red-700 mt-1">{error}</p>
            {error.includes('Client ID') && (
              <div className="mt-3 p-3 bg-white rounded border border-red-300">
                <p className="text-xs font-medium text-gray-900 mb-2">📝 Hướng dẫn khắc phục:</p>
                <ol className="text-xs text-gray-700 space-y-1 list-decimal list-inside">
                  <li>Mở file <code className="bg-gray-100 px-1 rounded">.env</code> trong thư mục project</li>
                  <li>Thêm dòng: <code className="bg-gray-100 px-1 rounded">VITE_GOOGLE_CLIENT_ID=your-client-id</code></li>
                  <li>Restart dev server: <code className="bg-gray-100 px-1 rounded">npm run dev</code></li>
                </ol>
                <a 
                  href="/GOOGLE_CALENDAR_SETUP.md" 
                  target="_blank"
                  className="text-xs text-blue-600 hover:underline mt-2 inline-block"
                >
                  📖 Xem hướng dẫn chi tiết →
                </a>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Success Alert */}
      {syncStatus && (
        <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-lg flex items-start gap-3">
          <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
          <p className="text-sm text-green-700">{syncStatus}</p>
        </div>
      )}

      {/* Connection Status */}
      <div className="mb-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className={`w-3 h-3 rounded-full ${isAuthorized ? 'bg-green-500 animate-pulse' : 'bg-gray-400'}`} />
            <div>
              <p className="text-sm font-medium text-gray-900">
                Trạng thái: {isAuthorized ? '✅ Đã kết nối' : '⚪ Chưa kết nối'}
              </p>
              {isAuthorized && (
                <p className="text-xs text-gray-500 mt-1">
                  Tự động đồng bộ khi thêm/sửa/xóa hosting hoặc project
                </p>
              )}
            </div>
          </div>
          
          {isAuthorized ? (
            <button
              onClick={handleSignOut}
              className="px-4 py-2 text-sm text-red-600 bg-white border border-red-200 rounded-lg hover:bg-red-50 transition-colors flex items-center gap-2"
            >
              <LogOut className="w-4 h-4" />
              Ngắt kết nối
            </button>
          ) : (
            <button
              onClick={handleAuthorize}
              disabled={isLoading || !isInitialized}
              className="px-4 py-2 text-sm text-white bg-gradient-to-r from-[#4DBFAD] to-[#2563B4] rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50 flex items-center gap-2"
            >
              <Calendar className="w-4 h-4" />
              {isLoading ? 'Đang kết nối...' : '🔗 Kết nối Google Calendar'}
            </button>
          )}
        </div>
      </div>

      {/* Sync Actions */}
      {isAuthorized && (
        <div className="space-y-4">
          <div className="border-t border-gray-200 pt-4">
            <h4 className="text-sm font-semibold text-gray-900 mb-3">Đồng bộ dữ liệu</h4>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Sync Hostings */}
              <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <div className="flex items-start gap-3 mb-3">
                  <div className="p-2 bg-blue-100 rounded">
                    <Calendar className="w-5 h-5 text-blue-600" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">Hostings</p>
                    <p className="text-xs text-gray-600 mt-1">
                      {hostings.length} hosting, mỗi hosting có 3 nhắc nhở
                    </p>
                  </div>
                </div>
                <button
                  onClick={handleSyncAllHostings}
                  disabled={isLoading || hostings.length === 0}
                  className="w-full px-4 py-2 text-sm text-blue-600 bg-white border border-blue-300 rounded-lg hover:bg-blue-50 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
                  Đồng bộ {hostings.length} Hosting
                </button>
              </div>

              {/* Sync Projects */}
              <div className="p-4 bg-purple-50 border border-purple-200 rounded-lg">
                <div className="flex items-start gap-3 mb-3">
                  <div className="p-2 bg-purple-100 rounded">
                    <Calendar className="w-5 h-5 text-purple-600" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">Projects</p>
                    <p className="text-xs text-gray-600 mt-1">
                      {projects.length} project sẽ được thêm vào lịch
                    </p>
                  </div>
                </div>
                <button
                  onClick={handleSyncAllProjects}
                  disabled={isLoading || projects.length === 0}
                  className="w-full px-4 py-2 text-sm text-purple-600 bg-white border border-purple-300 rounded-lg hover:bg-purple-50 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
                  Đồng bộ {projects.length} Project
                </button>
              </div>
            </div>
          </div>

          {/* Info */}
          <div className="p-4 bg-gradient-to-br from-gray-50 to-gray-100 border border-gray-200 rounded-lg">
            <div className="flex items-start gap-3">
              <Info className="w-5 h-5 text-gray-600 flex-shrink-0 mt-0.5" />
              <div className="text-xs text-gray-700 space-y-2">
                <p><strong>📅 Hosting:</strong> Tự động tạo 3 events (7 ngày trước, 1 ngày trước, ngày hết hạn)</p>
                <p><strong>📁 Project:</strong> Tạo 1 event với thông tin khách hàng và trạng thái</p>
                <p><strong>🔄 Auto-sync:</strong> Mỗi khi thêm/sửa/xóa sẽ tự động cập nhật lên Calendar</p>
                <p><strong>🎨 Màu sắc:</strong> 🔵 Blue (7 ngày) | 🟠 Orange (1 ngày) | 🔴 Red (hết hạn)</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Setup Guide Link */}
      {!isInitialized && (
        <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
          <p className="text-sm text-yellow-800 mb-2">
            ⚠️ Chưa cấu hình Google Calendar API
          </p>
          <a 
            href="/GOOGLE_CALENDAR_SETUP.md" 
            target="_blank"
            className="text-sm text-blue-600 hover:underline font-medium"
          >
            📖 Xem hướng dẫn cấu hình chi tiết →
          </a>
        </div>
      )}
    </div>
  );
}