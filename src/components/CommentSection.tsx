
import React, { useState } from 'react';
import { Comment } from '../types/blog';
import { User, MessageCircle, Edit2, Trash2 } from 'lucide-react';

interface CommentSectionProps {
  blogSlug: string;
}

const CommentSection: React.FC<CommentSectionProps> = ({ blogSlug }) => {
  const [comments, setComments] = useState<Comment[]>([
    {
      id: '1',
      author: 'John Doe',
      content: 'Great article! Really helped me understand the concepts better.',
      timestamp: '2024-01-15T10:30:00Z',
      replies: [
        {
          id: '2',
          author: 'Jane Smith',
          content: 'I agree! The examples were very clear.',
          timestamp: '2024-01-15T11:00:00Z'
        }
      ]
    }
  ]);
  
  const [newComment, setNewComment] = useState('');
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [replyContent, setReplyContent] = useState('');

  const addComment = () => {
    if (newComment.trim()) {
      const comment: Comment = {
        id: Date.now().toString(),
        author: 'Anonymous User',
        content: newComment,
        timestamp: new Date().toISOString(),
        replies: []
      };
      setComments([...comments, comment]);
      setNewComment('');
    }
  };

  const addReply = (parentId: string) => {
    if (replyContent.trim()) {
      const reply: Comment = {
        id: Date.now().toString(),
        author: 'Anonymous User',
        content: replyContent,
        timestamp: new Date().toISOString()
      };

      setComments(comments.map(comment => {
        if (comment.id === parentId) {
          return {
            ...comment,
            replies: [...(comment.replies || []), reply]
          };
        }
        return comment;
      }));
      
      setReplyContent('');
      setReplyingTo(null);
    }
  };

  const deleteComment = (commentId: string, parentId?: string) => {
    if (parentId) {
      setComments(comments.map(comment => {
        if (comment.id === parentId) {
          return {
            ...comment,
            replies: comment.replies?.filter(reply => reply.id !== commentId) || []
          };
        }
        return comment;
      }));
    } else {
      setComments(comments.filter(comment => comment.id !== commentId));
    }
  };

  const formatDate = (timestamp: string) => {
    return new Date(timestamp).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const renderComment = (comment: Comment, isReply: boolean = false) => (
    <div key={comment.id} className={`${isReply ? 'ml-8 border-l-2 border-gray-200 pl-4' : ''} mb-4`}>
      <div className="bg-gray-50 rounded-lg p-4">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <User className="w-5 h-5 text-gray-400" />
            <span className="font-medium text-gray-900">{comment.author}</span>
            <span className="text-sm text-gray-500">{formatDate(comment.timestamp)}</span>
          </div>
          <div className="flex gap-2">
            <button className="text-gray-400 hover:text-blue-500 transition-colors">
              <Edit2 className="w-4 h-4" />
            </button>
            <button 
              onClick={() => deleteComment(comment.id)}
              className="text-gray-400 hover:text-red-500 transition-colors"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>
        
        <p className="text-gray-700 mb-3">{comment.content}</p>
        
        {!isReply && (
          <button
            onClick={() => setReplyingTo(replyingTo === comment.id ? null : comment.id)}
            className="flex items-center gap-1 text-sm text-blue-600 hover:text-blue-700 transition-colors"
          >
            <MessageCircle className="w-4 h-4" />
            Reply
          </button>
        )}
        
        {replyingTo === comment.id && (
          <div className="mt-3 p-3 bg-white rounded border">
            <textarea
              value={replyContent}
              onChange={(e) => setReplyContent(e.target.value)}
              placeholder="Write a reply..."
              className="w-full p-2 border border-gray-300 rounded resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows={3}
            />
            <div className="flex gap-2 mt-2">
              <button
                onClick={() => addReply(comment.id)}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
              >
                Reply
              </button>
              <button
                onClick={() => {
                  setReplyingTo(null);
                  setReplyContent('');
                }}
                className="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>
      
      {comment.replies && comment.replies.length > 0 && (
        <div className="mt-4">
          {comment.replies.map(reply => renderComment(reply, true))}
        </div>
      )}
    </div>
  );

  return (
    <div className="mt-8">
      <h3 className="text-2xl font-semibold mb-6 flex items-center gap-2">
        <MessageCircle className="w-6 h-6" />
        Comments ({comments.length})
      </h3>
      
      <div className="mb-6">
        <textarea
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          placeholder="Share your thoughts..."
          className="w-full p-4 border border-gray-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
          rows={4}
        />
        <button
          onClick={addComment}
          className="mt-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          Post Comment
        </button>
      </div>
      
      <div>
        {comments.map(comment => renderComment(comment))}
      </div>
    </div>
  );
};

export default CommentSection;
