
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

      case 'heading':
        const HeadingTag = `h${block.level}` as keyof JSX.IntrinsicElements;
        const headingClasses = {
          1: 'text-3xl font-bold text-gray-900 mt-8 mb-4',
          2: 'text-2xl font-semibold text-gray-800 mt-6 mb-3',
          3: 'text-xl font-medium text-gray-800 mt-4 mb-2',
          4: 'text-lg font-medium text-gray-700 mt-3 mb-2',
          5: 'text-base font-medium text-gray-700 mt-2 mb-1',
          6: 'text-sm font-medium text-gray-600 mt-2 mb-1'
        };
        return (
          <HeadingTag key={index} className={headingClasses[block.level as keyof typeof headingClasses] || headingClasses[1]}>
            {block.content}
          </HeadingTag>
        );

      case 'text':
        return (
          <p key={index} className="text-gray-700 leading-relaxed mb-4">
            {block.content}
          </p>
        );

      case 'code':
        return (
          <pre key={index} className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto mb-6">
            <code className="text-sm font-mono">{block.content}</code>
          </pre>
        );

      case 'list':
        const ListTag = block.ordered ? 'ol' : 'ul';
        const listClass = block.ordered ? 'list-decimal list-inside' : 'list-disc list-inside';
        return (
          <ListTag key={index} className={`${listClass} text-gray-700 mb-4 space-y-1`}>
            {block.items?.map((item, itemIndex) => (
              <li key={itemIndex} className="leading-relaxed">{item}</li>
            ))}
          </ListTag>
        );

      case 'image':
        return (
          <div key={index} className="my-6">
            <img
              src={block.content}
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
          <div key={index} className="my-4 p-4 bg-blue-50 border-l-4 border-blue-400 rounded-r-lg">
            <div className="flex">
              <div className="text-blue-700">
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

      case 'quote':
        return (
          <blockquote key={index} className="border-l-4 border-gray-300 pl-4 py-2 my-4 italic text-gray-600 bg-gray-50 rounded-r">
            {block.content}
          </blockquote>
        );

      case 'meta':
        return null; // Meta blocks are handled separately

      default:
        return null;
    }
  };

  return (
    <div className="prose prose-lg max-w-none">
      {blocks.map((block, index) => renderBlock(block, index))}
    </div>
  );
};

export default BlogRenderer;
