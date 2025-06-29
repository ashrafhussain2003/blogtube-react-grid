
import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Hash, Menu, X, EyeOff } from 'lucide-react';
import FolderTreeSidebar from '../components/FolderTreeSidebar';
import HashtagBlogViewer from '../components/HashtagBlogViewer';
import { FolderNode } from '../types/folderTree';
import folderTreeData from '../data/folderTree.json';

const HashtagPage: React.FC = () => {
  const { hashtag } = useParams<{ hashtag: string }>();
  const [tree, setTree] = useState<FolderNode[]>([]);
  const [activeSlug, setActiveSlug] = useState<string | null>(null);
  const [activeBlogPath, setActiveBlogPath] = useState<string | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [sidebarHidden, setSidebarHidden] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (hashtag) {
      setLoading(true);
      
      // Get the folder tree for this hashtag
      const hashtagTree = (folderTreeData as any)[hashtag.toLowerCase()] || [];
      setTree(hashtagTree);
      
      // Find and auto-load the first blog
      const findFirstBlog = (nodes: FolderNode[]): { slug: string; path: string } | null => {
        for (const node of nodes) {
          if (node.type === 'blog' && node.slug && node.path) {
            return { slug: node.slug, path: node.path };
          }
          if (node.children) {
            const result = findFirstBlog(node.children);
            if (result) return result;
          }
        }
        return null;
      };

      const firstBlog = findFirstBlog(hashtagTree);
      if (firstBlog) {
        setActiveSlug(firstBlog.slug);
        setActiveBlogPath(firstBlog.path);
      }
      
      setLoading(false);
    }
  }, [hashtag]);

  const handleBlogSelect = (slug: string, path: string) => {
    setActiveSlug(slug);
    setActiveBlogPath(path);
    setSidebarOpen(false); // Close sidebar on mobile after selection
  };

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const toggleSidebarVisibility = () => {
    setSidebarHidden(!sidebarHidden);
    if (sidebarHidden) {
      setSidebarOpen(true);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading topics...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <Link
                to="/"
                className="flex items-center gap-2 text-blue-600 hover:text-blue-800 transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
                <span className="font-medium">Back to Blogs</span>
              </Link>
              <div className="flex items-center gap-2">
                <Hash className="w-6 h-6 text-blue-600" />
                <h1 className="text-xl font-bold text-gray-900">
                  {hashtag}
                </h1>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={toggleSidebarVisibility}
                className="p-2 text-gray-600 hover:text-gray-900 transition-colors"
                title={sidebarHidden ? "Show sidebar" : "Hide sidebar"}
              >
                <EyeOff className="w-5 h-5" />
              </button>
              <Link to="/" className="text-xl font-bold text-black">
                BlogTube
              </Link>
            </div>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        {!sidebarHidden && (
          <FolderTreeSidebar
            tree={tree}
            activeSlug={activeSlug}
            onBlogSelect={handleBlogSelect}
            isOpen={sidebarOpen}
            onToggle={toggleSidebar}
          />
        )}

        {/* Main Content */}
        <main className={`flex-1 ${sidebarHidden ? '' : 'lg:ml-0'}`}>
          {tree.length > 0 ? (
            <HashtagBlogViewer
              blogPath={activeBlogPath}
              isLoading={loading}
            />
          ) : (
            <div className="flex-1 flex items-center justify-center p-8">
              <div className="text-center">
                <Hash className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h2 className="text-2xl font-semibold text-gray-700 mb-2">
                  No topics found
                </h2>
                <p className="text-gray-500 mb-6">
                  There are no organized topics for #{hashtag} yet.
                </p>
                <Link
                  to="/"
                  className="inline-flex items-center gap-2 bg-black text-white px-6 py-3 rounded-lg hover:bg-gray-800 transition-colors"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Explore All Blogs
                </Link>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default HashtagPage;
