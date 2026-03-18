import { useState } from "react";
import { Database, Server, CheckCircle, XCircle, RefreshCw, AlertTriangle } from "lucide-react";
import * as api from "../utils/api";

interface ConnectionStatus {
  health: boolean;
  hostings: number;
  projects: number;
  passwords: number;
  categories: number;
  codex: number;
  logs: number;
  error?: string;
  apiUrl?: string;
}

export function DebugPanel() {
  const [status, setStatus] = useState<ConnectionStatus | null>(null);
  const [isChecking, setIsChecking] = useState(false);
  const [showDetails, setShowDetails] = useState(false);

  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

  const checkConnection = async () => {
    setIsChecking(true);
    setStatus(null);

    try {
      // 1. Check health endpoint
      const healthResult = await api.healthApi.check();

      if (!healthResult.success) {
        throw new Error('Health check failed');
      }

      // 2. Check all modules
      const [hostings, projects, passwords, categories, codexItems, logs] =
        await Promise.all([
          api.hostingApi.getAll().catch(() => []),
          api.projectApi.getAll().catch(() => []),
          api.passwordApi.getAll().catch(() => []),
          api.categoryApi.getAll().catch(() => []),
          api.codexApi.getAll().catch(() => []),
          api.logApi.getAll().catch(() => []),
        ]);

      setStatus({
        health: true,
        hostings: hostings.length,
        projects: projects.length,
        passwords: passwords.length,
        categories: categories.length,
        codex: codexItems.length,
        logs: logs.length,
        apiUrl: API_URL,
      });
    } catch (error) {
      console.error("Connection check failed:", error);
      setStatus({
        health: false,
        hostings: 0,
        projects: 0,
        passwords: 0,
        categories: 0,
        codex: 0,
        logs: 0,
        error: error instanceof Error ? error.message : "Unknown error",
        apiUrl: API_URL,
      });
    } finally {
      setIsChecking(false);
    }
  };

  return (
    <div className="bg-white rounded-lg border-2 border-gray-200 mt-6 overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-[#4DBFAD] to-[#2563B4] text-white px-6 py-4">
        <div className="flex items-center gap-3">
          <Database className="w-6 h-6" />
          <h3 className="text-lg font-bold">Backend Debug Panel</h3>
        </div>
      </div>

      {/* Content */}
      <div className="p-6 space-y-6">
        {/* Backend Info */}
        <div className="bg-gray-50 rounded-lg p-4 space-y-2">
          <h3 className="font-semibold text-gray-700 flex items-center gap-2">
            <Server className="w-4 h-4" />
            Thông tin kết nối Backend
          </h3>
          <div className="text-sm space-y-1">
            <div className="flex justify-between">
              <span className="text-gray-600">API URL:</span>
              <code className="bg-white px-2 py-1 rounded text-xs truncate max-w-xs">
                {API_URL}
              </code>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Database:</span>
              <code className="bg-white px-2 py-1 rounded text-xs">
                MySQL
              </code>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Môi trường:</span>
              <span className="text-xs font-medium">
                {API_URL.includes('localhost') ? '🟡 Development' : '🟢 Production'}
              </span>
            </div>
          </div>
        </div>

        {/* Check Button */}
        <button
          onClick={checkConnection}
          disabled={isChecking}
          className="w-full bg-gradient-to-r from-[#4DBFAD] to-[#2563B4] text-white px-6 py-3 rounded-lg font-medium hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          <RefreshCw className={`w-5 h-5 ${isChecking ? "animate-spin" : ""}`} />
          {isChecking ? "Đang kiểm tra..." : "Kiểm tra kết nối"}
        </button>

        {/* Status Display */}
        {status && (
          <div className="space-y-4">
            {/* Overall Status */}
            <div
              className={`p-4 rounded-lg flex items-center gap-3 ${
                status.health
                  ? "bg-green-50 border-2 border-green-200"
                  : "bg-red-50 border-2 border-red-200"
              }`}
            >
              {status.health ? (
                <>
                  <CheckCircle className="w-6 h-6 text-green-600" />
                  <div>
                    <p className="font-semibold text-green-900">
                      Kết nối thành công!
                    </p>
                    <p className="text-sm text-green-700">
                      Backend và MySQL database đang hoạt động bình thường
                    </p>
                  </div>
                </>
              ) : (
                <>
                  <AlertTriangle className="w-6 h-6 text-red-600" />
                  <div className="flex-1">
                    <p className="font-semibold text-red-900">
                      Kết nối thất bại!
                    </p>
                    <p className="text-sm text-red-700">{status.error}</p>
                  </div>
                </>
              )}
            </div>

            {/* Module Statistics */}
            {status.health && (
              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="font-semibold text-gray-700 mb-3">
                  Thống kê dữ liệu
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  <StatCard
                    label="Hostings"
                    count={status.hostings}
                    color="blue"
                  />
                  <StatCard
                    label="Projects"
                    count={status.projects}
                    color="purple"
                  />
                  <StatCard
                    label="Passwords"
                    count={status.passwords}
                    color="pink"
                  />
                  <StatCard
                    label="Categories"
                    count={status.categories}
                    color="green"
                  />
                  <StatCard
                    label="CodeX"
                    count={status.codex}
                    color="orange"
                  />
                  <StatCard label="Logs" count={status.logs} color="gray" />
                </div>
              </div>
            )}

            {/* Instructions */}
            {!status.health && (
              <div className="bg-yellow-50 border-2 border-yellow-200 rounded-lg p-4">
                <h3 className="font-semibold text-yellow-900 mb-2 flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4" />
                  Hướng dẫn khắc phục
                </h3>
                <ol className="text-sm text-yellow-800 space-y-2 list-decimal list-inside">
                  <li>Kiểm tra backend đã được khởi động chưa</li>
                  <li>Xác nhận MySQL database đã được setup</li>
                  <li>Kiểm tra file <code className="bg-white px-1 rounded">.env</code> trong thư mục backend</li>
                  <li>Đảm bảo biến <code className="bg-white px-1 rounded">DATABASE_URL</code> đúng</li>
                  <li>Kiểm tra firewall/CORS settings</li>
                  <li>Refresh trang này và thử lại</li>
                </ol>
              </div>
            )}
          </div>
        )}

        {/* Setup Info */}
        <div className="bg-blue-50 border-2 border-blue-200 rounded-lg p-4">
          <h3 className="font-semibold text-blue-900 mb-2">
            📄 Backend Setup
          </h3>
          <p className="text-sm text-blue-800 mb-3">
            Hệ thống sử dụng Node.js Express backend với MySQL database.
            Để setup backend:
          </p>
          <ol className="text-xs text-blue-700 space-y-1 list-decimal list-inside">
            <li>Cài đặt MySQL và tạo database</li>
            <li>Tạo file <code className="bg-white px-1 rounded">.env</code> trong thư mục backend</li>
            <li>Thêm <code className="bg-white px-1 rounded">DATABASE_URL</code> connection string</li>
            <li>Chạy <code className="bg-white px-1 rounded">npm install</code> trong thư mục backend</li>
            <li>Chạy <code className="bg-white px-1 rounded">npm start</code> để khởi động server</li>
          </ol>
        </div>
      </div>
    </div>
  );
}

function StatCard({
  label,
  count,
  color,
}: {
  label: string;
  count: number;
  color: string;
}) {
  const colors: Record<string, string> = {
    blue: "bg-blue-100 text-blue-700 border-blue-300",
    purple: "bg-purple-100 text-purple-700 border-purple-300",
    pink: "bg-pink-100 text-pink-700 border-pink-300",
    green: "bg-green-100 text-green-700 border-green-300",
    orange: "bg-orange-100 text-orange-700 border-orange-300",
    gray: "bg-gray-100 text-gray-700 border-gray-300",
  };

  return (
    <div
      className={`${colors[color]} border-2 rounded-lg p-3 text-center transition-all hover:shadow-md`}
    >
      <div className="text-2xl font-bold">{count}</div>
      <div className="text-xs font-medium">{label}</div>
    </div>
  );
}