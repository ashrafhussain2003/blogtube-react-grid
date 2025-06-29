
import React, { useState, useEffect } from 'react';
import { Search, X } from 'lucide-react';
import { BlogMeta } from '../types/blog';
import { sampleBlogs } from '../data/sampleBlogs';
import { Link } from 'react-router-dom';

interface SearchBarProps {
  onSearch?: (results: BlogMeta[]) => void;
}

const SearchBar: React.FC<SearchBarProps> = ({ onSearch }) => {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState<BlogMeta[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  useEffect(() => {
    if (query.length > 2) {
      const filtered = sampleBlogs.filter(blog =>
        blog.title.toLowerCase().includes(query.toLowerCase()) ||
        blog.author.toLowerCase().includes(query.toLowerCase()) ||
        blog.description.toLowerCase().includes(query.toLowerCase()) ||
        blog.hashtags.some(tag => tag.toLowerCase().includes(query.toLowerCase()))
      ).slice(0, 5);
      
      setSuggestions(filtered);
      setShowSuggestions(true);
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }
  }, [query]);

  const handleSearch = (searchQuery: string) => {
    const results = sampleBlogs.filter(blog =>
      blog.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      blog.author.toLowerCase().includes(searchQuery.toLowerCase()) ||
      blog.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      blog.hashtags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
    );
    
    if (onSearch) {
      onSearch(results);
    }
    setShowSuggestions(false);
  };

  const clearSearch = () => {
    setQuery('');
    setSuggestions([]);
    setShowSuggestions(false);
    if (onSearch) {
      onSearch(sampleBlogs);
    }
  };

  return (
    <div className="relative w-full max-w-2xl">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleSearch(query)}
          placeholder="Search blogs, authors, hashtags..."
          className="w-full pl-10 pr-10 py-3 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
        {query && (
          <button
            onClick={clearSearch}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      {showSuggestions && suggestions.length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
          {suggestions.map((blog) => (
            <Link
              key={blog.slug}
              to={`/blog/${blog.slug}`}
              className="block px-4 py-3 hover:bg-gray-50 border-b border-gray-100 last:border-b-0"
              onClick={() => setShowSuggestions(false)}
            >
              <div className="font-medium text-gray-900 truncate">{blog.title}</div>
              <div className="text-sm text-gray-500 truncate">by {blog.author}</div>
              <div className="flex gap-1 mt-1">
                {blog.hashtags.slice(0, 3).map(tag => (
                  <span key={tag} className="text-xs bg-blue-100 text-blue-600 px-1 rounded">
                    #{tag}
                  </span>
                ))}
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default SearchBar;
