import { useEffect, useState } from 'react';
import { CheckCircle2, XCircle, AlertTriangle, Info, X } from 'lucide-react';

export type ToastType = 'success' | 'error' | 'warning' | 'info';

export interface ToastProps {
  id: string;
  type: ToastType;
  message: string;
  duration?: number;
  onClose: (id: string) => void;
}

export function Toast({ id, type, message, duration = 3000, onClose }: ToastProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [isLeaving, setIsLeaving] = useState(false);

  useEffect(() => {
    // Enter animation
    setTimeout(() => setIsVisible(true), 10);

    // Auto dismiss
    const timer = setTimeout(() => {
      handleClose();
    }, duration);

    return () => clearTimeout(timer);
  }, [duration]);

  const handleClose = () => {
    setIsLeaving(true);
    setIsVisible(false);
    setTimeout(() => onClose(id), 300);
  };

  const typeConfig = {
    success: {
      icon: CheckCircle2,
      bgColor: 'bg-white',
      iconColor: 'text-green-600',
      iconBg: 'bg-green-100',
      borderColor: 'border-green-200',
      progressColor: 'bg-green-600'
    },
    error: {
      icon: XCircle,
      bgColor: 'bg-white',
      iconColor: 'text-red-600',
      iconBg: 'bg-red-100',
      borderColor: 'border-red-200',
      progressColor: 'bg-red-600'
    },
    warning: {
      icon: AlertTriangle,
      bgColor: 'bg-white',
      iconColor: 'text-amber-600',
      iconBg: 'bg-amber-100',
      borderColor: 'border-amber-200',
      progressColor: 'bg-amber-600'
    },
    info: {
      icon: Info,
      bgColor: 'bg-white',
      iconColor: 'text-blue-600',
      iconBg: 'bg-blue-100',
      borderColor: 'border-blue-200',
      progressColor: 'bg-blue-600'
    }
  };

  const config = typeConfig[type];
  const Icon = config.icon;

  return (
    <div
      className={`${config.bgColor} rounded-xl shadow-2xl border-2 ${config.borderColor} overflow-hidden min-w-[320px] max-w-md transform transition-all duration-300 ${
        isVisible && !isLeaving ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'
      }`}
    >
      <div className="flex items-start gap-3 p-4">
        <div className={`${config.iconBg} rounded-full p-2 flex-shrink-0`}>
          <Icon className={`w-5 h-5 ${config.iconColor}`} />
        </div>
        <p className="text-gray-800 flex-1 pt-1 pr-2">{message}</p>
        <button
          onClick={handleClose}
          className="text-gray-400 hover:text-gray-600 transition-colors flex-shrink-0"
        >
          <X className="w-5 h-5" />
        </button>
      </div>
      
      {/* Progress bar */}
      <div className="h-1 bg-gray-100">
        <div
          className={`h-full ${config.progressColor} transition-all ease-linear`}
          style={{
            width: isVisible ? '0%' : '100%',
            transitionDuration: `${duration}ms`
          }}
        />
      </div>
    </div>
  );
}

// Toast Container
export interface ToastContainerProps {
  toasts: Array<{ id: string; type: ToastType; message: string; duration?: number }>;
  onClose: (id: string) => void;
}

export function ToastContainer({ toasts, onClose }: ToastContainerProps) {
  return (
    <div className="fixed top-4 right-4 z-[300] flex flex-col gap-3 pointer-events-none">
      <div className="pointer-events-auto space-y-3">
        {toasts.map((toast) => (
          <Toast
            key={toast.id}
            id={toast.id}
            type={toast.type}
            message={toast.message}
            duration={toast.duration}
            onClose={onClose}
          />
        ))}
      </div>
    </div>
  );
}
