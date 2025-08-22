'use client';

import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Send, Paperclip, Mic, StopCircle } from 'lucide-react';

interface ChatInputProps {
  onSendMessage: (message: string) => void;
  isLoading: boolean;
  searchEnabled: boolean;
}

export function ChatInput({ onSendMessage, isLoading, searchEnabled }: ChatInputProps) {
  const [message, setMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const maxLength = 4000;
  const remainingChars = maxLength - message.length;
  const isNearLimit = remainingChars <= 100;
  const isAtLimit = remainingChars <= 0;

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 200)}px`;
    }
  }, [message]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim() && !isLoading && !isAtLimit) {
      onSendMessage(message.trim());
      setMessage('');
      if (textareaRef.current) {
        textareaRef.current.style.height = 'auto';
      }
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    if (value.length <= maxLength) {
      setMessage(value);
      setIsTyping(true);
      
      // Clear typing indicator after user stops typing
      clearTimeout((window as any).typingTimer);
      (window as any).typingTimer = setTimeout(() => {
        setIsTyping(false);
      }, 1000);
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    const pastedText = e.clipboardData.getData('text');
    if (message.length + pastedText.length > maxLength) {
      e.preventDefault();
      const truncatedText = pastedText.slice(0, maxLength - message.length);
      setMessage(message + truncatedText);
    }
  };

  return (
    <div className="relative">
      <form onSubmit={handleSubmit} className="relative">
        <div className="relative">
          <textarea
            ref={textareaRef}
            value={message}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            onPaste={handlePaste}
            placeholder={`Message Curie... ${searchEnabled ? '(Web search enabled)' : '(Web search disabled)'}`}
            className={`w-full px-4 py-3 pr-12 resize-none border border-neutral-300 dark:border-neutral-600 rounded-xl focus:border-primary-500 focus:ring-2 focus:ring-primary-200 dark:focus:ring-primary-800 transition-all duration-200 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white placeholder-neutral-500 dark:placeholder-neutral-400 ${
              isAtLimit ? 'border-red-500 focus:border-red-500 focus:ring-red-200' : ''
            }`}
            rows={1}
            maxLength={maxLength}
            disabled={isLoading}
          />
          
          {/* Character count */}
          <div className={`absolute bottom-2 right-12 text-xs ${
            isNearLimit ? 'text-orange-500' : 'text-neutral-400'
          } ${isAtLimit ? 'text-red-500' : ''}`}>
            {remainingChars}
          </div>

          {/* Send button */}
          <button
            type="submit"
            disabled={!message.trim() || isLoading || isAtLimit}
            className={`absolute right-2 top-1/2 transform -translate-y-1/2 p-2 rounded-lg transition-all duration-200 ${
              message.trim() && !isLoading && !isAtLimit
                ? 'bg-primary-600 hover:bg-primary-700 text-white shadow-lg hover:shadow-xl'
                : 'bg-neutral-200 dark:bg-neutral-700 text-neutral-400 dark:text-neutral-500 cursor-not-allowed'
            }`}
          >
            {isLoading ? (
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              >
                <StopCircle className="w-5 h-5" />
              </motion.div>
            ) : (
              <Send className="w-5 h-5" />
            )}
          </button>
        </div>
      </form>

      {/* Search indicator */}
      {searchEnabled && (
        <div className="absolute -top-8 left-0 flex items-center space-x-2 text-sm text-blue-600 dark:text-blue-400">
          <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
          <span>Web search enabled</span>
        </div>
      )}

      {/* Typing indicator */}
      {isTyping && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 10 }}
          className="absolute -top-8 right-0 text-sm text-neutral-500 dark:text-neutral-400"
        >
          Typing...
        </motion.div>
      )}

      {/* Input tips */}
      {message.length === 0 && (
        <div className="mt-2 text-xs text-neutral-500 dark:text-neutral-400">
          <span className="font-medium">Tip:</span> Press Enter to send, Shift+Enter for new line
        </div>
      )}

      {/* Character limit warning */}
      {isNearLimit && !isAtLimit && (
        <div className="mt-2 text-xs text-orange-500">
          <span className="font-medium">Warning:</span> Approaching character limit
        </div>
      )}

      {isAtLimit && (
        <div className="mt-2 text-xs text-red-500">
          <span className="font-medium">Error:</span> Character limit reached
        </div>
      )}
    </div>
  );
}