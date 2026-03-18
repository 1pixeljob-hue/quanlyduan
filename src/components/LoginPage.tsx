import { useState, useEffect } from 'react';
import { Lock, User, Eye, EyeOff } from 'lucide-react';
import duckImage from 'figma:asset/5fb43a64f998e493a4d097598f9bf7227e03e9bd.png';

interface LoginPageProps {
  onLogin: () => void;
}

export function LoginPage({ onLogin }: LoginPageProps) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [progress, setProgress] = useState(0);

  // Progress animation
  useEffect(() => {
    if (!isLoading) {
      setProgress(0);
      return;
    }

    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) return 0;
        return prev + 1; // Smoother 1% increments
      });
    }, 30); // 30ms for smooth animation

    return () => clearInterval(interval);
  }, [isLoading]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    // Simulate loading với con vịt cute
    await new Promise(resolve => setTimeout(resolve, 800));

    // Hardcoded credentials
    if (username === 'quydev' && password === 'Spencil@123') {
      localStorage.setItem('isLoggedIn', 'true');
      localStorage.setItem('username', username);
      onLogin();
    } else {
      setError('Tên đăng nhập hoặc mật khẩu không đúng!');
    }

    setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#4DBFAD] to-[#2563B4] flex items-center justify-center p-4">
      {/* Loading Duck with Progress Bar */}
      {isLoading && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white/10 backdrop-blur-md rounded-3xl p-12 max-w-lg w-full mx-4">
            {/* Duck on Progress Bar */}
            <div className="relative w-full mb-8">
              {/* Duck - positioned above the bar */}
              <div 
                className="absolute -top-4 transition-all duration-100 ease-linear"
                style={{ 
                  left: `calc(${progress}% - 1.5rem)`,
                  transform: 'translateY(-100%)'
                }}
              >
                <img 
                  src={duckImage} 
                  alt="Loading Duck"
                  className="w-12 h-12 object-contain animate-waddle"
                  style={{ filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.3))' }}
                />
              </div>

              {/* Progress Bar Container */}
              <div className="w-full h-7 bg-[#B8E6F0] rounded-full overflow-hidden border-3 border-white/50">
                {/* Progress Fill */}
                <div 
                  className="h-full bg-gradient-to-r from-[#2563B4] to-[#4DBFAD] transition-all duration-100 ease-linear rounded-full"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>

            {/* Loading Text */}
            <div className="text-center">
              <p className="text-white font-bold tracking-wider text-lg drop-shadow-lg">
                ĐANG ĐĂNG NHẬP
              </p>
            </div>
          </div>
        </div>
      )}

      <div className="w-full max-w-md">
        {/* Logo Card */}
        <div className="bg-white rounded-2xl shadow-2xl p-8 mb-6">
          <div className="text-center mb-8">
            <div className="inline-block bg-gradient-to-br from-[#4DBFAD] to-[#2563B4] p-4 rounded-2xl mb-4">
              <div className="text-white text-4xl font-bold">1P</div>
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">1Pixel</h1>
            <p className="text-gray-600">Hệ thống Quản lý Công việc Tập trung</p>
          </div>

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Username */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tên đăng nhập
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#4DBFAD] focus:border-transparent transition-all"
                  placeholder="Nhập tên tài khoản"
                  required
                  autoComplete="username"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Mật khẩu
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="block w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#4DBFAD] focus:border-transparent transition-all"
                  placeholder="••••••••"
                  required
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                  ) : (
                    <Eye className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                  )}
                </button>
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                {error}
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-[#4DBFAD] to-[#2563B4] text-white py-3 rounded-lg font-medium hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Đang đăng nhập...' : 'Đăng Nhập'}
            </button>
          </form>
        </div>

        {/* Footer Info */}
        <div className="text-center text-white/80 text-sm">
          <p>© 2025 1Pixel. All rights reserved.</p>
          <p className="mt-1">Version 1.0.0</p>
        </div>
      </div>
    </div>
  );
}