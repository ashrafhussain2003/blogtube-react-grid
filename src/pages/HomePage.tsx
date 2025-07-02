
import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Hash, TrendingUp, Eye, Clock, User, Calendar } from 'lucide-react';
import BlogCard from '../components/BlogCard';
import SearchBar from '../components/SearchBar';
import ProfileModal from '../components/ProfileModal';
import { Avatar, AvatarImage, AvatarFallback } from '../components/ui/avatar';
import { HoverCard, HoverCardContent, HoverCardTrigger } from '../components/ui/hover-card';
import { blogService } from '../services/blogService';
import { BlogMeta } from '../types/blog';

const HomePage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredBlogs, setFilteredBlogs] = useState<BlogMeta[]>([]);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [topViewedBlogs, setTopViewedBlogs] = useState<BlogMeta[]>([]);

  React.useEffect(() => {
    loadTopViewedBlogs();
  }, []);

  const loadTopViewedBlogs = async () => {
    try {
      // Get all available hashtags/topics
      const availableTopics = ['react', 'javascript', 'aws', 'python', 'nodejs'];
      const allBlogs: BlogMeta[] = [];

      for (const topic of availableTopics) {
        const tree = await blogService.getFolderTree(topic);
        const topicBlogs = await extractBlogsFromTree(tree, topic);
        allBlogs.push(...topicBlogs);
      }

      // Sort by view count and take top 3
      const sorted = allBlogs.sort((a, b) => (b.viewCount || 0) - (a.viewCount || 0)).slice(0, 3);
      setTopViewedBlogs(sorted);
    } catch (error) {
      console.error('Error loading top viewed blogs:', error);
    }
  };

  const extractBlogsFromTree = async (tree: any[], topic: string): Promise<BlogMeta[]> => {
    const blogs: BlogMeta[] = [];
    
    for (const node of tree) {
      if (node.type === 'blog' && node.path) {
        try {
          const blog = await blogService.loadBlog(node.path);
          if (blog) {
            blogs.push(blog.meta);
          }
        } catch (error) {
          console.error(`Error loading blog ${node.path}:`, error);
        }
      }
      if (node.children) {
        const childBlogs = await extractBlogsFromTree(node.children, topic);
        blogs.push(...childBlogs);
      }
    }
    
    return blogs;
  };

  const handleSearch = (results: BlogMeta[]) => {
    setFilteredBlogs(results);
  };

  const getTopicIcon = (hashtag: string) => {
    const topic = hashtag.toLowerCase();
    const iconStyle = "w-8 h-8 group-hover:scale-110 transition-transform";
    
    switch (topic) {
      case 'react':
        return (
          <svg className={iconStyle} viewBox="0 0 24 24" fill="currentColor">
            <circle cx="12" cy="12" r="2"/>
            <path d="M12 2C9.5 4.5 7 7.5 7 12s2.5 7.5 5 10c2.5-2.5 5-5.5 5-10s-2.5-7.5-5-10z"/>
            <path d="M2 12c2.5-2.5 5.5-5 10-5s7.5 2.5 10 5c-2.5 2.5-5.5 5-10 5s-7.5-2.5-10-5z"/>
          </svg>
        );
      case 'javascript':
        return (
          <svg className={iconStyle} viewBox="0 0 24 24" fill="currentColor">
            <rect x="2" y="2" width="20" height="20" rx="2"/>
            <path d="M7 15c0 1.5 1 2.5 2.5 2.5S12 16.5 12 15V9h-2v6c0 .5-.5 1-1 1s-1-.5-1-1h-2z"/>
            <path d="M15 17.5c1.5 0 2.5-1 2.5-2.5 0-1-.5-1.5-1.5-2l-1-.5c-.5-.25-.5-.5-.5-.75 0-.5.5-.75 1-.75s1 .25 1 .75h2c0-1.5-1-2.5-2.5-2.5S13.5 10 13.5 11.5c0 1 .5 1.5 1.5 2l1 .5c.5.25.5.5.5.75 0 .5-.5.75-1 .75s-1-.25-1-.75h-2z"/>
          </svg>
        );
      case 'aws':
        return (
          <svg className={iconStyle} viewBox="0 0 24 24" fill="currentColor">
            <path d="M6.5 4L12 2l5.5 2v6c0 5-3.5 9-5.5 10-2-1-5.5-5-5.5-10V4z"/>
            <path d="M12 8v8M8 12h8"/>
          </svg>
        );
      case 'python':
        return (
          <svg className={iconStyle} viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2C8 2 6 4 6 6v2h6v1H5c-2 0-3 1-3 3v4c0 2 1 3 3 3h2v-2c0-2 2-4 4-4h6c1 0 2-1 2-2V6c0-2-2-4-6-4z"/>
            <circle cx="9" cy="5" r="1"/>
            <path d="M12 22c4 0 6-2 6-4v-2h-6v-1h7c2 0 3-1 3-3v-4c0-2-1-3-3-3h-2v2c0 2-2 4-4 4H7c-1 0-2 1-2 2v6c0 2 2 4 6 4z"/>
            <circle cx="15" cy="19" r="1"/>
          </svg>
        );
      case 'nodejs':
        return (
          <svg className={iconStyle} viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2L2 7v10l10 5 10-5V7l-10-5z"/>
            <path d="M12 7v10M7 9.5l10 5M7 14.5l10-5"/>
          </svg>
        );
      default:
        return <Hash className={iconStyle} />;
    }
  };

  const allHashtags = useMemo(() => {
    const topics = [
      { hashtag: 'react', count: 6 },
      { hashtag: 'javascript', count: 6 },
      { hashtag: 'aws', count: 6 },
      { hashtag: 'python', count: 6 },
      { hashtag: 'nodejs', count: 6 }
    ];
    return topics.sort((a, b) => b.count - a.count);
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Hero Section */}
        <div className="text-center mb-12 relative">
          {/* Avatar with hover card in top right corner */}
          <div className="absolute top-0 right-0">
            <HoverCard>
              <HoverCardTrigger asChild>
                <button
                  onClick={() => setIsProfileOpen(true)}
                  className="rounded-full hover:ring-2 hover:ring-blue-200 transition-all"
                >
                  <Avatar className="w-10 h-10">
                    <AvatarImage src="/lovable-uploads/9a90d753-14e1-45e1-8848-b1a046b78ce5.png" alt="Profile" />
                    <AvatarFallback>MAH</AvatarFallback>
                  </Avatar>
                </button>
              </HoverCardTrigger>
              <HoverCardContent className="w-80" align="end">
                <div className="flex justify-between space-x-4">
                  <Avatar>
                    <AvatarImage src="/lovable-uploads/9a90d753-14e1-45e1-8848-b1a046b78ce5.png" />
                    <AvatarFallback>MAH</AvatarFallback>
                  </Avatar>
                  <div className="space-y-1">
                    <h4 className="text-sm font-semibold">About Developer</h4>
                    <p className="text-sm text-muted-foreground">
                      Mohammed Ashraf Hussain - Full Stack Developer with expertise in Java, Python, AWS, Azure, GCP, and DevOps.
                    </p>
                    <div className="flex items-center pt-2">
                      <Calendar className="mr-2 h-4 w-4 opacity-70" />
                      <span className="text-xs text-muted-foreground">
                        Click to view full profile
                      </span>
                    </div>
                  </div>
                </div>
              </HoverCardContent>
            </HoverCard>
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

        {/* Browse by Topics Section - Now appears first */}
        <div className="mb-12">
          <div className="flex items-center gap-2 mb-6">
            <Hash className="w-6 h-6 text-blue-600" />
            <h2 className="text-2xl font-bold text-gray-900">Browse by Topics</h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {allHashtags.map(({ hashtag, count }) => {
              return (
                <Link
                  key={hashtag}
                  to={`/hashtag/${hashtag}`}
                  className="flex flex-col items-center p-6 bg-white rounded-lg shadow-sm hover:shadow-md transition-all duration-200 border border-gray-200 group hover:-translate-y-1"
                >
                  <div className="text-blue-600 mb-3 group-hover:text-blue-700 transition-colors">
                    {getTopicIcon(hashtag)}
                  </div>
                  <h3 className="text-sm font-medium text-gray-900 mb-1 capitalize">
                    {hashtag}
                  </h3>
                  <p className="text-xs text-gray-500">
                    {count} articles
                  </p>
                </Link>
              );
            })}
          </div>
        </div>

        {/* Most Viewed Section - Now appears second */}
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
      </div>

      <ProfileModal 
        isOpen={isProfileOpen} 
        onClose={() => setIsProfileOpen(false)} 
      />
    </div>
  );
};

export default HomePage;
