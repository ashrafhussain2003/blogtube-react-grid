
import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { BlogPost as BlogPostType } from '../types/blog';
import { sampleBlogs } from '../data/sampleBlogs';
import BlogRenderer from '../components/BlogRenderer';
import CommentSection from '../components/CommentSection';
import AdBanner from '../components/AdBanner';
import { ArrowLeft, Clock, Eye, User, Calendar } from 'lucide-react';

const BlogPost: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const [blog, setBlog] = useState<BlogPostType | null>(null);
  const [loading, setLoading] = useState(true);
  const [relatedBlogs, setRelatedBlogs] = useState(sampleBlogs.slice(0, 5));

  useEffect(() => {
    const loadBlog = async () => {
      setLoading(true);
      
      // Simulate loading blog from JSON file
      setTimeout(() => {
        const blogMeta = sampleBlogs.find(b => b.slug === slug);
        if (blogMeta) {
          // Mock blog content
          const mockBlog: BlogPostType = {
            meta: blogMeta,
            blocks: [
              {
                type: 'title',
                content: blogMeta.title,
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
                content: 'Here we dive deeper into the main concepts. This paragraph provides detailed explanations and examples that help readers grasp the fundamental ideas.'
              },
              {
                type: 'image',
                content: '/api/placeholder/800/400',
                alt: 'Illustration of key concepts discussed in the article'
              },
              {
                type: 'text',
                content: 'Following the visual representation above, we can see how these concepts apply in real-world scenarios. The implementation details are crucial for practical application.'
              },
              {
                type: 'alert',
                content: 'Warning: Make sure to follow best practices when implementing these concepts to avoid common pitfalls and security issues.'
              },
              {
                type: 'title',
                content: 'Advanced Techniques',
                level: 2
              },
              {
                type: 'text',
                content: 'Now that we have covered the basics, let\'s explore some advanced techniques that can take your skills to the next level. These methods require a solid understanding of the fundamentals.'
              },
              {
                type: 'text',
                content: 'The final section provides practical examples and code snippets that you can use in your own projects. Remember to adapt these examples to your specific use case and requirements.'
              }
            ]
          };
          setBlog(mockBlog);
        }
        setLoading(false);
      }, 300);
    };

    if (slug) {
      loadBlog();
    }
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading blog post...</p>
        </div>
      </div>
    );
  }

  if (!blog) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Blog Not Found</h1>
          <p className="text-gray-600 mb-6">The blog post you're looking for doesn't exist.</p>
          <Link
            to="/"
            className="inline-flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Home
          </Link>
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
              <span className="font-medium">Back to Blogs</span>
            </Link>
            <Link to="/" className="text-2xl font-bold text-blue-600">
              BlogTube
            </Link>
            <div className="w-24"></div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex gap-8">
          {/* Main Content */}
          <main className="flex-1 max-w-4xl">
            <article className="bg-white rounded-lg shadow-md overflow-hidden">
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
                
                {/* Ad after 2nd paragraph */}
                <div className="my-8">
                  <AdBanner type="horizontal" />
                </div>
              </div>
            </article>

            {/* Comments */}
            <div className="bg-white rounded-lg shadow-md mt-8 p-8">
              <CommentSection blogSlug={blog.meta.slug} />
            </div>
          </main>

          {/* Sidebar */}
          <aside className="hidden lg:block w-80">
            <div className="sticky top-24 space-y-6">
              <AdBanner type="vertical" />
              
              <div className="bg-white rounded-lg shadow-md p-6">
                <h3 className="text-lg font-semibold mb-4">Related Articles</h3>
                <div className="space-y-4">
                  {relatedBlogs.map((relatedBlog) => (
                    <Link
                      key={relatedBlog.slug}
                      to={`/blog/${relatedBlog.slug}`}
                      className="block group"
                    >
                      <div className="w-full h-32 bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 rounded-lg mb-2 flex items-center justify-center">
                        <h4 className="text-white text-sm font-medium text-center px-2 line-clamp-2">
                          {relatedBlog.title}
                        </h4>
                      </div>
                      <div className="text-sm">
                        <p className="font-medium text-gray-900 group-hover:text-blue-600 transition-colors line-clamp-2">
                          {relatedBlog.title}
                        </p>
                        <p className="text-gray-500 text-xs mt-1">
                          {relatedBlog.author} • {relatedBlog.readingTime} min read
                        </p>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
};

export default BlogPost;
