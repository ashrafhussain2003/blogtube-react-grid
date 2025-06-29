
import React, { useState, useEffect } from 'react';
import { BlogPost } from '../types/blog';
import BlogRenderer from './BlogRenderer';
import { Clock, User, Calendar, Eye } from 'lucide-react';
import { Link } from 'react-router-dom';

interface HashtagBlogViewerProps {
  blogPath: string | null;
  isLoading: boolean;
}

const HashtagBlogViewer: React.FC<HashtagBlogViewerProps> = ({ blogPath, isLoading }) => {
  const [blog, setBlog] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!blogPath) return;

    const loadBlog = async () => {
      setLoading(true);
      setError(null);
      
      try {
        // Simulate API call with sample data since we don't have actual JSON files
        const sampleBlog: BlogPost = {
          meta: {
            title: "Getting Started with React Hooks",
            author: "Sarah Johnson",
            publishedDate: "2024-01-15",
            readingTime: 8,
            viewCount: 12500,
            hashtags: ["react", "javascript", "frontend", "hooks"],
            slug: "getting-started-react-hooks",
            description: "This is an introduction paragraph that sets the context for the entire article. It provides readers with a clear understanding of what they can expect to learn."
          },
          blocks: [
            {
              type: 'title',
              content: 'Getting Started with React Hooks',
              level: 1
            },
            {
              type: 'text',
              content: 'This is an introduction paragraph that sets the context for the entire article. It provides readers with a clear understanding of what they can expect to learn.'
            },
            {
              type: 'text',
              content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris.'
            },
            {
              type: 'note',
              content: 'This is an important note that readers should pay attention to. It contains crucial information that enhances understanding.'
            },
            {
              type: 'title',
              content: 'Key Concepts',
              level: 2
            },
            {
              type: 'text',
              content: 'Here we dive deeper into the main concepts. This paragraph provides detailed explanations and examples to help readers understand the topic better.'
            }
          ]
        };

        // Simulate network delay
        await new Promise(resolve => setTimeout(resolve, 300));
        setBlog(sampleBlog);
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
    <div className="flex-1 bg-white">
      <div className="max-w-4xl mx-auto">
        {/* Blog Header */}
        <div className="px-6 lg:px-8 pt-8 pb-4">
          {/* Hashtags */}
          <div className="flex flex-wrap gap-2 mb-6">
            {blog.meta.hashtags.map(tag => (
              <Link
                key={tag}
                to={`/hashtag/${tag}`}
                className="inline-block bg-blue-100 text-blue-600 px-3 py-1 rounded-full text-sm hover:bg-blue-200 transition-colors"
              >
                #{tag}
              </Link>
            ))}
          </div>

          {/* Title */}
          <h1 className="text-4xl font-bold text-gray-900 mb-6 leading-tight">
            {blog.meta.title}
          </h1>

          {/* Meta Information */}
          <div className="flex items-center gap-6 text-sm text-gray-600 pb-6 border-b border-gray-200">
            <div className="flex items-center gap-1">
              <User className="w-4 h-4" />
              <span>{blog.meta.author}</span>
            </div>
            <div className="flex items-center gap-1">
              <Calendar className="w-4 h-4" />
              <span>{new Date(blog.meta.publishedDate).toLocaleDateString()}</span>
            </div>
            <div className="flex items-center gap-1">
              <Clock className="w-4 h-4" />
              <span>{blog.meta.readingTime} min read</span>
            </div>
            {blog.meta.viewCount && (
              <div className="flex items-center gap-1">
                <Eye className="w-4 h-4" />
                <span>{blog.meta.viewCount.toLocaleString()} views</span>
              </div>
            )}
          </div>
        </div>

        {/* Blog Content */}
        <article className="px-6 lg:px-8 pb-12">
          <div className="prose prose-lg max-w-none">
            <BlogRenderer blocks={blog.blocks.slice(1)} />
          </div>
        </article>

        {/* Related Articles Sidebar */}
        <div className="px-6 lg:px-8 pb-8">
          <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg p-6 text-white">
            <h3 className="text-xl font-semibold mb-2">Related Articles</h3>
            <p className="text-blue-100">Getting Started with React Hooks</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HashtagBlogViewer;
