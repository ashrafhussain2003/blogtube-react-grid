
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { BlogPost as BlogPostType } from '../types/blog';
import { sampleBlogs } from '../data/sampleBlogs';
import BlogRenderer from '../components/BlogRenderer';
import CommentSection from '../components/CommentSection';
import AdBanner from '../components/AdBanner';
import Navigation from '../components/Navigation';
import { Clock, Eye, User, Calendar } from 'lucide-react';
import { Link } from 'react-router-dom';

const BlogPost: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const [blog, setBlog] = useState<BlogPostType | null>(null);
  const [loading, setLoading] = useState(true);
  const [relatedBlogs, setRelatedBlogs] = useState(sampleBlogs.slice(0, 4));

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
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation 
        showBackButton={true}
        backLink="/"
        backText="Back to Blogs"
      />

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
          </main>

          {/* Right Sidebar - More Advertisements */}
          <aside className="w-80 flex-shrink-0 space-y-4">
            <AdBanner type="vertical" />
            <AdBanner type="square" />
            <AdBanner type="square" />
            <AdBanner type="horizontal" />
            <AdBanner type="square" />
            <AdBanner type="vertical" />
          </aside>
        </div>
      </div>
    </div>
  );
};

export default BlogPost;
