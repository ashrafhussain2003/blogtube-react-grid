
import React, { useState, useEffect } from 'react';
import { BlogPost } from '../types/blog';
import BlogRenderer from './BlogRenderer';
import CommentSection from './CommentSection';
import AdBanner from './AdBanner';
import { Clock, User, Calendar, Eye } from 'lucide-react';
import { Link } from 'react-router-dom';
import { sampleBlogs } from '../data/sampleBlogs';
import { blogService } from '../services/blogService';

interface HashtagBlogViewerProps {
  blogPath: string | null;
  isLoading: boolean;
  hashtag?: string;
}

const HashtagBlogViewer: React.FC<HashtagBlogViewerProps> = ({ blogPath, isLoading, hashtag }) => {
  const [blog, setBlog] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Get related blogs based on hashtag
  const getRelatedBlogs = () => {
    if (!hashtag) return [];
    return sampleBlogs
      .filter(b => b.hashtags.includes(hashtag.toLowerCase()))
      .slice(0, 4);
  };

  const relatedBlogs = getRelatedBlogs();

  useEffect(() => {
    if (!blogPath) return;

    const loadBlog = async () => {
      setLoading(true);
      setError(null);
      
      try {
        const loadedBlog = await blogService.loadBlog(blogPath);
        if (loadedBlog) {
          setBlog(loadedBlog);
        } else {
          setError('Failed to load blog content');
        }
      } catch (err) {
        setError('Failed to load blog content');
        console.error('Error loading blog:', err);
      } finally {
        setLoading(false);
      }
    };

    loadBlog();
  }, [blogPath]);

  if (isLoading || loading) {
    return (
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading blog content...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="text-center">
          <div className="text-red-500 text-lg mb-2">Error</div>
          <p className="text-gray-600">{error}</p>
        </div>
      </div>
    );
  }

  if (!blog) {
    return (
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="text-center">
          <div className="text-gray-400 text-lg mb-2">No blog selected</div>
          <p className="text-gray-600">Select a topic from the sidebar to start reading</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex bg-white">
      {/* Main Content */}
      <div className="flex-1 max-w-4xl">
        <article className="bg-white">
          {/* Article Header */}
          <div className="p-8 border-b border-gray-200">
            <div className="flex items-center gap-2 text-sm text-gray-500 mb-4">
              {blog.meta.hashtags.map(tag => (
                <Link
                  key={tag}
                  to={`/hashtag/${tag}`}
                  className="bg-blue-100 text-blue-600 px-2 py-1 rounded hover:bg-blue-200 transition-colors"
                >
                  #{tag}
                </Link>
              ))}
            </div>
            
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              {blog.meta.title}
            </h1>
            
            <div className="flex items-center gap-6 text-sm text-gray-600">
              <div className="flex items-center gap-2">
                <User className="w-4 h-4" />
                <span className="font-medium">{blog.meta.author}</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                <span>{new Date(blog.meta.publishedDate).toLocaleDateString()}</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4" />
                <span>{blog.meta.readingTime} min read</span>
              </div>
              {blog.meta.viewCount && (
                <div className="flex items-center gap-2">
                  <Eye className="w-4 h-4" />
                  <span>{blog.meta.viewCount.toLocaleString()} views</span>
                </div>
              )}
            </div>
          </div>

          {/* Article Content */}
          <div className="p-8">
            <BlogRenderer blocks={blog.blocks} />
          </div>

          {/* Related Articles Section */}
          <div className="px-8 pb-8">
            <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg p-6 text-white">
              <h3 className="text-xl font-semibold mb-4">Related Articles</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {relatedBlogs.map(relatedBlog => (
                  <Link
                    key={relatedBlog.slug}
                    to={`/blog/${relatedBlog.slug}`}
                    className="block bg-white/10 hover:bg-white/20 rounded-lg p-4 transition-colors"
                  >
                    <h4 className="font-medium text-white mb-2 line-clamp-2">
                      {relatedBlog.title}
                    </h4>
                    <div className="flex items-center gap-2 text-blue-100 text-sm">
                      <User className="w-3 h-3" />
                      <span>{relatedBlog.author}</span>
                      <span>•</span>
                      <span>{relatedBlog.readingTime} min</span>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </div>

          {/* Comments Section */}
          <div className="px-8 pb-8">
            <CommentSection blogSlug={blog.meta.slug} />
          </div>
        </article>
      </div>

      {/* Right Sidebar - Advertisement Sections */}
      <aside className="w-80 flex-shrink-0 p-6 space-y-4">
        <AdBanner type="square" />
        <AdBanner type="square" />
        <AdBanner type="square" />
        <AdBanner type="square" />
        <AdBanner type="square" />
        <AdBanner type="square" />
        <AdBanner type="square" />
        <AdBanner type="square" />
      </aside>
    </div>
  );
};

export default HashtagBlogViewer;
