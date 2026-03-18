import { Bell, X, Server, AlertCircle, CheckCircle } from 'lucide-react';
import { Hosting } from '../App';
import { isoToVNDate } from '../utils/dateFormat';

interface NotificationsProps {
  hostings: Hosting[];
}

export function Notifications({ hostings }: NotificationsProps) {
  const getDaysRemaining = (expirationDate: string) => {
    const today = new Date();
    const expDate = new Date(expirationDate);
    const days = Math.ceil((expDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
    return days;
  };

  const expiringHostings = hostings.filter(h => h.status === 'expiring');
  const expiredHostings = hostings.filter(h => h.status === 'expired');

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Thông Báo</h2>
      </div>

      {/* Expired Hostings */}
      {expiredHostings.length > 0 && (
        <div className="bg-red-50 border-2 border-red-200 rounded-lg p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="bg-red-100 p-2 rounded-lg">
              <AlertCircle className="w-5 h-5 text-red-600" />
            </div>
            <h3 className="font-semibold text-red-900">
              Hosting Đã Hết Hạn ({expiredHostings.length})
            </h3>
          </div>
          <div className="space-y-3">
            {expiredHostings.map((hosting) => (
              <div
                key={hosting.id}
                className="bg-white rounded-lg p-4 border border-red-200"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <h4 className="font-medium text-gray-900">{hosting.name}</h4>
                    <p className="text-sm text-gray-600">{hosting.domain}</p>
                  </div>
                  <span className="text-sm font-medium text-red-600">
                    Quá hạn {Math.abs(getDaysRemaining(hosting.expirationDate))} ngày
                  </span>
                </div>
                <div className="flex items-center gap-2 mt-2 text-sm text-gray-600">
                  <Server className="w-4 h-4" />
                  <span>Hết hạn: {isoToVNDate(hosting.expirationDate)}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Expiring Soon */}
      {expiringHostings.length > 0 && (
        <div className="bg-orange-50 border-2 border-orange-200 rounded-lg p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="bg-orange-100 p-2 rounded-lg">
              <AlertCircle className="w-5 h-5 text-orange-600" />
            </div>
            <h3 className="font-semibold text-orange-900">
              Hosting Sắp Hết Hạn ({expiringHostings.length})
            </h3>
          </div>
          <div className="space-y-3">
            {expiringHostings.map((hosting) => (
              <div
                key={hosting.id}
                className="bg-white rounded-lg p-4 border border-orange-200"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <h4 className="font-medium text-gray-900">{hosting.name}</h4>
                    <p className="text-sm text-gray-600">{hosting.domain}</p>
                  </div>
                  <span className="text-sm font-medium text-orange-600">
                    Còn {getDaysRemaining(hosting.expirationDate)} ngày
                  </span>
                </div>
                <div className="flex items-center gap-2 mt-2 text-sm text-gray-600">
                  <Server className="w-4 h-4" />
                  <span>Hết hạn: {isoToVNDate(hosting.expirationDate)}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* All Good */}
      {expiredHostings.length === 0 && expiringHostings.length === 0 && (
        <div className="bg-gradient-to-br from-[#4DBFAD]/10 to-[#2563B4]/10 border-2 border-[#4DBFAD]/30 rounded-lg p-6">
          <div className="flex items-center gap-3">
            <div className="bg-gradient-to-br from-[#4DBFAD] to-[#2563B4] p-2 rounded-lg">
              <CheckCircle className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">
                Tất Cả Đều Ổn!
              </h3>
              <p className="text-sm text-gray-700 mt-1">
                Không có hosting nào cần chú ý trong thời gian tới
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}