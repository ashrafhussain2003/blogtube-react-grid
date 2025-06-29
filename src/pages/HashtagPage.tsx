
import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import BlogCard from '../components/BlogCard';
import { BlogMeta } from '../types/blog';
import { sampleBlogs } from '../data/sampleBlogs';
import { ArrowLeft, Hash } from 'lucide-react';

const HashtagPage: React.FC = () => {
  const { hashtag } = useParams<{ hashtag: string }>();
  const [blogs, setBlogs] = useState<BlogMeta[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (hashtag) {
      setLoading(true);
      // Filter blogs by hashtag
      const filteredBlogs = sampleBlogs.filter(blog =>
        blog.hashtags.includes(hashtag.toLowerCase())
      );
      setBlogs(filteredBlogs);
      setLoading(false);
    }
  }, [hashtag]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading blogs...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link
              to="/"
              className="flex items-center gap-2 text-blue-600 hover:text-blue-700 transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              <span className="font-medium">Back to Home</span>
            </Link>
            <Link to="/" className="text-2xl font-bold text-blue-600">
              BlogTube
            </Link>
            <div className="w-24"></div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <Hash className="w-8 h-8 text-blue-600" />
            <h1 className="text-4xl font-bold text-gray-900">
              {hashtag}
            </h1>
          </div>
          <p className="text-gray-600 text-lg">
            {blogs.length} blog{blogs.length !== 1 ? 's' : ''} tagged with #{hashtag}
          </p>
        </div>

        {/* Blog Grid */}
        {blogs.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {blogs.map((blog) => (
              <BlogCard key={blog.slug} blog={blog} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <Hash className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h2 className="text-2xl font-semibold text-gray-700 mb-2">
              No blogs found
            </h2>
            <p className="text-gray-500 mb-6">
              There are no blogs tagged with #{hashtag} yet.
            </p>
            <Link
              to="/"
              className="inline-flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Explore All Blogs
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default HashtagPage;
