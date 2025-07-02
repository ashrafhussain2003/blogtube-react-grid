
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Hash } from 'lucide-react';
import HashtagBlogViewer from '../components/HashtagBlogViewer';
import { FolderNode } from '../types/folderTree';
import { SidebarProvider, SidebarTrigger } from '../components/ui/sidebar';
import { HashtagSidebar } from '../components/HashtagSidebar';
import { blogService } from '../services/blogService';

const HashtagPage: React.FC = () => {
  const { hashtag } = useParams<{ hashtag: string }>();
  const [tree, setTree] = useState<FolderNode[]>([]);
  const [activeSlug, setActiveSlug] = useState<string | null>(null);
  const [activeBlogPath, setActiveBlogPath] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (hashtag) {
      loadHashtagContent(hashtag);
    }
  }, [hashtag]);

  const loadHashtagContent = async (hashtagName: string) => {
    setLoading(true);
    
    try {
      // Get the folder tree for this hashtag
      const hashtagTree = await blogService.getFolderTree(hashtagName);
      setTree(hashtagTree);
      
      // Find and auto-load the first blog
      const firstBlog = findFirstBlog(hashtagTree);
      if (firstBlog) {
        setActiveSlug(firstBlog.slug);
        setActiveBlogPath(firstBlog.path);
      }
    } catch (error) {
      console.error('Error loading hashtag content:', error);
    } finally {
      setLoading(false);
    }
  };

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
    <SidebarProvider>
      <div className="min-h-screen w-full flex">
        <HashtagSidebar 
          tree={tree}
          activeSlug={activeSlug}
          onBlogSelect={handleBlogSelect}
          hashtag={hashtag || ''}
        />
        
        <div className="flex-1 flex flex-col">
          <header className="h-12 flex items-center border-b bg-white px-4">
            <SidebarTrigger className="mr-4" />
            <div className="flex items-center gap-2">
              <Hash className="w-5 h-5 text-blue-600" />
              <span className="font-semibold">{hashtag}</span>
            </div>
          </header>

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
    </SidebarProvider>
  );
};

export default HashtagPage;
