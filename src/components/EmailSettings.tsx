import { useState, useEffect } from 'react';
import { Mail, CheckCircle, AlertCircle, Loader2, Send, Bell } from 'lucide-react';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

interface EmailSettingsData {
  enabled: boolean;
  email: string;
  notifyHosting30Days: boolean;
  notifyHosting7Days: boolean;
  notifyHosting1Day: boolean;
  notifyProjects: boolean;
}

export function EmailSettings() {
  const [settings, setSettings] = useState<EmailSettingsData>({
    enabled: false,
    email: '',
    notifyHosting30Days: true,
    notifyHosting7Days: true,
    notifyHosting1Day: true,
    notifyProjects: true,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isTesting, setIsTesting] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`${API_BASE}/email-settings`);

      if (response.ok) {
        const data = await response.json();
        if (data.success && data.data) {
          setSettings(data.data);
        }
      }
    } catch (error) {
      console.error('Error loading email settings:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async () => {
    setIsSaving(true);
    setMessage(null);

    try {
      const response = await fetch(`${API_BASE}/email-settings`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(settings),
      });

      if (response.ok) {
        setMessage({ type: 'success', text: '✅ Đã lưu cài đặt email thành công!' });
        setTimeout(() => setMessage(null), 3000);
      } else {
        setMessage({ type: 'error', text: '❌ Không thể lưu cài đặt' });
      }
    } catch (error) {
      console.error('Error saving email settings:', error);
      setMessage({ type: 'error', text: '❌ Lỗi khi lưu cài đặt' });
    } finally {
      setIsSaving(false);
    }
  };

  const handleSendTest = async () => {
    if (!settings.email) {
      setMessage({ type: 'error', text: '⚠️ Vui lòng nhập email trước' });
      return;
    }

    setIsTesting(true);
    setMessage(null);

    try {
      const response = await fetch(`${API_BASE}/email/send-test`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: settings.email }),
      });

      if (response.ok) {
        setMessage({ 
          type: 'success', 
          text: `✅ Email test đã được gửi đến ${settings.email}. Vui lòng kiểm tra hộp thư!` 
        });
      } else {
        const data = await response.json();
        setMessage({ type: 'error', text: `❌ ${data.error || 'Không thể gửi email test'}` });
      }
    } catch (error) {
      console.error('Error sending test email:', error);
      setMessage({ type: 'error', text: '❌ Lỗi khi gửi email test' });
    } finally {
      setIsTesting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center gap-3 mb-4">
          <Mail className="w-6 h-6 text-[#4DBFAD]" />
          <h2 className="text-lg font-semibold text-gray-900">Email Notifications</h2>
        </div>
        <div className="flex items-center gap-2 text-gray-600">
          <Loader2 className="w-5 h-5 animate-spin" />
          <span>Đang tải cài đặt...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="flex items-center gap-3 mb-4">
        <Mail className="w-6 h-6 text-[#4DBFAD]" />
        <h2 className="text-lg font-semibold text-gray-900">Email Notifications</h2>
      </div>

      <div className="space-y-6">
        <p className="text-sm text-gray-600">
          Tự động gửi email nhắc nhở khi hosting/project sắp hết hạn.
        </p>

        {/* Configuration Notice */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-start gap-2">
            <AlertCircle className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
            <div className="text-sm text-blue-800">
              <p className="font-medium mb-2">📧 Email Notifications - Tính năng TÙY CHỌN</p>
              <p className="mb-3">
                Tự động gửi email nhắc nhở khi hosting/project sắp hết hạn. 
                Sử dụng <strong>Resend API</strong> (Free: 3,000 emails/tháng) hoặc SMTP tùy chỉnh.
              </p>

              <p className="font-medium mb-2">⚙️ Để kích hoạt (2 bước):</p>
              <ol className="list-decimal list-inside space-y-2 ml-2 text-xs">
                <li>
                  <strong>Cấu hình backend:</strong>
                  <ul className="list-disc list-inside ml-4 mt-1 space-y-1">
                    <li>Thêm biến môi trường trong <code className="bg-white px-1 rounded">/backend/.env</code></li>
                    <li>
                      Resend: <code className="bg-white px-1 rounded">RESEND_API_KEY=re_xxx</code>
                    </li>
                    <li>
                      Hoặc SMTP: <code className="bg-white px-1 rounded">SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS</code>
                    </li>
                  </ul>
                </li>

                <li className="mt-2">
                  <strong>Test Email:</strong>
                  <ul className="list-disc list-inside ml-4 mt-1 space-y-1">
                    <li>Nhập email bên dưới</li>
                    <li>Click nút <strong>Test</strong></li>
                    <li>Kiểm tra inbox (và spam folder)</li>
                  </ul>
                </li>
              </ol>

              <div className="mt-3 p-2 bg-yellow-50 border border-yellow-300 rounded">
                <p className="text-xs text-yellow-800">
                  💡 <strong>Lưu ý:</strong> Email notification là tính năng tùy chọn. Hệ thống vẫn hoạt động bình thường mà không cần email.
                </p>
              </div>
            </div>
          </div>
        </div>

        {message && (
          <div className={`border rounded-lg p-4 ${
            message.type === 'success' 
              ? 'bg-green-50 border-green-200' 
              : 'bg-red-50 border-red-200'
          }`}>
            <div className="flex items-center gap-2">
              {message.type === 'success' ? (
                <CheckCircle className="w-5 h-5 text-green-600" />
              ) : (
                <AlertCircle className="w-5 h-5 text-red-600" />
              )}
              <p className={`text-sm font-medium ${
                message.type === 'success' ? 'text-green-800' : 'text-red-800'
              }`}>
                {message.text}
              </p>
            </div>
          </div>
        )}

        {/* Enable/Disable */}
        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
          <div>
            <h3 className="font-medium text-gray-900">Bật Email Notifications</h3>
            <p className="text-sm text-gray-600">Tự động gửi email theo lịch</p>
          </div>
          <button
            onClick={() => setSettings({ ...settings, enabled: !settings.enabled })}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
              settings.enabled ? 'bg-[#4DBFAD]' : 'bg-gray-300'
            }`}
          >
            <span
              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                settings.enabled ? 'translate-x-6' : 'translate-x-1'
              }`}
            />
          </button>
        </div>

        {/* Email Address */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Email nhận thông báo *
          </label>
          <div className="flex gap-2">
            <input
              type="email"
              value={settings.email}
              onChange={(e) => setSettings({ ...settings, email: e.target.value })}
              placeholder="your-email@example.com"
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#4DBFAD] focus:border-transparent"
            />
            <button
              onClick={handleSendTest}
              disabled={isTesting || !settings.email}
              className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isTesting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Đang gửi...
                </>
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  Test
                </>
              )}
            </button>
          </div>
        </div>

        {/* Hosting Notifications */}
        <div className="border-t pt-4">
          <div className="flex items-center gap-2 mb-3">
            <Bell className="w-5 h-5 text-[#4DBFAD]" />
            <h3 className="font-medium text-gray-900">Nhắc nhở Hosting</h3>
          </div>
          <div className="space-y-3 ml-7">
            <label className="flex items-center gap-3">
              <input
                type="checkbox"
                checked={settings.notifyHosting30Days}
                onChange={(e) => setSettings({ ...settings, notifyHosting30Days: e.target.checked })}
                className="w-4 h-4 text-[#4DBFAD] border-gray-300 rounded focus:ring-[#4DBFAD]"
              />
              <span className="text-sm text-gray-700">30 ngày trước hết hạn</span>
            </label>
            <label className="flex items-center gap-3">
              <input
                type="checkbox"
                checked={settings.notifyHosting7Days}
                onChange={(e) => setSettings({ ...settings, notifyHosting7Days: e.target.checked })}
                className="w-4 h-4 text-[#4DBFAD] border-gray-300 rounded focus:ring-[#4DBFAD]"
              />
              <span className="text-sm text-gray-700">7 ngày trước hết hạn</span>
            </label>
            <label className="flex items-center gap-3">
              <input
                type="checkbox"
                checked={settings.notifyHosting1Day}
                onChange={(e) => setSettings({ ...settings, notifyHosting1Day: e.target.checked })}
                className="w-4 h-4 text-[#4DBFAD] border-gray-300 rounded focus:ring-[#4DBFAD]"
              />
              <span className="text-sm text-gray-700">1 ngày trước & ngày hết hạn</span>
            </label>
          </div>
        </div>

        {/* Project Notifications */}
        <div className="border-t pt-4">
          <label className="flex items-center gap-3">
            <input
              type="checkbox"
              checked={settings.notifyProjects}
              onChange={(e) => setSettings({ ...settings, notifyProjects: e.target.checked })}
              className="w-4 h-4 text-[#4DBFAD] border-gray-300 rounded focus:ring-[#4DBFAD]"
            />
            <div>
              <span className="text-sm font-medium text-gray-900">Nhắc nhở Project Deadline</span>
              <p className="text-xs text-gray-600">Gửi email khi project gần deadline</p>
            </div>
          </label>
        </div>

        {/* Save Button */}
        <button
          onClick={handleSave}
          disabled={isSaving}
          className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-[#4DBFAD] to-[#2563B4] text-white px-6 py-3 rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSaving ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              Đang lưu...
            </>
          ) : (
            <>
              <CheckCircle className="w-5 h-5" />
              Lưu Cài Đặt
            </>
          )}
        </button>

        {/* Info */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h4 className="font-medium text-blue-900 mb-2">💡 Cách hoạt động:</h4>
          <ul className="space-y-2 text-sm text-blue-700">
            <li className="flex items-start gap-2">
              <span className="text-blue-500">•</span>
              <span>Backend cron job chạy hàng ngày lúc 9:00 AM (UTC+7)</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-blue-500">•</span>
              <span>Tự động check hosting/project sắp hết hạn</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-blue-500">•</span>
              <span>Gửi email HTML đẹp với đầy đủ thông tin</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-blue-500">•</span>
              <span>Tránh spam: Mỗi nhắc nhở chỉ gửi 1 lần/ngày</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
