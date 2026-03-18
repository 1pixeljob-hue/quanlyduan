import { useState, useCallback } from 'react';
import { Dialog, DialogType } from '../components/Dialog';

interface DialogConfig {
  type?: DialogType;
  title?: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  onConfirm?: () => void;
}

export function useDialog() {
  const [dialogConfig, setDialogConfig] = useState<DialogConfig | null>(null);
  const [isOpen, setIsOpen] = useState(false);

  const showDialog = useCallback((config: DialogConfig) => {
    setDialogConfig(config);
    setIsOpen(true);
  }, []);

  const hideDialog = useCallback(() => {
    setIsOpen(false);
    setTimeout(() => setDialogConfig(null), 200);
  }, []);

  // Helper methods
  const alert = useCallback((message: string, type: DialogType = 'info', title?: string) => {
    showDialog({
      type,
      title,
      message,
      confirmText: 'Đóng'
    });
  }, [showDialog]);

  const confirm = useCallback((
    message: string,
    onConfirm: () => void,
    options?: { title?: string; confirmText?: string; cancelText?: string }
  ): Promise<boolean> => {
    return new Promise((resolve) => {
      showDialog({
        type: 'confirm',
        title: options?.title,
        message,
        confirmText: options?.confirmText || 'Xác nhận',
        cancelText: options?.cancelText || 'Hủy',
        onConfirm: () => {
          onConfirm();
          resolve(true);
        }
      });
    });
  }, [showDialog]);

  const success = useCallback((message: string, title?: string) => {
    alert(message, 'success', title);
  }, [alert]);

  const error = useCallback((message: string, title?: string) => {
    alert(message, 'error', title);
  }, [alert]);

  const warning = useCallback((message: string, title?: string) => {
    alert(message, 'warning', title);
  }, [alert]);

  const DialogComponent = dialogConfig ? (
    <Dialog
      isOpen={isOpen}
      onClose={hideDialog}
      onConfirm={dialogConfig.onConfirm}
      type={dialogConfig.type}
      title={dialogConfig.title}
      message={dialogConfig.message}
      confirmText={dialogConfig.confirmText}
      cancelText={dialogConfig.cancelText}
      showCancel={dialogConfig.type === 'confirm'}
    />
  ) : null;

  return {
    DialogComponent,
    showDialog,
    hideDialog,
    alert,
    confirm,
    success,
    error,
    warning
  };
}
