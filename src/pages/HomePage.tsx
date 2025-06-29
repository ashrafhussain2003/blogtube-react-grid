
import React, { useState, useEffect } from 'react';
import BlogCard from '../components/BlogCard';
import AdBanner from '../components/AdBanner';
import SearchBar from '../components/SearchBar';
import { BlogMeta } from '../types/blog';
import { sampleBlogs, trendingHashtags } from '../data/sampleBlogs';
import { Link } from 'react-router-dom';
import { TrendingUp } from 'lucide-react';

const HomePage: React.FC = () => {
  const [blogs, setBlogs] = useState<BlogMeta[]>(sampleBlogs);
  const [loading, setLoading] = useState(false);

  const handleSearch = (results: BlogMeta[]) => {
    setBlogs(results);
  };

  const renderBlogGrid = () => {
    const items = [];
    for (let i = 0; i < blogs.length; i++) {
      items.push(
        <BlogCard key={blogs[i].slug} blog={blogs[i]} />
      );
      
      // Add ad banner after every 8th blog
      if ((i + 1) % 8 === 0 && i < blogs.length - 1) {
        items.push(
          <div key={`ad-${i}`} className="col-span-full">
            <AdBanner type="horizontal" className="my-4" />
          </div>
        );
      }
    }
    return items;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link to="/" className="text-2xl font-bold text-blue-600">
              BlogTube
            </Link>
            <div className="flex-1 max-w-2xl mx-8">
              <SearchBar onSearch={handleSearch} />
            </div>
            <div className="hidden md:block">
              <AdBanner type="square" className="w-24 h-16" />
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex gap-8">
          {/* Main Content */}
          <main className="flex-1">
            {/* Trending Section */}
            <section className="mb-8">
              <div className="flex items-center gap-2 mb-4">
                <TrendingUp className="w-6 h-6 text-red-500" />
                <h2 className="text-2xl font-bold text-gray-900">Trending Hashtags</h2>
              </div>
              <div className="flex flex-wrap gap-2">
                {trendingHashtags.map(hashtag => (
                  <Link
                    key={hashtag.name}
                    to={`/hashtag/${hashtag.name}`}
                    className="inline-block bg-blue-100 hover:bg-blue-200 text-blue-700 px-3 py-1 rounded-full text-sm font-medium transition-colors"
                  >
                    #{hashtag.name} ({hashtag.count})
                  </Link>
                ))}
              </div>
            </section>

            {/* Blog Grid */}
            <section>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {renderBlogGrid()}
              </div>
              
              {blogs.length === 0 && (
                <div className="text-center py-12">
                  <p className="text-gray-500 text-lg">No blogs found matching your search.</p>
                </div>
              )}
            </section>
          </main>

          {/* Sidebar */}
          <aside className="hidden lg:block w-80">
            <div className="sticky top-24 space-y-6">
              <AdBanner type="vertical" />
              
              <div className="bg-white rounded-lg shadow-md p-6">
                <h3 className="text-lg font-semibold mb-4">Popular This Week</h3>
                <div className="space-y-3">
                  {sampleBlogs.slice(0, 5).map((blog, index) => (
                    <Link
                      key={blog.slug}
                      to={`/blog/${blog.slug}`}
                      className="block hover:bg-gray-50 p-2 rounded transition-colors"
                    >
                      <div className="text-sm font-medium text-gray-900 line-clamp-2">
                        {blog.title}
                      </div>
                      <div className="text-xs text-gray-500 mt-1">
                        {blog.viewCount?.toLocaleString()} views
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </aside>
        </div>
      </div>

      {/* Footer Ad */}
      <footer className="bg-white border-t border-gray-200 py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <AdBanner type="horizontal" />
        </div>
      </footer>
    </div>
  );
};

export default HomePage;
