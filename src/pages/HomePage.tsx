
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
      
      // Add ad banner after every 6th blog (3 rows of 2)
      if ((i + 1) % 6 === 0 && i < blogs.length - 1) {
        items.push(
          <div key={`ad-${i}`} className="col-span-full my-8">
            <AdBanner type="horizontal" />
          </div>
        );
      }
    }
    return items;
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-6xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <Link to="/" className="text-2xl font-bold text-black">
              BlogTube
            </Link>
            <div className="flex-1 max-w-xl mx-8">
              <SearchBar onSearch={handleSearch} />
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-6 py-8">
        <div className="flex gap-12">
          {/* Main Content */}
          <main className="flex-1">
            {/* Trending Section */}
            <section className="mb-12">
              <div className="flex items-center gap-2 mb-6">
                <TrendingUp className="w-5 h-5 text-black" />
                <h2 className="text-xl font-semibold text-black">Trending</h2>
              </div>
              <div className="flex flex-wrap gap-2">
                {trendingHashtags.map(hashtag => (
                  <Link
                    key={hashtag.name}
                    to={`/hashtag/${hashtag.name}`}
                    className="inline-block bg-gray-100 hover:bg-gray-200 text-black px-3 py-1.5 rounded-full text-sm transition-colors border border-gray-200"
                  >
                    #{hashtag.name} ({hashtag.count})
                  </Link>
                ))}
              </div>
            </section>

            {/* Blog Grid - 2 columns with more spacing */}
            <section>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {renderBlogGrid()}
              </div>
              
              {blogs.length === 0 && (
                <div className="text-center py-16">
                  <p className="text-gray-500 text-lg">No blogs found matching your search.</p>
                </div>
              )}
            </section>
          </main>

          {/* Sidebar */}
          <aside className="hidden xl:block w-80">
            <div className="sticky top-24 space-y-8">
              <AdBanner type="vertical" />
              
              <div className="bg-white rounded-lg border border-gray-200 p-6">
                <h3 className="text-lg font-semibold mb-4 text-black">Popular This Week</h3>
                <div className="space-y-4">
                  {sampleBlogs.slice(0, 5).map((blog, index) => (
                    <Link
                      key={blog.slug}
                      to={`/blog/${blog.slug}`}
                      className="block hover:bg-gray-50 p-3 rounded transition-colors"
                    >
                      <div className="text-sm font-medium text-black line-clamp-2">
                        {blog.title}
                      </div>
                      <div className="text-xs text-gray-500 mt-1">
                        {blog.author}
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
      <footer className="bg-white border-t border-gray-200 py-8 mt-16">
        <div className="max-w-6xl mx-auto px-6">
          <AdBanner type="horizontal" />
        </div>
      </footer>
    </div>
  );
};

export default HomePage;
