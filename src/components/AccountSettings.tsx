import { useState } from 'react';
import { X, Lock, Eye, EyeOff, AlertCircle, CheckCircle2, Key } from 'lucide-react';
import { LoadingDuck } from './LoadingDuck';

interface AccountSettingsProps {
  onClose: () => void;
  currentUser: {
    username: string;
    email: string;
    role: string;
  };
}

export function AccountSettings({ onClose, currentUser }: AccountSettingsProps) {
  const [activeTab, setActiveTab] = useState<'info' | 'password'>('info');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Password change states
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    // Validation
    if (!currentPassword || !newPassword || !confirmPassword) {
      setError('Vui lòng điền đầy đủ thông tin');
      return;
    }

    if (newPassword.length < 6) {
      setError('Mật khẩu mới phải có ít nhất 6 ký tự');
      return;
    }

    if (newPassword !== confirmPassword) {
      setError('Mật khẩu xác nhận không khớp');
      return;
    }

    if (currentPassword !== 'Spencil@123') {
      setError('Mật khẩu hiện tại không đúng');
      return;
    }

    setIsLoading(true);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // In production, integrate with backend authentication API:
      // await api.auth.changePassword({ currentPassword, newPassword });

      setSuccess('Đổi mật khẩu thành công! Vui lòng đăng nhập lại.');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');

      // Auto close after 2 seconds
      setTimeout(() => {
        onClose();
        // Force re-login
        localStorage.removeItem('isLoggedIn');
        window.location.reload();
      }, 2000);
    } catch (err) {
      setError('Có lỗi xảy ra. Vui lòng thử lại.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden animate-in fade-in zoom-in duration-300">
        {/* Header with Gradient Border */}
        <div className="relative">
          <div className="h-1 bg-gradient-to-r from-[#4DBFAD] to-[#2563B4]"></div>
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-br from-[#4DBFAD] to-[#2563B4] rounded-full flex items-center justify-center shadow-lg">
                <Key className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-900">Tài Khoản</h2>
                <p className="text-sm text-gray-500">Quản lý thông tin cá nhân</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-gray-200 px-6">
          <button
            onClick={() => setActiveTab('info')}
            className={`px-4 py-3 text-sm font-medium border-b-2 transition-all ${
              activeTab === 'info'
                ? 'border-[#4DBFAD] text-[#4DBFAD]'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            👤 Thông Tin
          </button>
          <button
            onClick={() => setActiveTab('password')}
            className={`px-4 py-3 text-sm font-medium border-b-2 transition-all ${
              activeTab === 'password'
                ? 'border-[#4DBFAD] text-[#4DBFAD]'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            🔑 Đổi Mật Khẩu
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-200px)]">
          {activeTab === 'info' ? (
            // Account Info Tab
            <div className="space-y-6">
              {/* Avatar Section */}
              <div className="flex flex-col items-center pb-6 border-b border-gray-200">
                <div className="w-24 h-24 bg-gradient-to-br from-[#4DBFAD] to-[#2563B4] rounded-full flex items-center justify-center text-white text-3xl font-bold shadow-xl mb-4">
                  QD
                </div>
                <h3 className="text-xl font-bold text-gray-900">{currentUser.username}</h3>
                <p className="text-sm text-gray-500">{currentUser.email}</p>
              </div>

              {/* Info Fields */}
              <div className="space-y-4">
                <div className="bg-gradient-to-br from-gray-50 to-gray-100/50 rounded-xl p-4 border border-gray-200">
                  <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2 block">
                    Tên đăng nhập
                  </label>
                  <p className="text-base font-medium text-gray-900">{currentUser.username}</p>
                </div>

                <div className="bg-gradient-to-br from-gray-50 to-gray-100/50 rounded-xl p-4 border border-gray-200">
                  <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2 block">
                    Email
                  </label>
                  <p className="text-base font-medium text-gray-900">{currentUser.email}</p>
                </div>

                <div className="bg-gradient-to-br from-gray-50 to-gray-100/50 rounded-xl p-4 border border-gray-200">
                  <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2 block">
                    Vai trò
                  </label>
                  <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-gradient-to-r from-[#4DBFAD] to-[#2563B4] text-white text-sm font-semibold rounded-full">
                    <div className="w-2 h-2 bg-white rounded-full"></div>
                    {currentUser.role}
                  </div>
                </div>
              </div>

              {/* Info Note */}
              <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-blue-900 mb-1">Lưu ý</p>
                  <p className="text-xs text-blue-700 leading-relaxed">
                    Để thay đổi thông tin tài khoản, vui lòng liên hệ quản trị viên hệ thống.
                  </p>
                </div>
              </div>
            </div>
          ) : (
            // Change Password Tab
            <form onSubmit={handlePasswordChange} className="space-y-5">
              {/* Current Password */}
              <div>
                <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                  <Lock className="w-4 h-4 text-gray-500" />
                  Mật khẩu hiện tại
                </label>
                <div className="relative">
                  <input
                    type={showCurrentPassword ? 'text' : 'password'}
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    placeholder="Nhập mật khẩu hiện tại"
                    className="w-full px-4 py-3 bg-gradient-to-br from-gray-50 to-gray-100/50 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-[#4DBFAD] focus:border-[#4DBFAD] transition-all pr-12"
                    disabled={isLoading}
                  />
                  <button
                    type="button"
                    onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 p-2 text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    {showCurrentPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* New Password */}
              <div>
                <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                  <Key className="w-4 h-4 text-gray-500" />
                  Mật khẩu mới
                </label>
                <div className="relative">
                  <input
                    type={showNewPassword ? 'text' : 'password'}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Nhập mật khẩu mới (tối thiểu 6 ký tự)"
                    className="w-full px-4 py-3 bg-gradient-to-br from-gray-50 to-gray-100/50 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-[#4DBFAD] focus:border-[#4DBFAD] transition-all pr-12"
                    disabled={isLoading}
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 p-2 text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    {showNewPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Confirm Password */}
              <div>
                <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                  <CheckCircle2 className="w-4 h-4 text-gray-500" />
                  Xác nhận mật khẩu mới
                </label>
                <div className="relative">
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Nhập lại mật khẩu mới"
                    className="w-full px-4 py-3 bg-gradient-to-br from-gray-50 to-gray-100/50 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-[#4DBFAD] focus:border-[#4DBFAD] transition-all pr-12"
                    disabled={isLoading}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 p-2 text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Error Message */}
              {error && (
                <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-start gap-3 animate-in slide-in-from-top duration-300">
                  <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-red-700">{error}</p>
                </div>
              )}

              {/* Success Message */}
              {success && (
                <div className="bg-green-50 border border-green-200 rounded-xl p-4 flex items-start gap-3 animate-in slide-in-from-top duration-300">
                  <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-green-700">{success}</p>
                </div>
              )}

              {/* Security Note */}
              <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-amber-900 mb-1">Bảo mật</p>
                  <ul className="text-xs text-amber-700 leading-relaxed space-y-1">
                    <li>• Mật khẩu phải có ít nhất 6 ký tự</li>
                    <li>• Nên sử dụng kết hợp chữ hoa, chữ thường, số và ký tự đặc biệt</li>
                    <li>• Không chia sẻ mật khẩu với người khác</li>
                  </ul>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={onClose}
                  className="flex-1 px-4 py-3 bg-white text-gray-700 border-2 border-gray-300 rounded-xl hover:bg-gray-50 transition-all font-semibold"
                  disabled={isLoading}
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-3 bg-gradient-to-r from-[#4DBFAD] to-[#2563B4] text-white rounded-xl hover:opacity-90 transition-all font-semibold shadow-lg shadow-[#4DBFAD]/20 disabled:opacity-50"
                  disabled={isLoading}
                >
                  {isLoading ? 'Đang cập nhật...' : 'Cập Nhật Mật Khẩu'}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>

      {/* Loading Overlay */}
      {isLoading && (
        <div className="absolute inset-0 bg-black/20 backdrop-blur-sm flex items-center justify-center z-10">
          <LoadingDuck size="md" message="Đang cập nhật mật khẩu..." />
        </div>
      )}
    </div>
  );
}