import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Hash, TrendingUp, Eye, Clock, User, Calendar } from 'lucide-react';
import BlogCard from '../components/BlogCard';
import SearchBar from '../components/SearchBar';
import Navigation from '../components/Navigation';
import { sampleBlogs } from '../data/sampleBlogs';

const HomePage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredBlogs = useMemo(() => {
    const term = searchTerm.toLowerCase();
    return sampleBlogs.filter(blog =>
      blog.title.toLowerCase().includes(term) ||
      blog.description.toLowerCase().includes(term) ||
      blog.author.toLowerCase().includes(term) ||
      blog.hashtags.some(tag => tag.toLowerCase().includes(term))
    );
  }, [searchTerm]);

  const topViewedBlogs = useMemo(() => {
    return [...sampleBlogs]
      .sort((a, b) => (b.viewCount || 0) - (a.viewCount || 0))
      .slice(0, 3);
  }, []);

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
      <Navigation showBackButton={false} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-gray-900 mb-4">
            Welcome to <span className="text-blue-600">BlogTube</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            Discover amazing content across various topics
          </p>
          <SearchBar onSearch={setSearchTerm} />
        </div>

        {/* Most Viewed Section */}
        <div className="mb-12">
          <div className="flex items-center gap-2 mb-6">
            <TrendingUp className="w-6 h-6 text-red-500" />
            <h2 className="text-2xl font-bold text-gray-900">Most Viewed</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {topViewedBlogs.map(blog => (
              <Link
                key={blog.slug}
                to={`/blog/${blog.slug}`}
                className="block bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow overflow-hidden"
              >
                <div className="p-6">
                  <div className="flex items-center gap-2 text-sm text-gray-500 mb-3">
                    {blog.hashtags.slice(0, 2).map(tag => (
                      <span key={tag} className="bg-blue-100 text-blue-600 px-2 py-1 rounded text-xs">
                        #{tag}
                      </span>
                    ))}
                  </div>
                  
                  <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
                    {blog.title}
                  </h3>
                  
                  <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                    {blog.description}
                  </p>
                  
                  <div className="flex items-center justify-between text-sm text-gray-500">
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-1">
                        <User className="w-3 h-3" />
                        <span>{blog.author}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        <span>{blog.readingTime}min</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-1 text-red-500">
                      <Eye className="w-3 h-3" />
                      <span>{blog.viewCount?.toLocaleString()}</span>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Hashtags Section */}
        <div className="mb-12">
          <div className="flex items-center gap-2 mb-6">
            <Hash className="w-6 h-6 text-blue-600" />
            <h2 className="text-2xl font-bold text-gray-900">Browse by Topics</h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {allHashtags.map(({ hashtag, count }) => (
              <Link
                key={hashtag}
                to={`/hashtag/${hashtag}`}
                className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow p-6 text-center border border-gray-200 hover:border-blue-300"
              >
                <div className="text-3xl mb-2">📚</div>
                <h3 className="font-semibold text-gray-900 mb-1">#{hashtag}</h3>
                <p className="text-sm text-gray-600">{count} articles</p>
              </Link>
            ))}
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
    </div>
  );
};

export default HomePage;
