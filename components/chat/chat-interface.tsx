'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Send, 
  Plus, 
  Search, 
  Copy, 
  ThumbsUp, 
  ThumbsDown, 
  RefreshCw, 
  Share2, 
  Download, 
  Trash2,
  MessageCircle,
  ArrowLeft,
  Settings,
  History,
  Globe,
  Code,
  FileText,
  Brain
} from 'lucide-react';
import { ChatMessage } from './chat-message';
import { ChatInput } from './chat-input';
import { Sidebar } from './sidebar';
import { useChatStore } from '@/store/chat-store';
import { useTheme } from 'next-themes';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { toast } from 'react-hot-toast';

export function ChatInterface() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isSearchEnabled, setIsSearchEnabled] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { theme } = useTheme();
  
  const {
    messages,
    currentChatId,
    isLoading,
    sendMessage,
    startNewChat,
    deleteMessage,
    regenerateResponse,
    likeMessage,
    dislikeMessage,
    exportChat,
    clearChat,
    chatHistory
  } = useChatStore();

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, scrollToBottom]);

  const handleSendMessage = async (content: string) => {
    if (!content.trim()) return;
    
    try {
      await sendMessage(content, isSearchEnabled);
    } catch (error) {
      toast.error('Failed to send message. Please try again.');
      console.error('Error sending message:', error);
    }
  };

  const handleNewChat = () => {
    startNewChat();
    setIsSidebarOpen(false);
  };

  const handleExport = async (format: 'pdf' | 'markdown' | 'text') => {
    try {
      await exportChat(format);
      toast.success(`Chat exported as ${format.toUpperCase()}`);
    } catch (error) {
      toast.error('Failed to export chat');
      console.error('Error exporting chat:', error);
    }
  };

  const handleShare = async () => {
    try {
      const shareData = {
        title: 'Chat with Curie',
        text: 'Check out this conversation with Curie, the AI assistant by PhiAI!',
        url: window.location.href,
      };

      if (navigator.share) {
        await navigator.share(shareData);
      } else {
        await navigator.clipboard.writeText(window.location.href);
        toast.success('Chat link copied to clipboard!');
      }
    } catch (error) {
      console.error('Error sharing chat:', error);
      toast.error('Failed to share chat');
    }
  };

  return (
    <div className="min-h-screen bg-background-base dark:bg-neutral-900">
      <Header />
      
      <div className="flex h-screen pt-16">
        {/* Sidebar */}
        <Sidebar
          isOpen={isSidebarOpen}
          onClose={() => setIsSidebarOpen(false)}
          onNewChat={handleNewChat}
          chatHistory={chatHistory}
          currentChatId={currentChatId}
        />

        {/* Main Chat Area */}
        <div className="flex-1 flex flex-col">
          {/* Chat Header */}
          <div className="bg-white dark:bg-neutral-800 border-b border-neutral-200 dark:border-neutral-700 px-4 py-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <button
                  onClick={() => setIsSidebarOpen(true)}
                  className="lg:hidden p-2 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-700 transition-colors duration-200"
                >
                  <MessageCircle className="w-5 h-5 text-neutral-600 dark:text-neutral-300" />
                </button>
                
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 bg-gradient-to-br from-primary-600 to-secondary-600 rounded-lg flex items-center justify-center">
                    <Brain className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <div className="font-semibold text-neutral-900 dark:text-white">
                      <span className="text-primary-600">Curie</span>
                    </div>
                    <div className="text-sm text-neutral-500 dark:text-neutral-400">
                      AI Assistant by PhiAI
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                {/* Search Toggle */}
                <button
                  onClick={() => setIsSearchEnabled(!isSearchEnabled)}
                  className={`p-2 rounded-lg transition-all duration-200 ${
                    isSearchEnabled
                      ? 'bg-primary-100 text-primary-600 dark:bg-primary-900/20 dark:text-primary-400'
                      : 'bg-neutral-100 text-neutral-600 dark:bg-neutral-700 dark:text-neutral-300'
                  }`}
                  title={isSearchEnabled ? 'Web search enabled' : 'Web search disabled'}
                >
                  <Globe className="w-5 h-5" />
                </button>

                {/* Settings */}
                <button className="p-2 rounded-lg bg-neutral-100 hover:bg-neutral-200 dark:bg-neutral-700 dark:hover:bg-neutral-600 transition-colors duration-200">
                  <Settings className="w-5 h-5 text-neutral-600 dark:text-neutral-300" />
                </button>
              </div>
            </div>
          </div>

          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto px-4 py-6 space-y-6">
            <AnimatePresence>
              {messages.length === 0 ? (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6 }}
                  className="text-center max-w-2xl mx-auto pt-20"
                >
                  <div className="w-20 h-20 bg-gradient-to-br from-primary-100 to-secondary-100 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Brain className="w-10 h-10 text-primary-600" />
                  </div>
                  <h2 className="text-2xl font-bold text-neutral-900 dark:text-white mb-4">
                    Welcome to <span className="gradient-text">Curie</span>
                  </h2>
                  <p className="text-neutral-600 dark:text-neutral-400 mb-8 text-lg">
                    I'm your AI assistant, ready to help with any question. I can search the web, 
                    generate code, explain concepts, and much more. What would you like to know?
                  </p>
                  
                  {/* Quick Start Suggestions */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-lg mx-auto">
                    {[
                      "What's the latest news about AI?",
                      "Explain quantum computing in simple terms",
                      "Write a Python function to sort a list",
                      "What are the benefits of renewable energy?"
                    ].map((suggestion, index) => (
                      <button
                        key={index}
                        onClick={() => handleSendMessage(suggestion)}
                        className="p-3 text-left bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg hover:border-primary-300 dark:hover:border-primary-600 transition-colors duration-200 text-sm text-neutral-700 dark:text-neutral-300"
                      >
                        {suggestion}
                      </button>
                    ))}
                  </div>
                </motion.div>
              ) : (
                messages.map((message, index) => (
                  <ChatMessage
                    key={message.id}
                    message={message}
                    onDelete={() => deleteMessage(message.id)}
                    onRegenerate={() => regenerateResponse(message.id)}
                    onLike={() => likeMessage(message.id)}
                    onDislike={() => dislikeMessage(message.id)}
                    onCopy={() => {
                      navigator.clipboard.writeText(message.content);
                      toast.success('Message copied to clipboard!');
                    }}
                  />
                ))
              )}
            </AnimatePresence>

            {/* Loading Indicator */}
            {isLoading && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="chat-bubble-ai"
              >
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-gradient-to-br from-primary-600 to-secondary-600 rounded-full flex items-center justify-center">
                    <Brain className="w-5 h-5 text-white" />
                  </div>
                  <div className="flex-1">
                    <div className="typing-indicator">
                      <div className="typing-dot"></div>
                      <div className="typing-dot"></div>
                      <div className="typing-dot"></div>
                    </div>
                    <div className="text-sm text-neutral-500 mt-2">
                      {isSearchEnabled ? 'Searching the web and thinking...' : 'Thinking...'}
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Chat Input */}
          <div className="border-t border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 p-4">
            <ChatInput
              onSendMessage={handleSendMessage}
              isLoading={isLoading}
              searchEnabled={isSearchEnabled}
            />
          </div>

          {/* Chat Actions */}
          {messages.length > 0 && (
            <div className="bg-white dark:bg-neutral-800 border-t border-neutral-200 dark:border-neutral-700 px-4 py-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2 text-sm text-neutral-500 dark:text-neutral-400">
                  <span>{messages.length} messages</span>
                  {isSearchEnabled && (
                    <span className="flex items-center space-x-1">
                      <Globe className="w-4 h-4" />
                      <span>Web search enabled</span>
                    </span>
                  )}
                </div>

                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => handleExport('text')}
                    className="p-2 text-neutral-500 hover:text-neutral-700 dark:text-neutral-400 dark:hover:text-neutral-200 transition-colors duration-200"
                    title="Export as text"
                  >
                    <FileText className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleExport('markdown')}
                    className="p-2 text-neutral-500 hover:text-neutral-700 dark:text-neutral-400 dark:hover:text-neutral-200 transition-colors duration-200"
                    title="Export as markdown"
                  >
                    <Code className="w-4 h-4" />
                  </button>
                  <button
                    onClick={handleShare}
                    className="p-2 text-neutral-500 hover:text-neutral-700 dark:text-neutral-400 dark:hover:text-neutral-200 transition-colors duration-200"
                    title="Share chat"
                  >
                    <Share2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={clearChat}
                    className="p-2 text-neutral-500 hover:text-red-600 dark:text-neutral-400 dark:hover:text-red-400 transition-colors duration-200"
                    title="Clear chat"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      <Footer />
    </div>
  );
}