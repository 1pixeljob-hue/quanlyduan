import { Database, AlertTriangle, ExternalLink, CheckCircle2, Server, Code } from "lucide-react";

export function SetupGuide() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#4DBFAD]/10 to-[#2563B4]/10 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-[#4DBFAD] to-[#2563B4] text-white px-8 py-6">
          <div className="flex items-center gap-4">
            <div className="bg-white/20 p-3 rounded-lg backdrop-blur-sm">
              <Database className="w-8 h-8" />
            </div>
            <div>
              <h1 className="text-2xl font-bold">Chào mừng đến với 1Pixel</h1>
              <p className="text-white/90 text-sm mt-1">
                Hệ thống quản lý công việc tập trung - MySQL + Node.js Backend
              </p>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-8 space-y-6">
          {/* Alert */}
          <div className="bg-yellow-50 border-2 border-yellow-200 rounded-lg p-4 flex items-start gap-3">
            <AlertTriangle className="w-6 h-6 text-yellow-600 flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="font-semibold text-yellow-900 mb-1">
                Backend chưa được setup
              </h3>
              <p className="text-sm text-yellow-800">
                Hệ thống cần Node.js backend kết nối với MySQL database. Vui lòng làm theo các bước bên dưới.
              </p>
            </div>
          </div>

          {/* Steps */}
          <div className="space-y-4">
            <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
              <span className="bg-gradient-to-r from-[#4DBFAD] to-[#2563B4] text-white w-7 h-7 rounded-full flex items-center justify-center text-sm">
                1
              </span>
              Setup MySQL Database
            </h2>
            <div className="ml-9 space-y-3">
              <div className="bg-gray-50 rounded-lg p-4 text-sm text-gray-700 space-y-2">
                <p><strong>Option A:</strong> Sử dụng MySQL trên hosting của bạn</p>
                <ul className="list-disc list-inside ml-4 space-y-1">
                  <li>Truy cập cPanel/Hosting Control Panel</li>
                  <li>Tạo database mới (ví dụ: <code className="bg-white px-1.5 py-0.5 rounded">onepixel_db</code>)</li>
                  <li>Tạo user và gán quyền truy cập database</li>
                  <li>Lưu lại thông tin: <code className="bg-white px-1.5 py-0.5 rounded">host</code>, <code className="bg-white px-1.5 py-0.5 rounded">user</code>, <code className="bg-white px-1.5 py-0.5 rounded">password</code>, <code className="bg-white px-1.5 py-0.5 rounded">database name</code></li>
                </ul>
                
                <p className="pt-2"><strong>Option B:</strong> Sử dụng Neon PostgreSQL (miễn phí)</p>
                <ul className="list-disc list-inside ml-4 space-y-1">
                  <li>Truy cập <a href="https://neon.tech" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">neon.tech</a> và đăng ký</li>
                  <li>Tạo project mới</li>
                  <li>Copy DATABASE_URL connection string</li>
                  <li>Lưu ý: Cần điều chỉnh backend code để hỗ trợ PostgreSQL</li>
                </ul>

                <p className="pt-2"><strong>Option C:</strong> MySQL local (Development)</p>
                <ul className="list-disc list-inside ml-4 space-y-1">
                  <li>Cài đặt MySQL Server trên máy local</li>
                  <li>Tạo database: <code className="bg-white px-1.5 py-0.5 rounded">CREATE DATABASE onepixel_db;</code></li>
                  <li>Connection: <code className="bg-white px-1.5 py-0.5 rounded">mysql://root:password@localhost:3306/onepixel_db</code></li>
                </ul>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
              <span className="bg-gradient-to-r from-[#4DBFAD] to-[#2563B4] text-white w-7 h-7 rounded-full flex items-center justify-center text-sm">
                2
              </span>
              Cấu hình Backend
            </h2>
            <div className="ml-9 space-y-3">
              <div className="bg-gray-50 rounded-lg p-4 text-sm text-gray-700 space-y-3">
                <p><strong>Tạo file <code className="bg-white px-1.5 py-0.5 rounded">/backend/.env</code></strong></p>
                <div className="bg-gray-900 text-green-400 p-4 rounded font-mono text-xs overflow-x-auto">
                  <div># MySQL Connection</div>
                  <div>DATABASE_URL=mysql://user:password@host:3306/database_name</div>
                  <div className="mt-2"># Hoặc với các biến riêng biệt:</div>
                  <div>DB_HOST=localhost</div>
                  <div>DB_USER=root</div>
                  <div>DB_PASSWORD=your_password</div>
                  <div>DB_NAME=onepixel_db</div>
                  <div>DB_PORT=3306</div>
                  <div className="mt-2"># Server Config</div>
                  <div>PORT=3001</div>
                  <div>NODE_ENV=production</div>
                </div>

                <p className="pt-2"><strong>Ví dụ DATABASE_URL:</strong></p>
                <ul className="list-disc list-inside ml-4 space-y-1 text-xs">
                  <li>Local: <code className="bg-white px-1.5 py-0.5 rounded">mysql://root:password@localhost:3306/onepixel_db</code></li>
                  <li>Hosting: <code className="bg-white px-1.5 py-0.5 rounded">mysql://u123_user:pass123@sql123.site.com:3306/u123_onepixel</code></li>
                  <li>Neon (PostgreSQL): <code className="bg-white px-1.5 py-0.5 rounded">postgresql://user:pass@ep-xxx.neon.tech/neondb?sslmode=require</code></li>
                </ul>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
              <span className="bg-gradient-to-r from-[#4DBFAD] to-[#2563B4] text-white w-7 h-7 rounded-full flex items-center justify-center text-sm">
                3
              </span>
              Deploy Backend
            </h2>
            <div className="ml-9 space-y-3">
              <div className="bg-gray-50 rounded-lg p-4 text-sm text-gray-700 space-y-2">
                <p><strong>Option A:</strong> Deploy lên hosting Node.js của bạn</p>
                <ol className="list-decimal list-inside ml-4 space-y-1">
                  <li>Upload thư mục <code className="bg-white px-1.5 py-0.5 rounded">/backend</code> lên hosting</li>
                  <li>SSH vào server và chạy <code className="bg-white px-1.5 py-0.5 rounded">npm install</code></li>
                  <li>Cấu hình Node.js app với entry point: <code className="bg-white px-1.5 py-0.5 rounded">index.js</code></li>
                  <li>Set Node version: <code className="bg-white px-1.5 py-0.5 rounded">22.8.0</code> hoặc cao hơn</li>
                  <li>Start application và lưu lại URL (ví dụ: <code className="bg-white px-1.5 py-0.5 rounded">https://api.onetask.1pixel.vn</code>)</li>
                </ol>

                <p className="pt-2"><strong>Option B:</strong> Deploy lên Railway (miễn phí)</p>
                <ol className="list-decimal list-inside ml-4 space-y-1">
                  <li>Truy cập <a href="https://railway.app" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">railway.app</a> và đăng nhập</li>
                  <li>Create New Project → Deploy from GitHub</li>
                  <li>Chọn repository chứa thư mục <code className="bg-white px-1.5 py-0.5 rounded">/backend</code></li>
                  <li>Add biến môi trường <code className="bg-white px-1.5 py-0.5 rounded">DATABASE_URL</code></li>
                  <li>Railway sẽ tự động deploy và cung cấp URL</li>
                </ol>

                <p className="pt-2"><strong>Option C:</strong> Chạy local (Development)</p>
                <ol className="list-decimal list-inside ml-4 space-y-1">
                  <li>Mở terminal trong thư mục <code className="bg-white px-1.5 py-0.5 rounded">/backend</code></li>
                  <li>Chạy: <code className="bg-white px-1.5 py-0.5 rounded">npm install</code></li>
                  <li>Chạy: <code className="bg-white px-1.5 py-0.5 rounded">npm start</code></li>
                  <li>Backend sẽ chạy tại: <code className="bg-white px-1.5 py-0.5 rounded">http://localhost:3001</code></li>
                </ol>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
              <span className="bg-gradient-to-r from-[#4DBFAD] to-[#2563B4] text-white w-7 h-7 rounded-full flex items-center justify-center text-sm">
                4
              </span>
              Cấu hình Frontend & Deploy
            </h2>
            <div className="ml-9 space-y-3">
              <div className="bg-gray-50 rounded-lg p-4 text-sm text-gray-700 space-y-2">
                <p><strong>Cấu hình biến môi trường</strong></p>
                <ul className="list-disc list-inside ml-4 space-y-1">
                  <li>Tạo file <code className="bg-white px-1.5 py-0.5 rounded">.env</code> ở root project</li>
                  <li>Thêm: <code className="bg-white px-1.5 py-0.5 rounded">VITE_API_URL=https://your-backend-url/api</code></li>
                  <li>Ví dụ Railway: <code className="bg-white px-1.5 py-0.5 rounded">VITE_API_URL=https://backend-production-abc123.up.railway.app/api</code></li>
                  <li>Ví dụ Hosting: <code className="bg-white px-1.5 py-0.5 rounded">VITE_API_URL=https://api.onetask.1pixel.vn/api</code></li>
                </ul>

                <p className="pt-2"><strong>Deploy lên Vercel</strong></p>
                <ol className="list-decimal list-inside ml-4 space-y-1">
                  <li>Truy cập <a href="https://vercel.com" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">vercel.com</a> và import project</li>
                  <li>Thêm environment variable: <code className="bg-white px-1.5 py-0.5 rounded">VITE_API_URL</code></li>
                  <li>Deploy và lưu lại URL frontend</li>
                  <li><strong>Quan trọng:</strong> Cập nhật CORS trong backend để cho phép domain Vercel</li>
                </ol>
              </div>
              
              <button
                onClick={() => window.location.reload()}
                className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-[#4DBFAD] to-[#2563B4] text-white rounded-lg hover:shadow-lg hover:scale-105 transition-all duration-200 font-medium"
              >
                <CheckCircle2 className="w-5 h-5" />
                Tôi đã setup xong - Refresh trang
              </button>
            </div>
          </div>

          {/* Additional Info */}
          <div className="border-t pt-6 space-y-4">
            <h3 className="font-semibold text-gray-900">🔧 Cấu trúc Backend:</h3>
            <div className="bg-gray-900 text-green-400 p-4 rounded font-mono text-xs overflow-x-auto">
              <div>/backend/</div>
              <div>  ├── index.js          # Main server file</div>
              <div>  ├── db.js             # Database connection</div>
              <div>  ├── routes/           # API routes</div>
              <div>  │   ├── auth.js       # Authentication</div>
              <div>  │   ├── hostings.js   # Hosting CRUD</div>
              <div>  │   ├── projects.js   # Project CRUD</div>
              <div>  │   └── ...</div>
              <div>  ├── .env              # Environment variables</div>
              <div>  └── package.json      # Dependencies</div>
            </div>
          </div>

          <div className="border-t pt-6 space-y-4">
            <h3 className="font-semibold text-gray-900">📚 Tài liệu hỗ trợ:</h3>
            <div className="grid gap-2 text-sm">
              <div className="flex items-center gap-2 text-gray-700">
                <div className="w-2 h-2 bg-[#4DBFAD] rounded-full"></div>
                <span>Backend code đã sẵn sàng trong thư mục <code className="bg-gray-100 px-1.5 py-0.5 rounded">/backend</code></span>
              </div>
              <div className="flex items-center gap-2 text-gray-700">
                <div className="w-2 h-2 bg-[#2563B4] rounded-full"></div>
                <span>MySQL tables sẽ tự động được tạo khi backend khởi động lần đầu</span>
              </div>
              <div className="flex items-center gap-2 text-gray-700">
                <div className="w-2 h-2 bg-[#4DBFAD] rounded-full"></div>
                <span>Admin mặc định: <code className="bg-gray-100 px-1.5 py-0.5 rounded">quydev / Spencil@123</code></span>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="border-t pt-6">
            <div className="flex items-center justify-between text-sm text-gray-600">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded bg-gradient-to-br from-[#4DBFAD] to-[#2563B4]"></div>
                <span className="font-medium">1Pixel Team</span>
              </div>
              <span>Version 2.0.0 - MySQL Backend</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
