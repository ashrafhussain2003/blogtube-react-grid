
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Avatar, AvatarImage, AvatarFallback } from './ui/avatar';
import ProfileModal from './ProfileModal';

interface NavigationProps {
  showBackButton?: boolean;
  backLink?: string;
  backText?: string;
  title?: string;
  showAvatar?: boolean;
}

const Navigation: React.FC<NavigationProps> = ({ 
  showBackButton = false, 
  backLink = "/", 
  backText = "Back", 
  title,
  showAvatar = true 
}) => {
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  return (
    <>
      <header className="bg-white/80 backdrop-blur-md border-b border-gray-200 sticky top-0 z-40 shadow-sm">
        <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              {showBackButton && (
                <Link
                  to={backLink}
                  className="flex items-center gap-2 text-blue-600 hover:text-blue-800 transition-colors"
                >
                  <span className="font-medium">{backText}</span>
                </Link>
              )}
              {title && (
                <h1 className="text-xl font-bold text-gray-900">{title}</h1>
              )}
            </div>
            
            <div className="flex items-center gap-4">
              <Link to="/" className="text-2xl font-bold text-blue-600">
                BlogTube
              </Link>
              
              {showAvatar && (
                <button
                  onClick={() => setIsProfileOpen(true)}
                  className="rounded-full hover:ring-2 hover:ring-blue-200 transition-all"
                >
                  <Avatar className="w-10 h-10">
                    <AvatarImage src="/lovable-uploads/9a90d753-14e1-45e1-8848-b1a046b78ce5.png" alt="Profile" />
                    <AvatarFallback>MAH</AvatarFallback>
                  </Avatar>
                </button>
              )}
            </div>
          </div>
        </div>
      </header>

      <ProfileModal 
        isOpen={isProfileOpen} 
        onClose={() => setIsProfileOpen(false)} 
      />
    </>
  );
};

export default Navigation;
