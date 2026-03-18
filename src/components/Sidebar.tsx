import { LayoutDashboard, Server, FolderKanban, Key, Settings, Code, LogOut, User, BarChart3, FileText, X } from 'lucide-react';
import logoImage from 'figma:asset/355764cce9853929952be24aa5f1193f3825459d.png';

interface SidebarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  onLogout?: () => void;
  isOpen?: boolean;
  onClose?: () => void;
}

const menuItems = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'hostings', label: 'Hostings', icon: Server },
  { id: 'projects', label: 'Projects', icon: FolderKanban },
  { id: 'reports', label: 'Báo Cáo', icon: BarChart3 },
  { id: 'passwords', label: 'Passwords', icon: Key },
  { id: 'codex', label: 'CodeX', icon: Code },
  { id: 'logs', label: 'Logs', icon: FileText },
  { id: 'settings', label: 'Settings', icon: Settings },
];

export function Sidebar({ activeTab, onTabChange, onLogout, isOpen = true, onClose }: SidebarProps) {
  const handleTabClick = (tabId: string) => {
    onTabChange(tabId);
    // Close sidebar on mobile after selecting
    if (onClose && window.innerWidth < 1024) {
      onClose();
    }
  };

  return (
    <>
      {/* Overlay for mobile */}
      {isOpen && onClose && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden transition-opacity duration-300"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed lg:static inset-y-0 left-0 z-50
          w-64 bg-white border-r border-gray-200 min-h-screen flex flex-col
          transform transition-transform duration-300 ease-in-out
          ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        `}
      >
        {/* Close button for mobile */}
        {onClose && (
          <button
            onClick={onClose}
            className="lg:hidden absolute top-4 right-4 p-2 rounded-lg hover:bg-gray-100 transition-colors z-10"
            aria-label="Close menu"
          >
            <X className="w-5 h-5 text-gray-600" />
          </button>
        )}

        {/* Logo */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <img 
              src={logoImage} 
              alt="1Pixel Logo" 
              className="w-12 h-12 animate-[fadeIn_0.5s_ease-in-out]"
            />
            <div className="animate-[slideInRight_0.5s_ease-in-out]">
              <h1 className="text-xl font-bold text-gray-900">
                1Pixel
              </h1>
              <p className="text-xs text-gray-500">Quản lý công việc tập trung</p>
            </div>
          </div>
        </div>

        {/* Menu Items */}
        <nav className="flex-1 p-4 overflow-y-auto">
          <ul className="space-y-2">
            {menuItems.map((item, index) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              
              return (
                <li 
                  key={item.id}
                  className="animate-[slideInLeft_0.3s_ease-in-out]"
                  style={{ animationDelay: `${index * 0.05}s` }}
                >
                  <button
                    onClick={() => handleTabClick(item.id)}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98] ${
                      isActive
                        ? 'bg-gradient-to-r from-[#4DBFAD] to-[#2563B4] text-white font-medium shadow-lg'
                        : 'text-gray-700 hover:bg-gray-50 hover:shadow-md'
                    }`}
                  >
                    <Icon className={`w-5 h-5 transition-transform duration-200 ${
                      isActive ? 'text-white scale-110' : 'text-gray-500'
                    }`} />
                    <span className="transition-all duration-200">{item.label}</span>
                  </button>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Footer */}
        <div className="p-4 border-t border-gray-200">
          <div className="bg-gradient-to-br from-[#4DBFAD]/10 to-[#2563B4]/10 rounded-lg p-4 border border-[#4DBFAD]/20 animate-[fadeIn_0.5s_ease-in-out] hover:shadow-md transition-all duration-200">
            <h3 className="font-semibold text-gray-900 text-sm mb-1">
              Cần hỗ trợ?
            </h3>
            <p className="text-xs text-gray-600 mb-3">
              Liên hệ với chúng tôi để được hỗ trợ
            </p>
            <a 
              href="https://1pixel.vn/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="block w-full bg-gradient-to-r from-[#4DBFAD] to-[#2563B4] text-white text-sm py-2 rounded-lg hover:opacity-90 hover:shadow-lg transition-all duration-200 text-center transform hover:scale-[1.02] active:scale-[0.98]"
            >
              Liên Hệ
            </a>
          </div>
        </div>
      </aside>
    </>
  );
}