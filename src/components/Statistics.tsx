import { Hosting } from '../App';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

interface StatisticsProps {
  hostings: Hosting[];
}

export function Statistics({ hostings }: StatisticsProps) {
  // Status distribution
  const statusData = [
    {
      name: 'Hoạt động',
      value: hostings.filter(h => h.status === 'active').length,
      color: '#4DBFAD'
    },
    {
      name: 'Sắp hết hạn',
      value: hostings.filter(h => h.status === 'expiring').length,
      color: '#2563B4'
    },
    {
      name: 'Đã hết hạn',
      value: hostings.filter(h => h.status === 'expired').length,
      color: '#ef4444'
    }
  ];

  // Provider distribution
  const providerMap = new Map<string, number>();
  hostings.forEach(h => {
    providerMap.set(h.provider, (providerMap.get(h.provider) || 0) + 1);
  });
  
  const providerData = Array.from(providerMap.entries()).map(([name, value]) => ({
    name,
    value
  }));

  // Cost by provider
  const costByProvider = new Map<string, number>();
  hostings.forEach(h => {
    costByProvider.set(h.provider, (costByProvider.get(h.provider) || 0) + h.price);
  });
  
  const costData = Array.from(costByProvider.entries()).map(([name, value]) => ({
    name,
    cost: value
  }));

  const COLORS = ['#4DBFAD', '#2563B4', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899'];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Thống Kê</h2>
      </div>

      {/* Status Distribution */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Phân Bố Trạng Thái
        </h3>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={statusData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
              >
                {statusData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Provider Distribution */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Số Lượng Hosting Theo Nhà Cung Cấp
        </h3>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={providerData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="value" fill="#4DBFAD" name="Số lượng" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Cost by Provider */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Chi Phí Theo Nhà Cung Cấp
        </h3>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={costData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip 
                formatter={(value: number) => `${value.toLocaleString('vi-VN')} VNĐ`}
              />
              <Legend />
              <Bar dataKey="cost" fill="#2563B4" name="Chi phí (VNĐ)" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h4 className="text-sm text-gray-600 mb-2">Chi Phí Cao Nhất</h4>
          <p className="text-2xl font-bold text-gray-900">
            {Math.max(...hostings.map(h => h.price)).toLocaleString('vi-VN')} VNĐ
          </p>
        </div>
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h4 className="text-sm text-gray-600 mb-2">Chi Phí Thấp Nhất</h4>
          <p className="text-2xl font-bold text-gray-900">
            {Math.min(...hostings.map(h => h.price)).toLocaleString('vi-VN')} VNĐ
          </p>
        </div>
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h4 className="text-sm text-gray-600 mb-2">Số Nhà Cung Cấp</h4>
          <p className="text-2xl font-bold text-gray-900">
            {providerMap.size}
          </p>
        </div>
      </div>
    </div>
  );
}