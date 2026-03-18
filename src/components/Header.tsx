import { Bell, User, Settings, Key, LogOut, ChevronDown, Menu } from 'lucide-react';
import { useState } from 'react';
import { AccountSettings } from './AccountSettings';

interface HeaderProps {
  notificationCount: number;
  onNotificationClick: () => void;
  activeTab: string;
  onMenuClick?: () => void;
}

export function Header({ notificationCount, onNotificationClick, activeTab, onMenuClick }: HeaderProps) {
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showAccountSettings, setShowAccountSettings] = useState(false);

  // Get page title based on active tab
  const getPageTitle = () => {
    switch (activeTab) {
      case 'dashboard': return 'Dashboard';
      case 'hostings': return 'Danh Sách Hosting';
      case 'projects': return 'Quản Lý Project';
      case 'reports': return 'Báo Cáo & Thống Kê';
      case 'passwords': return 'Password Manager';
      case 'codex': return 'CodeX';
      case 'settings': return 'Cài Đặt';
      default: return 'Dashboard';
    }
  };

  // Get page description based on active tab
  const getPageDescription = () => {
    switch (activeTab) {
      case 'dashboard': return 'Tổng quan hệ thống quản lý công việc';
      case 'hostings': return 'Quản lý tất cả hosting của bạn';
      case 'projects': return 'Quản lý tất cả project của bạn';
      case 'reports': return 'Xem báo cáo và thống kê chi tiết';
      case 'passwords': return 'Quản lý mật khẩu an toàn';
      case 'codex': return 'Quản lý các đoạn code hay dùng';
      case 'settings': return 'Cấu hình hệ thống';
      default: return 'Tổng quan hệ thống';
    }
  };

  return (
    <header className="bg-white border-b border-gray-200 shadow-sm">
      <div className="px-4 sm:px-6 lg:px-8 py-3">
        <div className="flex items-center justify-between">
          {/* Left Side - Logo & Title */}
          <div className="flex items-center gap-4">
            {/* Hamburger Menu Button for Mobile */}
            {onMenuClick && (
              <button
                onClick={onMenuClick}
                className="lg:hidden p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-all duration-200 transform hover:scale-105 active:scale-95"
                aria-label="Toggle menu"
              >
                <Menu className="w-6 h-6" />
              </button>
            )}
            
            {/* Title & Slogan */}
            <div>
              <h1 className="text-lg font-bold text-gray-900 leading-tight">
                {getPageTitle()}
              </h1>
              <p className="text-xs text-gray-500 leading-tight">
                {getPageDescription()}
              </p>
            </div>
          </div>

          {/* Right Side - Notification & User */}
          <div className="flex items-center gap-4">
            {/* Notification Bell */}
            <button
              onClick={onNotificationClick}
              className="relative p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
              aria-label="Thông báo"
            >
              <Bell className="w-6 h-6" />
              {notificationCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center shadow-md">
                  {notificationCount > 9 ? '9+' : notificationCount}
                </span>
              )}
            </button>

            {/* User Profile */}
            <div className="relative">
              <button
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="flex items-center gap-3 hover:bg-gray-50 rounded-lg px-3 py-2 transition-colors"
              >
                {/* Avatar */}
                <div className="w-10 h-10 bg-gradient-to-br from-[#4DBFAD] to-[#2563B4] rounded-full flex items-center justify-center text-white font-semibold shadow-md">
                  QD
                </div>
                
                {/* User Info */}
                <div className="text-left hidden sm:block">
                  <p className="text-sm font-semibold text-gray-900 leading-tight">
                    Quy Dev
                  </p>
                  <p className="text-xs text-gray-500 leading-tight">
                    Administrator
                  </p>
                </div>
              </button>

              {/* Dropdown Menu */}
              {showUserMenu && (
                <div className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-2xl border-2 border-gray-200 overflow-hidden z-50 animate-in slide-in-from-top-2 duration-200">
                  {/* Header */}
                  <div className="bg-gradient-to-r from-[#4DBFAD] to-[#2563B4] px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-white/20 backdrop-blur rounded-full flex items-center justify-center text-white font-bold text-lg border-2 border-white/30">
                        QD
                      </div>
                      <div>
                        <p className="text-sm font-bold text-white">Quy Dev</p>
                        <p className="text-xs text-white/80">quydev</p>
                      </div>
                    </div>
                  </div>

                  {/* Menu Items */}
                  <div className="py-2">
                    <button
                      onClick={() => {
                        setShowAccountSettings(true);
                        setShowUserMenu(false);
                      }}
                      className="w-full flex items-center gap-3 px-4 py-3 text-sm text-gray-700 hover:bg-gradient-to-r hover:from-[#4DBFAD]/10 hover:to-[#2563B4]/10 transition-all group"
                    >
                      <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#4DBFAD]/20 to-[#2563B4]/20 flex items-center justify-center group-hover:scale-110 transition-transform">
                        <User className="w-4 h-4 text-[#4DBFAD]" />
                      </div>
                      <div className="flex-1 text-left">
                        <p className="font-semibold text-gray-900">Thông Tin Tài Khoản</p>
                        <p className="text-xs text-gray-500">Xem và chỉnh sửa thông tin</p>
                      </div>
                    </button>

                    <button
                      onClick={() => {
                        setShowAccountSettings(true);
                        setShowUserMenu(false);
                      }}
                      className="w-full flex items-center gap-3 px-4 py-3 text-sm text-gray-700 hover:bg-gradient-to-r hover:from-[#4DBFAD]/10 hover:to-[#2563B4]/10 transition-all group"
                    >
                      <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-amber-400/20 to-orange-400/20 flex items-center justify-center group-hover:scale-110 transition-transform">
                        <Key className="w-4 h-4 text-amber-600" />
                      </div>
                      <div className="flex-1 text-left">
                        <p className="font-semibold text-gray-900">Đổi Mật Khẩu</p>
                        <p className="text-xs text-gray-500">Cập nhật mật khẩu bảo mật</p>
                      </div>
                    </button>

                    <div className="my-2 border-t border-gray-200"></div>

                    <button
                      onClick={() => {
                        if (confirm('Bạn có chắc muốn đăng xuất?')) {
                          localStorage.removeItem('isLoggedIn');
                          window.location.reload();
                        }
                        setShowUserMenu(false);
                      }}
                      className="w-full flex items-center gap-3 px-4 py-3 text-sm text-red-600 hover:bg-red-50 transition-all group"
                    >
                      <div className="w-8 h-8 rounded-lg bg-red-100 flex items-center justify-center group-hover:scale-110 transition-transform">
                        <LogOut className="w-4 h-4 text-red-600" />
                      </div>
                      <div className="flex-1 text-left">
                        <p className="font-semibold">Đăng Xuất</p>
                        <p className="text-xs text-red-500">Thoát khỏi hệ thống</p>
                      </div>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Account Settings Modal */}
      {showAccountSettings && (
        <AccountSettings
          onClose={() => setShowAccountSettings(false)}
          currentUser={{
            username: 'quydev',
            email: 'quydev@1pixel.vn',
            role: 'Administrator'
          }}
        />
      )}
    </header>
  );
}