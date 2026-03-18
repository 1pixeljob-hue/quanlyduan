import { X, AlertTriangle, Calendar } from 'lucide-react';
import { Hosting } from '../App';
import { Project } from './ProjectList';
import { formatDateVN } from '../utils/dateFormat';

interface NotificationPanelProps {
  hostings: Hosting[];
  projects: Project[];
  onClose: () => void;
  onHostingClick: (hosting: Hosting) => void;
  onProjectClick: (project: Project) => void;
}

export function NotificationPanel({ 
  hostings, 
  projects, 
  onClose, 
  onHostingClick,
  onProjectClick 
}: NotificationPanelProps) {
  // Calculate notifications
  const expiredHostings = hostings.filter(h => h.status === 'expired');
  const expiringHostings = hostings.filter(h => h.status === 'expiring');
  
  const expiredProjects = projects.filter(p => p.status === 'expired');
  const expiringProjects = projects.filter(p => p.status === 'expiring');

  const totalCount = 
    expiredHostings.length + 
    expiringHostings.length + 
    expiredProjects.length + 
    expiringProjects.length;

  return (
    <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-start justify-end p-4 z-50">
      <div className="bg-white rounded-lg shadow-2xl w-full max-w-md max-h-[90vh] overflow-hidden mt-16 mr-4">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-gradient-to-r from-[#4DBFAD]/10 to-[#2563B4]/10">
          <div className="flex items-center gap-2">
            <div className="bg-gradient-to-br from-[#4DBFAD] to-[#2563B4] p-2 rounded-lg">
              <AlertTriangle className="w-5 h-5 text-white" />
            </div>
            <h2 className="text-lg font-bold text-gray-900">
              Thông Báo
              {totalCount > 0 && (
                <span className="ml-2 text-sm bg-red-500 text-white px-2 py-0.5 rounded-full">
                  {totalCount}
                </span>
              )}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="overflow-y-auto max-h-[calc(90vh-80px)]">
          {totalCount === 0 ? (
            <div className="p-8 text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <svg className="w-8 h-8 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <p className="text-gray-500 font-medium">Không có thông báo nào</p>
              <p className="text-sm text-gray-400 mt-1">Tất cả đều ổn! ✨</p>
            </div>
          ) : (
            <div className="p-4 space-y-3">
              {/* Expired Hostings */}
              {expiredHostings.map(hosting => (
                <button
                  key={`hosting-expired-${hosting.id}`}
                  onClick={() => {
                    onHostingClick(hosting);
                    onClose();
                  }}
                  className="w-full text-left p-3 bg-red-50 border border-red-200 rounded-lg hover:bg-red-100 transition-colors"
                >
                  <div className="flex items-start gap-3">
                    <div className="bg-red-500 p-1.5 rounded-lg mt-0.5">
                      <AlertTriangle className="w-4 h-4 text-white" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-red-900 text-sm mb-1">
                        Hosting đã hết hạn
                      </p>
                      <p className="text-sm text-red-700 font-medium mb-1">
                        {hosting.name}
                      </p>
                      <div className="flex items-center gap-1 text-xs text-red-600">
                        <Calendar className="w-3 h-3" />
                        <span>Hết hạn: {formatDateVN(hosting.expirationDate)}</span>
                      </div>
                    </div>
                  </div>
                </button>
              ))}

              {/* Expiring Hostings */}
              {expiringHostings.map(hosting => (
                <button
                  key={`hosting-expiring-${hosting.id}`}
                  onClick={() => {
                    onHostingClick(hosting);
                    onClose();
                  }}
                  className="w-full text-left p-3 bg-orange-50 border border-orange-200 rounded-lg hover:bg-orange-100 transition-colors"
                >
                  <div className="flex items-start gap-3">
                    <div className="bg-orange-500 p-1.5 rounded-lg mt-0.5">
                      <AlertTriangle className="w-4 h-4 text-white" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-orange-900 text-sm mb-1">
                        Hosting sắp hết hạn
                      </p>
                      <p className="text-sm text-orange-700 font-medium mb-1">
                        {hosting.name}
                      </p>
                      <div className="flex items-center gap-1 text-xs text-orange-600">
                        <Calendar className="w-3 h-3" />
                        <span>Hết hạn: {formatDateVN(hosting.expirationDate)}</span>
                      </div>
                    </div>
                  </div>
                </button>
              ))}

              {/* Expired Projects */}
              {expiredProjects.map(project => (
                <button
                  key={`project-expired-${project.id}`}
                  onClick={() => {
                    onProjectClick(project);
                    onClose();
                  }}
                  className="w-full text-left p-3 bg-red-50 border border-red-200 rounded-lg hover:bg-red-100 transition-colors"
                >
                  <div className="flex items-start gap-3">
                    <div className="bg-red-500 p-1.5 rounded-lg mt-0.5">
                      <AlertTriangle className="w-4 h-4 text-white" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-red-900 text-sm mb-1">
                        Project đã hết hạn
                      </p>
                      <p className="text-sm text-red-700 font-medium mb-1">
                        {project.name}
                      </p>
                      <div className="flex items-center gap-1 text-xs text-red-600">
                        <Calendar className="w-3 h-3" />
                        <span>Khách hàng: {project.customer}</span>
                      </div>
                    </div>
                  </div>
                </button>
              ))}

              {/* Expiring Projects */}
              {expiringProjects.map(project => (
                <button
                  key={`project-expiring-${project.id}`}
                  onClick={() => {
                    onProjectClick(project);
                    onClose();
                  }}
                  className="w-full text-left p-3 bg-orange-50 border border-orange-200 rounded-lg hover:bg-orange-100 transition-colors"
                >
                  <div className="flex items-start gap-3">
                    <div className="bg-orange-500 p-1.5 rounded-lg mt-0.5">
                      <AlertTriangle className="w-4 h-4 text-white" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-orange-900 text-sm mb-1">
                        Project sắp hết hạn
                      </p>
                      <p className="text-sm text-orange-700 font-medium mb-1">
                        {project.name}
                      </p>
                      <div className="flex items-center gap-1 text-xs text-orange-600">
                        <Calendar className="w-3 h-3" />
                        <span>Khách hàng: {project.customer}</span>
                      </div>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
