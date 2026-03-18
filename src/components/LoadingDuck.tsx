import { useEffect, useState } from 'react';
import duckImage from 'figma:asset/5fb43a64f998e493a4d097598f9bf7227e03e9bd.png';

interface LoadingDuckProps {
  message?: string;
  size?: 'sm' | 'md' | 'lg';
  fullscreen?: boolean;
}

export function LoadingDuck({ 
  message = 'Đang xử lý...', 
  size = 'md',
  fullscreen = false 
}: LoadingDuckProps) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) return 0; // Reset to loop
        return prev + 1; // Increase by 1% each interval - smoother
      });
    }, 30); // Update every 30ms for smoother animation
    
    return () => clearInterval(interval);
  }, []);

  // Size configs
  const barWidths = {
    sm: 'w-64',
    md: 'w-80',
    lg: 'w-96'
  };

  const duckSizes = {
    sm: 'w-10 h-10',
    md: 'w-12 h-12',
    lg: 'w-16 h-16'
  };

  const duckContent = (
    <div className="flex flex-col items-center justify-center gap-4">
      {/* Duck on Progress Bar */}
      <div className={`relative ${barWidths[size]}`}>
        {/* Duck - positioned above the bar */}
        <div 
          className="absolute -top-2 transition-all duration-100 ease-linear"
          style={{ 
            left: `calc(${progress}% - 1.5rem)`,
            transform: 'translateY(-100%)'
          }}
        >
          <img 
            src={duckImage} 
            alt="Loading Duck"
            className={`${duckSizes[size]} object-contain animate-waddle`}
            style={{ filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.2))' }}
          />
        </div>

        {/* Progress Bar Container */}
        <div className="w-full h-6 bg-[#B8E6F0] rounded-full overflow-hidden border-2 border-[#2563B4]">
          {/* Progress Fill */}
          <div 
            className="h-full bg-gradient-to-r from-[#2563B4] to-[#4DBFAD] transition-all duration-100 ease-linear rounded-full"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Loading Text */}
      <div className="text-center mt-2">
        <p className="text-[#2563B4] font-bold tracking-wider text-sm">
          {message?.toUpperCase() || 'LOADING'}
        </p>
      </div>
    </div>
  );

  if (fullscreen) {
    return (
      <div className="fixed inset-0 bg-white/95 backdrop-blur-sm z-50 flex items-center justify-center">
        {duckContent}
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center p-8">
      {duckContent}
    </div>
  );
}

// Inline Loading (cho buttons) - giữ nguyên style cũ
export function LoadingDuckInline({ size = 'sm' }: { size?: 'sm' | 'md' }) {
  const sizeClasses = {
    sm: 'w-5 h-5',
    md: 'w-6 h-6'
  };

  return (
    <img 
      src={duckImage} 
      alt="Loading"
      className={`${sizeClasses[size]} animate-bounce inline-block object-contain`}
      style={{ filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.2))' }}
    />
  );
}