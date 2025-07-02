
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { BlogPost as BlogPostType } from '../types/blog';
import { blogService } from '../services/blogService';
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
  const [relatedBlogs, setRelatedBlogs] = useState<any[]>([]);

  useEffect(() => {
    const loadBlog = async () => {
      setLoading(true);
      
      try {
        // Find the blog path from all available topics
        const topics = ['react', 'javascript', 'aws', 'python', 'nodejs'];
        let foundBlog: BlogPostType | null = null;

        for (const topic of topics) {
          const tree = await blogService.getFolderTree(topic);
          const blogPath = findBlogPathInTree(tree, slug);
          
          if (blogPath) {
            foundBlog = await blogService.loadBlog(blogPath);
            if (foundBlog) {
              // Load related blogs from the same topic
              const related = await getRelatedBlogs(tree, slug);
              setRelatedBlogs(related.slice(0, 4));
              break;
            }
          }
        }

        setBlog(foundBlog);
      } catch (error) {
        console.error('Error loading blog:', error);
      } finally {
        setLoading(false);
      }
    };

    if (slug) {
      loadBlog();
    }
  }, [slug]);

  const findBlogPathInTree = (tree: any[], targetSlug: string | undefined): string | null => {
    for (const node of tree) {
      if (node.type === 'blog' && node.slug === targetSlug) {
        return node.path;
      }
      if (node.children) {
        const found = findBlogPathInTree(node.children, targetSlug);
        if (found) return found;
      }
    }
    return null;
  };

  const getRelatedBlogs = async (tree: any[], currentSlug: string | undefined) => {
    const blogs = [];
    for (const node of tree) {
      if (node.type === 'blog' && node.slug !== currentSlug) {
        try {
          const blogData = await blogService.loadBlog(node.path);
          if (blogData) {
            blogs.push(blogData.meta);
          }
        } catch (error) {
          console.error('Error loading related blog:', error);
        }
      }
      if (node.children) {
        const childBlogs = await getRelatedBlogs(node.children, currentSlug);
        blogs.push(...childBlogs);
      }
    }
    return blogs;
  };

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
          {/* Main Content - Increased width */}
          <main className="flex-grow max-w-5xl">
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
              {relatedBlogs.length > 0 && (
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
              )}

              {/* Comments Section */}
              <div className="px-8 pb-8">
                <CommentSection blogSlug={blog.meta.slug} />
              </div>
            </article>
          </main>

          {/* Right Sidebar - Fixed width, positioned on the far right */}
          <aside className="w-[300px] ml-auto flex-shrink-0 space-y-4">
            <AdBanner type="square" />
            <AdBanner type="square" />
            <AdBanner type="square" />
            <AdBanner type="square" />
            <AdBanner type="square" />
            <AdBanner type="square" />
          </aside>
        </div>
      </div>
    </div>
  );
};

export default BlogPost;
