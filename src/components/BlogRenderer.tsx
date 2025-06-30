
import React from 'react';
import { BlogBlock } from '../types/blog';

interface BlogRendererProps {
  blocks: BlogBlock[];
}

const BlogRenderer: React.FC<BlogRendererProps> = ({ blocks }) => {
  const renderBlock = (block: BlogBlock, index: number) => {
    switch (block.type) {
      case 'title':
        // Skip rendering title blocks as they're handled in the header
        return null;

      case 'text':
        return (
          <p key={index} className="text-gray-700 leading-relaxed mb-4">
            {block.content}
          </p>
        );

      case 'image':
        return (
          <div key={index} className="my-6">
            <img
              src={`/api/placeholder/800/400`}
              alt={block.alt || 'Blog image'}
              className="w-full rounded-lg shadow-md"
              loading="lazy"
            />
            {block.alt && (
              <p className="text-sm text-gray-500 text-center mt-2 italic">
                {block.alt}
              </p>
            )}
          </div>
        );

      case 'note':
        return (
          <div key={index} className="my-4 p-4 bg-green-50 border-l-4 border-green-400 rounded-r-lg">
            <div className="flex">
              <div className="text-green-700">
                <strong>Note:</strong> {block.content}
              </div>
            </div>
          </div>
        );

      case 'alert':
        return (
          <div key={index} className="my-4 p-4 bg-red-50 border-l-4 border-red-400 rounded-r-lg">
            <div className="flex">
              <div className="text-red-700">
                <strong>Alert:</strong> {block.content}
              </div>
            </div>
          </div>
        );

      case 'meta':
        return null; // Meta blocks are handled separately

      default:
        return null;
    }
  };

  return (
    <div className="prose max-w-none">
      {blocks.map((block, index) => renderBlock(block, index))}
    </div>
  );
};

export default BlogRenderer;
