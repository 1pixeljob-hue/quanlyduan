import { useEffect, useState } from 'react';
import { CheckCircle2, XCircle, AlertTriangle, Info, X } from 'lucide-react';

export type DialogType = 'success' | 'error' | 'warning' | 'info' | 'confirm';

export interface DialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm?: () => void;
  type?: DialogType;
  title?: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  showCancel?: boolean;
}

export function Dialog({
  isOpen,
  onClose,
  onConfirm,
  type = 'info',
  title,
  message,
  confirmText = 'Đồng ý',
  cancelText = 'Hủy',
  showCancel = false
}: DialogProps) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setIsVisible(true);
    }
  }, [isOpen]);

  const handleClose = () => {
    setIsVisible(false);
    setTimeout(onClose, 200);
  };

  const handleConfirm = () => {
    if (onConfirm) {
      onConfirm();
    }
    handleClose();
  };

  if (!isOpen) return null;

  const typeConfig = {
    success: {
      icon: CheckCircle2,
      bgColor: 'bg-gradient-to-br from-green-50 to-emerald-50',
      iconColor: 'text-green-600',
      iconBg: 'bg-green-100',
      borderColor: 'border-green-200',
      buttonColor: 'bg-green-600 hover:bg-green-700',
      title: title || 'Thành công'
    },
    error: {
      icon: XCircle,
      bgColor: 'bg-gradient-to-br from-red-50 to-rose-50',
      iconColor: 'text-red-600',
      iconBg: 'bg-red-100',
      borderColor: 'border-red-200',
      buttonColor: 'bg-red-600 hover:bg-red-700',
      title: title || 'Lỗi'
    },
    warning: {
      icon: AlertTriangle,
      bgColor: 'bg-gradient-to-br from-amber-50 to-yellow-50',
      iconColor: 'text-amber-600',
      iconBg: 'bg-amber-100',
      borderColor: 'border-amber-200',
      buttonColor: 'bg-amber-600 hover:bg-amber-700',
      title: title || 'Cảnh báo'
    },
    info: {
      icon: Info,
      bgColor: 'bg-gradient-to-br from-blue-50 to-sky-50',
      iconColor: 'text-blue-600',
      iconBg: 'bg-blue-100',
      borderColor: 'border-blue-200',
      buttonColor: 'bg-blue-600 hover:bg-blue-700',
      title: title || 'Thông báo'
    },
    confirm: {
      icon: AlertTriangle,
      bgColor: 'bg-gradient-to-br from-[#4DBFAD]/10 to-[#2563B4]/10',
      iconColor: 'text-[#2563B4]',
      iconBg: 'bg-[#4DBFAD]/20',
      borderColor: 'border-[#4DBFAD]',
      buttonColor: 'bg-gradient-to-r from-[#4DBFAD] to-[#2563B4] hover:opacity-90',
      title: title || 'Xác nhận'
    }
  };

  const config = typeConfig[type];
  const Icon = config.icon;

  return (
    <div className={`fixed inset-0 z-[200] flex items-center justify-center p-4 transition-all duration-200 ${
      isVisible ? 'opacity-100' : 'opacity-0'
    }`}>
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={handleClose}
      />

      {/* Dialog */}
      <div className={`relative bg-white rounded-2xl shadow-2xl max-w-md w-full border-2 ${config.borderColor} transform transition-all duration-200 ${
        isVisible ? 'scale-100 translate-y-0' : 'scale-95 translate-y-4'
      }`}>
        {/* Close button */}
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header with icon */}
        <div className={`${config.bgColor} rounded-t-2xl px-6 pt-6 pb-4`}>
          <div className="flex items-start gap-4">
            <div className={`${config.iconBg} rounded-full p-3 flex-shrink-0`}>
              <Icon className={`w-6 h-6 ${config.iconColor}`} />
            </div>
            <div className="flex-1 pt-1">
              <h3 className="text-xl font-bold text-gray-900 mb-1">{config.title}</h3>
            </div>
          </div>
        </div>

        {/* Body */}
        <div className="px-6 py-6">
          <p className="text-gray-700 leading-relaxed whitespace-pre-line">{message}</p>
        </div>

        {/* Footer */}
        <div className="px-6 pb-6 flex gap-3 justify-end">
          {(showCancel || type === 'confirm') && (
            <button
              onClick={handleClose}
              className="px-6 py-2.5 rounded-lg border-2 border-gray-300 text-gray-700 font-medium hover:bg-gray-50 transition-colors"
            >
              {cancelText}
            </button>
          )}
          <button
            onClick={handleConfirm}
            className={`px-6 py-2.5 rounded-lg text-white font-medium transition-all ${config.buttonColor}`}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}
