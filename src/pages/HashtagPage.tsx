import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Hash, ArrowLeft } from 'lucide-react';
import FolderTreeSidebar from '../components/FolderTreeSidebar';
import HashtagBlogViewer from '../components/HashtagBlogViewer';
import Navigation from '../components/Navigation';
import { FolderNode } from '../types/folderTree';
import folderTreeData from '../data/folderTree.json';

const HashtagPage: React.FC = () => {
  const { hashtag } = useParams<{ hashtag: string }>();
  const [tree, setTree] = useState<FolderNode[]>([]);
  const [activeSlug, setActiveSlug] = useState<string | null>(null);
  const [activeBlogPath, setActiveBlogPath] = useState<string | null>(null);
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
      <Navigation 
        showBackButton={true}
        backLink="/"
        backText="Blogs"
        title={
          <div className="flex items-center gap-2">
            <Hash className="w-6 h-6 text-blue-600" />
            <span>{hashtag}</span>
          </div>
        }
      />

      <div className="flex">
        {/* Static Sidebar */}
        <div className="w-80 flex-shrink-0 bg-gray-50">
          <FolderTreeSidebar
            tree={tree}
            activeSlug={activeSlug}
            onBlogSelect={handleBlogSelect}
            isOpen={true}
            onToggle={() => {}}
          />
        </div>

        {/* Main Content */}
        <main className="flex-1">
          {tree.length > 0 ? (
            <HashtagBlogViewer
              blogPath={activeBlogPath}
              isLoading={loading}
              hashtag={hashtag}
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
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default HashtagPage;
