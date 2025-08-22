import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { nanoid } from 'nanoid';
import { api } from '@/lib/api';

export interface Message {
  id: string;
  content: string;
  role: 'user' | 'assistant';
  timestamp: Date;
  citations?: Citation[];
  isCode?: boolean;
  language?: string;
  isLiked?: boolean;
  isDisliked?: boolean;
  searchQuery?: string;
  searchResults?: SearchResult[];
}

export interface Citation {
  id: string;
  title: string;
  url: string;
  snippet: string;
  source: string;
}

export interface SearchResult {
  title: string;
  url: string;
  snippet: string;
  source: string;
}

export interface ChatSession {
  id: string;
  title: string;
  messages: Message[];
  createdAt: Date;
  updatedAt: Date;
}

interface ChatState {
  messages: Message[];
  currentChatId: string | null;
  chatHistory: ChatSession[];
  isLoading: boolean;
  error: string | null;
  
  // Actions
  sendMessage: (content: string, searchEnabled: boolean) => Promise<void>;
  startNewChat: () => void;
  loadChat: (chatId: string) => void;
  deleteMessage: (messageId: string) => void;
  regenerateResponse: (messageId: string) => Promise<void>;
  likeMessage: (messageId: string) => void;
  dislikeMessage: (messageId: string) => void;
  clearChat: () => void;
  exportChat: (format: 'pdf' | 'markdown' | 'text') => Promise<void>;
  updateChatTitle: (chatId: string, title: string) => void;
  deleteChat: (chatId: string) => void;
}

export const useChatStore = create<ChatState>()(
  persist(
    (set, get) => ({
      messages: [],
      currentChatId: null,
      chatHistory: [],
      isLoading: false,
      error: null,

      sendMessage: async (content: string, searchEnabled: boolean) => {
        const state = get();
        const userMessage: Message = {
          id: nanoid(),
          content,
          role: 'user',
          timestamp: new Date(),
        };

        // Add user message
        set((state) => ({
          messages: [...state.messages, userMessage],
          isLoading: true,
          error: null,
        }));

        try {
          let response: any;
          
          if (searchEnabled) {
            // Send with web search
            response = await api.post('/chat/search', {
              message: content,
              chatId: state.currentChatId,
            });
          } else {
            // Send without web search
            response = await api.post('/chat/chat', {
              message: content,
              chatId: state.currentChatId,
            });
          }

          const assistantMessage: Message = {
            id: nanoid(),
            content: response.data.content,
            role: 'assistant',
            timestamp: new Date(),
            citations: response.data.citations,
            isCode: response.data.isCode,
            language: response.data.language,
            searchQuery: response.data.searchQuery,
            searchResults: response.data.searchResults,
          };

          // Add assistant message
          set((state) => ({
            messages: [...state.messages, assistantMessage],
            isLoading: false,
          }));

          // Update chat history
          const currentChatId = state.currentChatId || nanoid();
          const chatTitle = content.slice(0, 50) + (content.length > 50 ? '...' : '');
          
          set((state) => {
            const existingChatIndex = state.chatHistory.findIndex(
              (chat) => chat.id === currentChatId
            );

            if (existingChatIndex >= 0) {
              // Update existing chat
              const updatedHistory = [...state.chatHistory];
              updatedHistory[existingChatIndex] = {
                ...updatedHistory[existingChatIndex],
                messages: [...state.messages, userMessage, assistantMessage],
                updatedAt: new Date(),
              };
              return { chatHistory: updatedHistory };
            } else {
              // Create new chat
              const newChat: ChatSession = {
                id: currentChatId,
                title: chatTitle,
                messages: [userMessage, assistantMessage],
                createdAt: new Date(),
                updatedAt: new Date(),
              };
              return {
                chatHistory: [newChat, ...state.chatHistory],
                currentChatId,
              };
            }
          });

        } catch (error) {
          console.error('Error sending message:', error);
          set((state) => ({
            isLoading: false,
            error: 'Failed to send message. Please try again.',
          }));
          
          // Remove the user message on error
          set((state) => ({
            messages: state.messages.filter((msg) => msg.id !== userMessage.id),
          }));
        }
      },

      startNewChat: () => {
        set({
          messages: [],
          currentChatId: null,
          isLoading: false,
          error: null,
        });
      },

      loadChat: (chatId: string) => {
        const state = get();
        const chat = state.chatHistory.find((c) => c.id === chatId);
        
        if (chat) {
          set({
            messages: chat.messages,
            currentChatId: chatId,
            isLoading: false,
            error: null,
          });
        }
      },

      deleteMessage: (messageId: string) => {
        set((state) => ({
          messages: state.messages.filter((msg) => msg.id !== messageId),
        }));
      },

      regenerateResponse: async (messageId: string) => {
        const state = get();
        const messageIndex = state.messages.findIndex((msg) => msg.id === messageId);
        
        if (messageIndex === -1 || state.messages[messageIndex].role !== 'user') return;

        const userMessage = state.messages[messageIndex];
        
        // Remove the previous assistant response
        set((state) => ({
          messages: state.messages.filter((msg, index) => 
            index <= messageIndex || msg.role === 'user'
          ),
          isLoading: true,
        }));

        try {
          // Regenerate response
          const response = await api.post('/chat/regenerate', {
            message: userMessage.content,
            chatId: state.currentChatId,
          });

          const assistantMessage: Message = {
            id: nanoid(),
            content: response.data.content,
            role: 'assistant',
            timestamp: new Date(),
            citations: response.data.citations,
            isCode: response.data.isCode,
            language: response.data.language,
          };

          set((state) => ({
            messages: [...state.messages, assistantMessage],
            isLoading: false,
          }));

        } catch (error) {
          console.error('Error regenerating response:', error);
          set({ isLoading: false, error: 'Failed to regenerate response.' });
        }
      },

      likeMessage: (messageId: string) => {
        set((state) => ({
          messages: state.messages.map((msg) =>
            msg.id === messageId
              ? { ...msg, isLiked: true, isDisliked: false }
              : msg
          ),
        }));
      },

      dislikeMessage: (messageId: string) => {
        set((state) => ({
          messages: state.messages.map((msg) =>
            msg.id === messageId
              ? { ...msg, isLiked: false, isDisliked: true }
              : msg
          ),
        }));
      },

      clearChat: () => {
        set({
          messages: [],
          isLoading: false,
          error: null,
        });
      },

      exportChat: async (format: 'pdf' | 'markdown' | 'text') => {
        const state = get();
        if (state.messages.length === 0) return;

        try {
          const response = await api.post('/chat/export', {
            messages: state.messages,
            format,
          });

          // Create download link
          const blob = new Blob([response.data], {
            type: format === 'pdf' ? 'application/pdf' : 'text/plain',
          });
          const url = window.URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = `curie-chat-${new Date().toISOString().split('T')[0]}.${format}`;
          document.body.appendChild(a);
          a.click();
          window.URL.revokeObjectURL(url);
          document.body.removeChild(a);

        } catch (error) {
          console.error('Error exporting chat:', error);
          throw error;
        }
      },

      updateChatTitle: (chatId: string, title: string) => {
        set((state) => ({
          chatHistory: state.chatHistory.map((chat) =>
            chat.id === chatId ? { ...chat, title } : chat
          ),
        }));
      },

      deleteChat: (chatId: string) => {
        set((state) => ({
          chatHistory: state.chatHistory.filter((chat) => chat.id !== chatId),
        }));

        // If we're deleting the current chat, clear messages
        if (state.currentChatId === chatId) {
          set({
            messages: [],
            currentChatId: null,
          });
        }
      },
    }),
    {
      name: 'curie-chat-storage',
      partialize: (state) => ({
        chatHistory: state.chatHistory,
        currentChatId: state.currentChatId,
      }),
    }
  )
);