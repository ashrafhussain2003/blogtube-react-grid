
import React from 'react';
import { Link } from 'react-router-dom';
import { BlogMeta } from '../types/blog';
import { Clock, User } from 'lucide-react';

interface BlogCardProps {
  blog: BlogMeta;
  className?: string;
}

const BlogCard: React.FC<BlogCardProps> = ({ blog, className = '' }) => {
  // Always use hashtag-based routing to ensure proper loading from /Blogs folder
  const linkPath = `/hashtag/${blog.hashtags[0]}?blog=${blog.slug}`;

  return (
    <div className={`block bg-white rounded-lg shadow-sm hover:shadow-md transition-all duration-200 hover:-translate-y-1 border border-gray-200 ${className}`}>
      <Link to={linkPath}>
        <div className="relative">
          <div className="w-full h-48 bg-gradient-to-r from-blue-100 via-blue-200 to-blue-300 rounded-t-lg flex items-center justify-center">
            <h3 className="text-blue-800 text-xl font-bold text-center px-4 line-clamp-2">
              {blog.title}
            </h3>
          </div>
          {blog.featured && (
            <div className="absolute top-2 right-2 bg-blue-600 text-white px-2 py-1 rounded text-xs font-semibold">
              Featured
            </div>
          )}
        </div>
      </Link>
      
      <div className="p-4">
        <Link to={linkPath}>
          <p className="text-gray-600 text-sm mb-3 line-clamp-2">
            {blog.description}
          </p>
        </Link>
        
        <div className="flex items-center gap-2 text-sm text-gray-500 mb-3">
          <User className="w-4 h-4" />
          <span>{blog.author}</span>
          <span>•</span>
          <span>{new Date(blog.publishedDate).toLocaleDateString()}</span>
        </div>
        
        <div className="flex items-center justify-between text-sm text-gray-500 mb-3">
          <div className="flex items-center gap-1">
            <Clock className="w-4 h-4" />
            <span>{blog.readingTime} min read</span>
          </div>
          {blog.viewCount && (
            <div className="text-xs text-gray-400">
              {blog.viewCount.toLocaleString()} views
            </div>
          )}
        </div>
        
        <div className="flex flex-wrap gap-1">
          {blog.hashtags.slice(0, 3).map(tag => (
            <Link
              key={tag}
              to={`/hashtag/${tag}`}
              className="inline-block bg-blue-100 text-blue-600 px-2 py-1 rounded text-xs hover:bg-blue-200 transition-colors border border-blue-300"
            >
              #{tag}
            </Link>
          ))}
          {blog.hashtags.length > 3 && (
            <span className="text-xs text-gray-400">+{blog.hashtags.length - 3} more</span>
          )}
        </div>
      </div>
    </div>
  );
};

export default BlogCard;
