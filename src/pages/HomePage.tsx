import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Hash, TrendingUp, Eye, Clock, User, Calendar, Brain, Monitor, Code, Settings, Cloud, Database, Smartphone, Palette } from 'lucide-react';
import BlogCard from '../components/BlogCard';
import SearchBar from '../components/SearchBar';
import ProfileModal from '../components/ProfileModal';
import { Avatar, AvatarImage, AvatarFallback } from '../components/ui/avatar';
import { sampleBlogs } from '../data/sampleBlogs';
import { BlogMeta } from '../types/blog';

const HomePage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredBlogs, setFilteredBlogs] = useState(sampleBlogs);
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  const handleSearch = (results: BlogMeta[]) => {
    setFilteredBlogs(results);
  };

  const topViewedBlogs = useMemo(() => {
    return [...sampleBlogs]
      .sort((a, b) => (b.viewCount || 0) - (a.viewCount || 0))
      .slice(0, 3);
  }, []);

  const getTopicIcon = (hashtag: string) => {
    const topic = hashtag.toLowerCase();
    switch (topic) {
      case 'javascript':
      case 'react':
      case 'vue':
      case 'angular':
      case 'frontend':
        return Monitor;
      case 'backend':
      case 'api':
      case 'nodejs':
        return Code;
      case 'ml':
      case 'ai':
      case 'machinelearning':
        return Brain;
      case 'aws':
      case 'azure':
      case 'gcp':
      case 'cloud':
        return Cloud;
      case 'database':
      case 'sql':
      case 'mongodb':
        return Database;
      case 'mobile':
      case 'android':
      case 'ios':
        return Smartphone;
      case 'design':
      case 'ui':
      case 'ux':
        return Palette;
      case 'devops':
      case 'docker':
      case 'kubernetes':
        return Settings;
      default:
        return Hash;
    }
  };

  const allHashtags = useMemo(() => {
    const hashtagMap: { [key: string]: number } = {};
    sampleBlogs.forEach(blog => {
      blog.hashtags.forEach(tag => {
        const lowerTag = tag.toLowerCase();
        hashtagMap[lowerTag] = (hashtagMap[lowerTag] || 0) + 1;
      });
    });

    return Object.entries(hashtagMap)
      .map(([hashtag, count]) => ({ hashtag, count }))
      .sort((a, b) => b.count - a.count);
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Hero Section */}
        <div className="text-center mb-12 relative">
          {/* Avatar in top right corner */}
          <div className="absolute top-0 right-0">
            <button
              onClick={() => setIsProfileOpen(true)}
              className="rounded-full hover:ring-2 hover:ring-blue-200 transition-all"
            >
              <Avatar className="w-10 h-10">
                <AvatarImage src="/lovable-uploads/9a90d753-14e1-45e1-8848-b1a046b78ce5.png" alt="Profile" />
                <AvatarFallback>MAH</AvatarFallback>
              </Avatar>
            </button>
          </div>

          <h1 className="text-5xl font-bold text-gray-900 mb-4">
            Welcome to <span className="text-blue-600">BlogTube</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            Discover amazing content across various topics
          </p>
          
          {/* Centered Search Bar */}
          <div className="flex justify-center">
            <SearchBar onSearch={handleSearch} />
          </div>
        </div>

        {/* Most Viewed Section */}
        <div className="mb-12">
          <div className="flex items-center gap-2 mb-6">
            <TrendingUp className="w-6 h-6 text-red-500" />
            <h2 className="text-2xl font-bold text-gray-900">Most Viewed</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {topViewedBlogs.map(blog => (
              <BlogCard key={blog.slug} blog={blog} />
            ))}
          </div>
        </div>

        {/* Hashtags Section */}
        <div className="mb-12">
          <div className="flex items-center gap-2 mb-6">
            <Hash className="w-6 h-6 text-blue-600" />
            <h2 className="text-2xl font-bold text-gray-900">Browse by Topics</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {allHashtags.map(({ hashtag, count }) => {
              const IconComponent = getTopicIcon(hashtag);
              return (
                <BlogCard
                  key={hashtag}
                  blog={{
                    title: `#${hashtag}`,
                    description: `${count} articles`,
                    author: 'Various Authors',
                    publishedDate: new Date().toISOString(),
                    readingTime: 0,
                    hashtags: [hashtag],
                    slug: hashtag,
                    viewCount: count
                  }}
                  className="cursor-pointer"
                />
              );
            })}
          </div>
        </div>

        {/* All Blogs Section */}
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-6">All Blogs</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredBlogs.map(blog => (
              <BlogCard key={blog.slug} blog={blog} />
            ))}
          </div>
        </div>
      </div>

      <ProfileModal 
        isOpen={isProfileOpen} 
        onClose={() => setIsProfileOpen(false)} 
      />
    </div>
  );
};

export default HomePage;
