
import React, { useState, useEffect } from 'react';
import { BlogPost } from '../types/blog';
import BlogRenderer from './BlogRenderer';
import { Clock, User, Calendar } from 'lucide-react';

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
            title: "Understanding AWS Services",
            author: "John Doe",
            publishedDate: "2024-01-15",
            readingTime: 8,
            hashtags: ["aws", "cloud", "technology"],
            slug: "understanding-aws-services",
            description: "A comprehensive guide to AWS services and their applications in modern cloud computing."
          },
          blocks: [
            {
              type: 'title',
              content: 'Understanding AWS Services',
              level: 1
            },
            {
              type: 'text',
              content: 'Amazon Web Services (AWS) is a comprehensive cloud computing platform that offers a wide range of services to help businesses scale and grow. In this article, we\'ll explore the key services and their applications.'
            },
            {
              type: 'note',
              content: 'AWS offers over 200 services across various categories including compute, storage, databases, and more.'
            },
            {
              type: 'title',
              content: 'Core Services Overview',
              level: 2
            },
            {
              type: 'text',
              content: 'Let\'s dive into some of the most important AWS services that form the backbone of many cloud applications.'
            },
            {
              type: 'image',
              content: '/api/placeholder/600/300',
              alt: 'AWS Services Overview Diagram'
            },
            {
              type: 'alert',
              content: 'Always follow AWS best practices for security and cost optimization when deploying services.'
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
    <div className="flex-1 max-w-4xl mx-auto p-6 lg:p-8">
      {/* Blog Meta Information */}
      <div className="mb-8 pb-6 border-b border-gray-200">
        <div className="flex items-center gap-6 text-sm text-gray-600 mb-4">
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
        </div>
        
        <div className="flex flex-wrap gap-2">
          {blog.meta.hashtags.map(tag => (
            <span
              key={tag}
              className="inline-block bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm border border-gray-200"
            >
              #{tag}
            </span>
          ))}
        </div>
      </div>

      {/* Blog Content */}
      <article className="prose prose-lg max-w-none">
        <BlogRenderer blocks={blog.blocks} />
      </article>
    </div>
  );
};

export default HashtagBlogViewer;
