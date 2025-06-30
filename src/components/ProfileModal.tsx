
import React from 'react';
import { Dialog, DialogContent, DialogClose } from './ui/dialog';
import { Avatar, AvatarImage, AvatarFallback } from './ui/avatar';
import { X } from 'lucide-react';
import { Linkedin } from 'lucide-react';

interface ProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const ProfileModal: React.FC<ProfileModalProps> = ({ isOpen, onClose }) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md p-0 overflow-hidden">
        <div className="relative bg-white rounded-lg">
          <DialogClose className="absolute right-4 top-4 z-10">
            <X className="h-4 w-4" />
            <span className="sr-only">Close</span>
          </DialogClose>
          
          <div className="p-8 text-center">
            <Avatar className="w-24 h-24 mx-auto mb-4">
              <AvatarImage src="/lovable-uploads/9a90d753-14e1-45e1-8848-b1a046b78ce5.png" alt="Mohammed Ashraf Hussain" />
              <AvatarFallback>MAH</AvatarFallback>
            </Avatar>
            
            <h2 className="text-xl font-semibold text-gray-900 mb-3">
              Mohammed Ashraf Hussain
            </h2>
            
            <div className="mb-4">
              <a 
                href="https://linkedin.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center w-10 h-10 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Linkedin className="w-5 h-5" />
              </a>
            </div>
            
            <div className="text-sm text-gray-600 text-left space-y-3">
              <p>
                Hello! I'm Mohammed Ashraf Hussain, a Full Stack Developer with expertise in Java, Python, AWS, Azure, GCP, and DevOps, along with a foundational understanding of cybersecurity. I am currently pursuing a Master's degree in Computer Science, where I integrate academic learning with real-world application through hands-on projects across cloud platforms and modern development practices.
              </p>
              
              <p>
                I'm passionate about mentoring and enjoy guiding junior learners, sharing knowledge to help them achieve their goals. My strong interest in research drives me to stay updated with emerging technologies and deliver practical, impactful solutions. Beyond the world of tech, I have a creative side that finds expression in photography, where I capture the beauty of everyday life through my lens.
              </p>
              
              <p>
                One of my key projects includes an Excel-based Attendance Management System built to simplify attendance tracking for professors—this free-to-use tool automates the marking process and allows easy downloading of records, greatly enhancing classroom efficiency.
              </p>
              
              <p className="font-medium">
                Thank you for visiting.
              </p>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ProfileModal;
