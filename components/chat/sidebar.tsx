'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, 
  Plus, 
  MessageCircle, 
  Trash2, 
  Edit3, 
  Search,
  History,
  Settings,
  HelpCircle,
  ExternalLink
} from 'lucide-react';
import { ChatSession } from '@/store/chat-store';
import { formatDistanceToNow } from 'date-fns';
import Link from 'next/link';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  onNewChat: () => void;
  chatHistory: ChatSession[];
  currentChatId: string | null;
}

export function Sidebar({
  isOpen,
  onClose,
  onNewChat,
  chatHistory,
  currentChatId,
}: SidebarProps) {
  const [editingChatId, setEditingChatId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredChats = chatHistory.filter(chat =>
    chat.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleEditStart = (chat: ChatSession) => {
    setEditingChatId(chat.id);
    setEditTitle(chat.title);
  };

  const handleEditSave = (chatId: string) => {
    // Here you would call the store method to update the title
    // For now, we'll just close the edit mode
    setEditingChatId(null);
    setEditTitle('');
  };

  const handleEditCancel = () => {
    setEditingChatId(null);
    setEditTitle('');
  };

  const handleKeyDown = (e: React.KeyboardEvent, chatId: string) => {
    if (e.key === 'Enter') {
      handleEditSave(chatId);
    } else if (e.key === 'Escape') {
      handleEditCancel();
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-black/50 z-40 lg:hidden"
            onClick={onClose}
          />

          {/* Sidebar */}
          <motion.div
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed left-0 top-0 h-full w-80 bg-white dark:bg-neutral-900 border-r border-neutral-200 dark:border-neutral-700 z-50 lg:relative lg:translate-x-0"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-neutral-200 dark:border-neutral-700">
              <h2 className="text-lg font-semibold text-neutral-900 dark:text-white">
                Chat History
              </h2>
              <button
                onClick={onClose}
                className="lg:hidden p-2 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors duration-200"
              >
                <X className="w-5 h-5 text-neutral-600 dark:text-neutral-300" />
              </button>
            </div>

            {/* New Chat Button */}
            <div className="p-4">
              <button
                onClick={onNewChat}
                className="w-full bg-gradient-to-r from-primary-600 to-secondary-600 text-white font-medium px-4 py-3 rounded-lg hover:from-primary-700 hover:to-secondary-700 transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl flex items-center justify-center space-x-2"
              >
                <Plus className="w-5 h-5" />
                <span>New Chat</span>
              </button>
            </div>

            {/* Search */}
            <div className="px-4 pb-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-neutral-400" />
                <input
                  type="text"
                  placeholder="Search chats..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-neutral-200 dark:border-neutral-700 rounded-lg bg-neutral-50 dark:bg-neutral-800 text-neutral-900 dark:text-white placeholder-neutral-500 dark:placeholder-neutral-400 focus:border-primary-500 focus:ring-2 focus:ring-primary-200 dark:focus:ring-primary-800 transition-all duration-200"
                />
              </div>
            </div>

            {/* Chat List */}
            <div className="flex-1 overflow-y-auto">
              {filteredChats.length === 0 ? (
                <div className="px-4 py-8 text-center">
                  <MessageCircle className="w-12 h-12 text-neutral-400 mx-auto mb-3" />
                  <p className="text-neutral-500 dark:text-neutral-400">
                    {searchQuery ? 'No chats found' : 'No chat history yet'}
                  </p>
                  {!searchQuery && (
                    <p className="text-sm text-neutral-400 dark:text-neutral-500 mt-1">
                      Start a new chat to begin
                    </p>
                  )}
                </div>
              ) : (
                <div className="space-y-1 px-2">
                  {filteredChats.map((chat) => (
                    <div
                      key={chat.id}
                      className={`group relative rounded-lg transition-all duration-200 ${
                        currentChatId === chat.id
                          ? 'bg-primary-100 dark:bg-primary-900/20 border border-primary-200 dark:border-primary-800'
                          : 'hover:bg-neutral-100 dark:hover:bg-neutral-800'
                      }`}
                    >
                      {editingChatId === chat.id ? (
                        <div className="p-3">
                          <input
                            type="text"
                            value={editTitle}
                            onChange={(e) => setEditTitle(e.target.value)}
                            onKeyDown={(e) => handleKeyDown(e, chat.id)}
                            onBlur={() => handleEditSave(chat.id)}
                            className="w-full px-2 py-1 border border-neutral-300 dark:border-neutral-600 rounded bg-white dark:bg-neutral-700 text-neutral-900 dark:text-white text-sm focus:border-primary-500 focus:ring-1 focus:ring-primary-200"
                            autoFocus
                          />
                        </div>
                      ) : (
                        <div className="p-3 cursor-pointer">
                          <div className="flex items-start space-x-3">
                            <MessageCircle className="w-5 h-5 text-neutral-500 dark:text-neutral-400 mt-0.5 flex-shrink-0" />
                            <div className="flex-1 min-w-0">
                              <h3 className="text-sm font-medium text-neutral-900 dark:text-white truncate">
                                {chat.title}
                              </h3>
                              <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1">
                                {formatDistanceToNow(chat.updatedAt, { addSuffix: true })}
                              </p>
                            </div>
                          </div>

                          {/* Action buttons */}
                          <div className="absolute right-2 top-1/2 transform -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center space-x-1">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleEditStart(chat);
                              }}
                              className="p-1 rounded hover:bg-neutral-200 dark:hover:bg-neutral-700 transition-colors duration-200"
                              title="Edit title"
                            >
                              <Edit3 className="w-3 h-3 text-neutral-500 dark:text-neutral-400" />
                            </button>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                // Handle delete
                              }}
                              className="p-1 rounded hover:bg-red-100 dark:hover:bg-red-900/20 transition-colors duration-200"
                              title="Delete chat"
                            >
                              <Trash2 className="w-3 h-3 text-red-500" />
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="border-t border-neutral-200 dark:border-neutral-700 p-4">
              <div className="space-y-2">
                <Link
                  href="/help"
                  className="flex items-center space-x-3 p-2 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors duration-200 text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white"
                >
                  <HelpCircle className="w-5 h-5" />
                  <span className="text-sm">Help & FAQ</span>
                </Link>
                
                <Link
                  href="/settings"
                  className="flex items-center space-x-3 p-2 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors duration-200 text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white"
                >
                  <Settings className="w-5 h-5" />
                  <span className="text-sm">Settings</span>
                </Link>

                <a
                  href="https://phiai.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center space-x-3 p-2 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors duration-200 text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white"
                >
                  <ExternalLink className="w-5 h-5" />
                  <span className="text-sm">Visit PhiAI</span>
                </a>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}