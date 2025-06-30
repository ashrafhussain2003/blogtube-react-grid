
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
        return 'h-48 w-full'; // Standardized square size
      default:
        return 'h-24 w-full'; // Standardized horizontal size
    }
  };

  const getAdSize = () => {
    switch (type) {
      case 'vertical':
        return '300x400';
      case 'square':
        return '300x200';
      default:
        return '300x100';
    }
  };

  return (
    <div className={`${getAdDimensions()} bg-gray-50 border border-gray-200 rounded flex items-center justify-center ${className}`}>
      <div className="text-center">
        <div className="text-gray-400 text-sm font-medium mb-1">Advertisement</div>
        <div className="text-gray-300 text-xs">
          {getAdSize()}
        </div>
      </div>
    </div>
  );
};

export default AdBanner;
