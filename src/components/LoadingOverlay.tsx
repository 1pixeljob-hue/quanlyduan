import { LoadingDuck } from './LoadingDuck';

interface LoadingOverlayProps {
  message?: string;
}

export function LoadingOverlay({ message = 'Đang xử lý...' }: LoadingOverlayProps) {
  return (
    <div className="fixed inset-0 bg-gradient-to-br from-white/95 via-[#4DBFAD]/10 to-[#2563B4]/10 backdrop-blur-md z-[100] flex items-center justify-center">
      <div className="p-8 max-w-md w-full mx-4">
        <LoadingDuck message={message} size="lg" />
      </div>
    </div>
  );
}