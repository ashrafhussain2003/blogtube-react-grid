
import React, { useState } from 'react';
import { ChevronRight, ChevronDown, Folder, FolderOpen, FileText } from 'lucide-react';
import { FolderNode } from '../types/folderTree';

interface FolderTreeSidebarProps {
  tree: FolderNode[];
  activeSlug: string | null;
  onBlogSelect: (slug: string, path: string) => void;
  isOpen: boolean;
  onToggle: () => void;
}

const FolderTreeSidebar: React.FC<FolderTreeSidebarProps> = ({
  tree,
  activeSlug,
  onBlogSelect,
}) => {
  const [expandedNodes, setExpandedNodes] = useState<Set<string>>(new Set());

  const toggleNode = (nodePath: string) => {
    const newExpanded = new Set(expandedNodes);
    if (newExpanded.has(nodePath)) {
      newExpanded.delete(nodePath);
    } else {
      newExpanded.add(nodePath);
    }
    setExpandedNodes(newExpanded);
  };

  const renderNode = (node: FolderNode, depth: number = 0, path: string = '') => {
    const nodePath = `${path}/${node.name}`;
    const isExpanded = expandedNodes.has(nodePath) || node.isOpen;
    const isActive = node.type === 'blog' && node.slug === activeSlug;

    return (
      <div key={nodePath} className="select-none">
        <div
          className={`flex items-center py-2 px-3 cursor-pointer hover:bg-gray-100 transition-colors ${
            isActive ? 'bg-blue-50 text-blue-600 border-r-2 border-blue-600' : 'text-gray-700'
          }`}
          style={{ paddingLeft: `${12 + depth * 16}px` }}
          onClick={() => {
            if (node.type === 'folder') {
              toggleNode(nodePath);
            } else if (node.type === 'blog' && node.slug && node.path) {
              onBlogSelect(node.slug, node.path);
            }
          }}
        >
          {node.type === 'folder' && (
            <>
              {isExpanded ? (
                <ChevronDown className="w-4 h-4 mr-1 text-gray-500" />
              ) : (
                <ChevronRight className="w-4 h-4 mr-1 text-gray-500" />
              )}
              {isExpanded ? (
                <FolderOpen className="w-4 h-4 mr-2 text-blue-500" />
              ) : (
                <Folder className="w-4 h-4 mr-2 text-gray-500" />
              )}
            </>
          )}
          {node.type === 'blog' && (
            <FileText className={`w-4 h-4 mr-2 ml-5 ${isActive ? 'text-blue-600' : 'text-gray-500'}`} />
          )}
          <span className="text-sm font-medium truncate">{node.name}</span>
        </div>
        
        {node.type === 'folder' && isExpanded && node.children && (
          <div>
            {node.children.map(child => renderNode(child, depth + 1, nodePath))}
          </div>
        )}
      </div>
    );
  };

  return (
    <aside className="h-screen bg-white border-r border-gray-200 overflow-y-auto sticky top-0">
      <div className="p-4 border-b border-gray-200">
        <h2 className="text-lg font-semibold text-gray-900">Topics</h2>
      </div>
      <nav className="py-2">
        {tree.map(node => renderNode(node))}
      </nav>
    </aside>
  );
};

export default FolderTreeSidebar;
