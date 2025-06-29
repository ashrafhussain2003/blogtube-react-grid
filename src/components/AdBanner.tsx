
import React from 'react';

interface AdBannerProps {
  type?: 'horizontal' | 'vertical' | 'square';
  className?: string;
}

const AdBanner: React.FC<AdBannerProps> = ({ type = 'horizontal', className = '' }) => {
  const getAdDimensions = () => {
    switch (type) {
      case 'vertical':
        return 'h-96 w-full';
      case 'square':
        return 'h-64 w-64';
      default:
        return 'h-24 w-full';
    }
  };

  return (
    <div className={`${getAdDimensions()} bg-gray-50 border border-gray-200 rounded flex items-center justify-center ${className}`}>
      <div className="text-center">
        <div className="text-gray-400 text-sm font-medium mb-1">Advertisement</div>
        <div className="text-gray-300 text-xs">
          {type === 'horizontal' ? '728x90' : type === 'vertical' ? '300x250' : '250x250'}
        </div>
      </div>
    </div>
  );
};

export default AdBanner;
