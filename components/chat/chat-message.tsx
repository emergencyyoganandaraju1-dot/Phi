'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Copy, 
  ThumbsUp, 
  ThumbsDown, 
  RefreshCw, 
  Trash2, 
  ExternalLink,
  Check,
  Brain,
  User
} from 'lucide-react';
import { Message, Citation } from '@/store/chat-store';
import { formatDistanceToNow } from 'date-fns';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { tomorrow } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { MarkdownRenderer } from './markdown-renderer';

interface ChatMessageProps {
  message: Message;
  onDelete: () => void;
  onRegenerate: () => void;
  onLike: () => void;
  onDislike: () => void;
  onCopy: () => void;
}

export function ChatMessage({
  message,
  onDelete,
  onRegenerate,
  onDislike,
  onLike,
  onCopy,
}: ChatMessageProps) {
  const [copied, setCopied] = useState(false);
  const [showCitations, setShowCitations] = useState(false);

  const isUser = message.role === 'user';
  const isCode = message.isCode && message.language;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(message.content);
      setCopied(true);
      onCopy();
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error('Failed to copy:', error);
    }
  };

  const handleCitationClick = (citation: Citation) => {
    window.open(citation.url, '_blank', 'noopener,noreferrer');
  };

  const renderContent = () => {
    if (isCode) {
      return (
        <div className="code-block">
          <div className="code-block-header">
            <span className="text-neutral-400 text-sm font-medium">
              {message.language}
            </span>
            <button
              onClick={handleCopy}
              className="p-1 hover:bg-neutral-700 rounded transition-colors duration-200"
              title="Copy code"
            >
              {copied ? (
                <Check className="w-4 h-4 text-green-400" />
              ) : (
                <Copy className="w-4 h-4 text-neutral-400" />
              )}
            </button>
          </div>
          <SyntaxHighlighter
            language={message.language}
            style={tomorrow}
            className="code-block-content"
            showLineNumbers
            wrapLines
          >
            {message.content}
          </SyntaxHighlighter>
        </div>
      );
    }

    return (
      <div className="markdown-content">
        <MarkdownRenderer content={message.content} />
      </div>
    );
  };

  const renderCitations = () => {
    if (!message.citations || message.citations.length === 0) return null;

    return (
      <div className="mt-4">
        <button
          onClick={() => setShowCitations(!showCitations)}
          className="text-sm text-secondary-600 hover:text-secondary-700 dark:text-secondary-400 dark:hover:text-secondary-300 font-medium flex items-center space-x-1 transition-colors duration-200"
        >
          <span>Sources ({message.citations.length})</span>
          <ExternalLink className="w-4 h-4" />
        </button>
        
        {showCitations && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="mt-3 space-y-3"
          >
            {message.citations.map((citation, index) => (
              <div
                key={citation.id}
                className="p-3 bg-neutral-50 dark:bg-neutral-800 rounded-lg border border-neutral-200 dark:border-neutral-700 hover:border-secondary-300 dark:hover:border-secondary-600 transition-colors duration-200"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h4 className="font-medium text-neutral-900 dark:text-white text-sm mb-1">
                      {citation.title}
                    </h4>
                    <p className="text-neutral-600 dark:text-neutral-400 text-sm mb-2">
                      {citation.snippet}
                    </p>
                    <div className="flex items-center space-x-2">
                      <span className="text-xs text-neutral-500 dark:text-neutral-500 bg-neutral-200 dark:bg-neutral-700 px-2 py-1 rounded">
                        {citation.source}
                      </span>
                      <button
                        onClick={() => handleCitationClick(citation)}
                        className="text-xs text-secondary-600 hover:text-secondary-700 dark:text-secondary-400 dark:hover:text-secondary-300 font-medium flex items-center space-x-1 transition-colors duration-200"
                      >
                        <span>Visit source</span>
                        <ExternalLink className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </motion.div>
        )}
      </div>
    );
  };

  const renderSearchResults = () => {
    if (!message.searchResults || message.searchResults.length === 0) return null;

    return (
      <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
        <div className="text-sm text-blue-700 dark:text-blue-300 mb-2 font-medium">
          Web search results for: "{message.searchQuery}"
        </div>
        <div className="space-y-2">
          {message.searchResults.slice(0, 3).map((result, index) => (
            <div key={index} className="text-xs text-blue-600 dark:text-blue-400">
              <div className="font-medium">{result.title}</div>
              <div className="text-blue-500 dark:text-blue-500">{result.source}</div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
      className={`chat-bubble ${isUser ? 'chat-bubble-user' : 'chat-bubble-ai'}`}
    >
      {/* Message Header */}
      <div className="flex items-start space-x-3 mb-4">
        <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
          isUser 
            ? 'bg-gradient-to-br from-primary-600 to-secondary-600' 
            : 'bg-gradient-to-br from-secondary-600 to-primary-600'
        }`}>
          {isUser ? (
            <User className="w-5 h-5 text-white" />
          ) : (
            <Brain className="w-5 h-5 text-white" />
          )}
        </div>
        
        <div className="flex-1 min-w-0">
          <div className="flex items-center space-x-2 mb-1">
            <span className="font-semibold text-neutral-900 dark:text-white">
              {isUser ? 'You' : 'Curie'}
            </span>
            <span className="text-xs text-neutral-500 dark:text-neutral-400">
              {formatDistanceToNow(message.timestamp, { addSuffix: true })}
            </span>
          </div>
          
          {/* Message Content */}
          <div className="text-neutral-800 dark:text-neutral-200">
            {renderContent()}
          </div>
          
          {/* Citations */}
          {renderCitations()}
          
          {/* Search Results */}
          {renderSearchResults()}
        </div>
      </div>

      {/* Message Actions */}
      {!isUser && (
        <div className="flex items-center justify-between pt-3 border-t border-neutral-200 dark:border-neutral-700">
          <div className="flex items-center space-x-2">
            {/* Like/Dislike */}
            <button
              onClick={onLike}
              className={`p-2 rounded-lg transition-colors duration-200 ${
                message.isLiked
                  ? 'text-green-600 bg-green-100 dark:bg-green-900/20'
                  : 'text-neutral-500 hover:text-green-600 hover:bg-green-100 dark:hover:bg-green-900/20'
              }`}
              title="Helpful"
            >
              <ThumbsUp className="w-4 h-4" />
            </button>
            
            <button
              onClick={onDislike}
              className={`p-2 rounded-lg transition-colors duration-200 ${
                message.isDisliked
                  ? 'text-red-600 bg-red-100 dark:bg-red-900/20'
                  : 'text-neutral-500 hover:text-red-600 hover:bg-red-100 dark:hover:bg-red-900/20'
              }`}
              title="Not helpful"
            >
              <ThumbsDown className="w-4 h-4" />
            </button>

            {/* Regenerate */}
            <button
              onClick={onRegenerate}
              className="p-2 text-neutral-500 hover:text-primary-600 hover:bg-primary-100 dark:hover:bg-primary-900/20 rounded-lg transition-colors duration-200"
              title="Regenerate response"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
          </div>

          <div className="flex items-center space-x-2">
            {/* Copy */}
            <button
              onClick={handleCopy}
              className="p-2 text-neutral-500 hover:text-neutral-700 hover:bg-neutral-100 dark:hover:bg-neutral-700 rounded-lg transition-colors duration-200"
              title="Copy message"
            >
              {copied ? (
                <Check className="w-4 h-4 text-green-600" />
              ) : (
                <Copy className="w-4 h-4" />
              )}
            </button>

            {/* Delete */}
            <button
              onClick={onDelete}
              className="p-2 text-neutral-500 hover:text-red-600 hover:bg-red-100 dark:hover:bg-red-900/20 rounded-lg transition-colors duration-200"
              title="Delete message"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </motion.div>
  );
}