'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Sidebar from '@/components/Sidebar';
import Logo from '@/components/Logo';
import MessageInput from '@/components/MessageInput';
import MessageBubble from '@/components/MessageBubble';
import { HistoryIcon } from '@/components/icons/ChatIcons';
import { authService } from '@/services/authService';
import { chatService, Chat } from '@/services/chatService';
import { messageService, Message } from '@/services/messageService';
import { getAuthToken } from '@/config/api';

export default function ChatPage() {
  const router = useRouter();
  const [currentChat, setCurrentChat] = useState<Chat | null>(null);
  const [chats, setChats] = useState<Chat[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasMessages, setHasMessages] = useState(false);
  const [user, setUser] = useState(authService.getCurrentUser());

  // Check authentication and load chats
  useEffect(() => {
    const token = getAuthToken();
    if (!token) {
      router.push('/login');
      return;
    }

    // Load chats
    loadChats();
  }, [router]);

  const loadChats = async () => {
    try {
      const chatList = await chatService.getAllChats();
      setChats(chatList);
    } catch (error) {
      console.error('Error loading chats:', error);
    }
  };

  const handleSendMessage = async (content: string) => {
    let chatId = currentChat?._id;

    // Create new chat if needed
    if (!chatId) {
      try {
        const newChat = await chatService.createChat({
          title: content.substring(0, 50) + (content.length > 50 ? '...' : ''),
        });
        setCurrentChat(newChat);
        chatId = newChat._id;
        await loadChats(); // Refresh chat list
      } catch (error) {
        console.error('Error creating chat:', error);
        return;
      }
    }

    // Send message to backend
    setIsLoading(true);
    setHasMessages(true);

    try {
      // Send message (backend will save user message and start LLM processing)
      await messageService.sendMessage(chatId, { content });

      // Refresh messages to get the user message
      const updatedMessages = await messageService.getMessages(chatId);
      setMessages(updatedMessages);

      // Poll for LLM response (backend has 10-20 second delay)
      const assistantMessage = await messageService.pollForResponse(chatId);

      if (assistantMessage) {
        // Refresh messages again to get assistant response
        const finalMessages = await messageService.getMessages(chatId);
        setMessages(finalMessages);
      }
    } catch (error) {
      console.error('Error sending message:', error);
      // TODO: Show error message to user
    } finally {
      setIsLoading(false);
    }
  };

  const handleChatSelect = async (chatId: string) => {
    try {
      const chatData = await chatService.getChatById(chatId);
      setCurrentChat(chatData.chat);
      setMessages(chatData.messages);
      setHasMessages(chatData.messages.length > 0);
    } catch (error) {
      console.error('Error loading chat:', error);
    }
  };

  const handleNewChat = () => {
    setCurrentChat(null);
    setMessages([]);
    setHasMessages(false);
  };

  return (
    <div className="flex h-screen bg-[#171717]">
      {/* Sidebar */}
      <Sidebar
        chats={chats.map((chat) => ({
          id: chat._id,
          title: chat.title,
        }))}
        currentChatId={currentChat?._id}
        onChatSelect={handleChatSelect}
        onNewChat={handleNewChat}
        user={user ? {
          name: user.name,
          email: user.email,
          avatar: user.avatar,
        } : undefined}
      />

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col border-l border-[#525252]">
        {/* Top Bar */}
        <div className="flex items-center justify-between p-4">
          <div className="flex items-center gap-4">
            <button
              onClick={() => router.push('/chat')}
              className="p-2 text-gray-400 hover:text-white transition-colors cursor-pointer"
            >
            </button>
          </div>
        </div>

        {/* Chat Content */}
        <div className="flex-1 overflow-y-auto">
          {!hasMessages ? (
            // Initial State - Logo and Input
            <div className="flex flex-col items-center justify-center h-full px-4">
              <div className="mb-12">
                <Logo />
              </div>
              <div className="w-full max-w-3xl">
                <MessageInput onSend={handleSendMessage} disabled={isLoading} />
              </div>
            </div>
          ) : (
            // Chat Messages State
            <div className="max-w-3xl mx-auto px-4 py-8">
              {messages.map((message) => (
                <MessageBubble
                  key={message._id}
                  role={message.role}
                  content={message.content}
                />
              ))}
              {isLoading && <MessageBubble role="assistant" content="" isLoading={true} />}
            </div>
          )}
        </div>

        {/* Message Input (shown when messages exist) */}
        {hasMessages && (
          <div className="border-t border-gray-800 p-4">
            <MessageInput onSend={handleSendMessage} disabled={isLoading} />
          </div>
        )}
      </div>
    </div>
  );
}
