
import React, { useState, useEffect } from 'react';
import { Search, X } from 'lucide-react';
import { BlogMeta } from '../types/blog';
import { blogService } from '../services/blogService';
import { Link } from 'react-router-dom';

interface SearchBarProps {
  onSearch?: (results: BlogMeta[]) => void;
}

interface SearchResult extends BlogMeta {
  folderName?: string;
  matchType: 'title' | 'content' | 'folder' | 'hashtag';
}

const SearchBar: React.FC<SearchBarProps> = ({ onSearch }) => {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState<SearchResult[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [allBlogs, setAllBlogs] = useState<SearchResult[]>([]);

  useEffect(() => {
    loadAllBlogs();
  }, []);

  const loadAllBlogs = async () => {
    try {
      const availableTopics = ['react', 'javascript', 'aws', 'python', 'nodejs'];
      const blogs: SearchResult[] = [];

      for (const topic of availableTopics) {
        const tree = await blogService.getFolderTree(topic);
        const topicBlogs = await extractBlogsFromTree(tree, topic);
        blogs.push(...topicBlogs);
      }

      setAllBlogs(blogs);
    } catch (error) {
      console.error('Error loading all blogs:', error);
    }
  };

  const extractBlogsFromTree = async (tree: any[], topic: string): Promise<SearchResult[]> => {
    const blogs: SearchResult[] = [];
    
    for (const node of tree) {
      if (node.type === 'folder') {
        // Add folder as searchable item
        const folderResult: SearchResult = {
          title: node.name,
          slug: `folder-${node.name.toLowerCase().replace(/\s+/g, '-')}`,
          author: 'System',
          publishedDate: new Date().toISOString().split('T')[0],
          readingTime: 0,
          hashtags: [topic],
          description: `Browse ${node.name} topics`,
          matchType: 'folder'
        };
        blogs.push(folderResult);
      }

      if (node.type === 'blog' && node.path) {
        try {
          const blog = await blogService.loadBlog(node.path);
          if (blog) {
            const searchResult: SearchResult = {
              ...blog.meta,
              folderName: findParentFolder(tree, node.path),
              matchType: 'title'
            };
            blogs.push(searchResult);
          }
        } catch (error) {
          console.error(`Error loading blog ${node.path}:`, error);
        }
      }

      if (node.children) {
        const childBlogs = await extractBlogsFromTree(node.children, topic);
        blogs.push(...childBlogs);
      }
    }
    
    return blogs;
  };

  const findParentFolder = (tree: any[], blogPath: string): string => {
    for (const node of tree) {
      if (node.type === 'folder' && node.children) {
        const hasBlog = node.children.some((child: any) => child.path === blogPath);
        if (hasBlog) return node.name;
      }
    }
    return '';
  };

  useEffect(() => {
    if (query.length > 2) {
      const filtered = allBlogs.filter(blog => {
        const queryLower = query.toLowerCase();
        
        // Search in title
        if (blog.title.toLowerCase().includes(queryLower)) {
          blog.matchType = 'title';
          return true;
        }
        
        // Search in folder name
        if (blog.folderName && blog.folderName.toLowerCase().includes(queryLower)) {
          blog.matchType = 'folder';
          return true;
        }
        
        // Search in hashtags
        if (blog.hashtags.some(tag => tag.toLowerCase().includes(queryLower))) {
          blog.matchType = 'hashtag';
          return true;
        }
        
        // Search in description
        if (blog.description && blog.description.toLowerCase().includes(queryLower)) {
          blog.matchType = 'content';
          return true;
        }
        
        return false;
      });
      
      setSuggestions(filtered.slice(0, 8));
      setShowSuggestions(true);
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }
  }, [query, allBlogs]);

  const handleSearch = (searchQuery: string) => {
    const results = allBlogs.filter(blog => {
      const queryLower = searchQuery.toLowerCase();
      return blog.title.toLowerCase().includes(queryLower) ||
             blog.hashtags.some(tag => tag.toLowerCase().includes(queryLower)) ||
             (blog.description && blog.description.toLowerCase().includes(queryLower)) ||
             (blog.folderName && blog.folderName.toLowerCase().includes(queryLower));
    });
    
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
      onSearch([]);
    }
  };

  const getMatchTypeLabel = (matchType: string) => {
    switch (matchType) {
      case 'title': return 'Title match';
      case 'folder': return 'Topic match';
      case 'hashtag': return 'Tag match';
      case 'content': return 'Content match';
      default: return '';
    }
  };

  const getLinkPath = (blog: SearchResult) => {
    if (blog.matchType === 'folder') {
      return `/hashtag/${blog.hashtags[0]}`;
    }
    return `/hashtag/${blog.hashtags[0]}?blog=${blog.slug}`;
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
          placeholder="Search blogs, topics, content..."
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
        <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-50 max-h-96 overflow-y-auto">
          {suggestions.map((blog, index) => (
            <Link
              key={`${blog.slug}-${index}`}
              to={getLinkPath(blog)}
              className="block px-4 py-3 hover:bg-gray-50 border-b border-gray-100 last:border-b-0"
              onClick={() => setShowSuggestions(false)}
            >
              <div className="text-left">
                <div className="font-medium text-gray-900 text-left mb-1">{blog.title}</div>
                <div className="text-sm text-gray-500 text-left mb-2">
                  {blog.folderName && `in ${blog.folderName} • `}
                  by {blog.author}
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex gap-1">
                    {blog.hashtags && blog.hashtags.length > 0 && blog.hashtags.slice(0, 2).map(tag => (
                      <span key={tag} className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
                        #{tag}
                      </span>
                    ))}
                  </div>
                  <span className="text-xs text-gray-400">{getMatchTypeLabel(blog.matchType)}</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default SearchBar;
