'use client';

import { useState } from 'react';
import { MenuIcon, SettingsIcon, NewChatIcon, QuickActionsIcon, SpacesIcon, ChatHistoryIcon } from './icons/SidebarIcons';

interface Chat {
  id: string;
  title: string;
  preview?: string;
}

interface User {
  name: string;
  email: string;
  avatar?: string;
}

interface SidebarProps {
  chats?: Chat[];
  currentChatId?: string;
  onChatSelect?: (chatId: string) => void;
  onNewChat?: () => void;
  user?: User;
}

export default function Sidebar({
  chats = [],
  currentChatId,
  onChatSelect,
  onNewChat,
  user,
}: SidebarProps) {
  // Static data for now - will be replaced with backend data


  const displayChats = chats.length > 0 ? chats : [];
  const displayUser = user;

  const handleChatClick = (chatId: string) => {
    if (onChatSelect) {
      onChatSelect(chatId);
    }
  };

  return (
    <div className="w-64 h-screen bg-[#171717] flex flex-col text-white">
      {/* Top Section */}
      <div className="flex items-center justify-between p-2">
        <button className="p-2 hover:bg-[#525252] rounded-lg transition-colors cursor-pointer">
          <MenuIcon />
        </button>
        <button className="p-2 hover:bg-[#525252] rounded-lg transition-colors cursor-pointer">
          <SettingsIcon />
        </button>
      </div>

      {/* Navigation Menu */}
      <div className="px-2 py-2 space-y-1">
        <button
          onClick={onNewChat}
          className="w-full flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-[#525252] transition-colors text-left cursor-pointer"
        >
          <NewChatIcon />
          <span className="text-sm font-medium">New chat</span>
        </button>

        <button className="w-full flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-[#525252] transition-colors text-left cursor-pointer">
          <QuickActionsIcon />
          <span className="text-sm font-medium">Quick Actions</span>
        </button>

        <button className="w-full flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-[#525252] transition-colors text-left cursor-pointer">
          <SpacesIcon />
          <span className="text-sm font-medium">Spaces</span>
        </button>

        <button className="w-full flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-[#525252] transition-colors text-left cursor-pointer">
          <ChatHistoryIcon />
          <span className="text-sm font-medium">Chat History</span>
        </button>
      </div>

      {/* Chat History List */}
      <div className="flex-1 overflow-y-auto px-2 py-2">
        <div className="space-y-1">
          {displayChats.map((chat) => (
            <button
              key={chat.id}
              onClick={() => handleChatClick(chat.id)}
              className={`w-full text-left px-3 py-2 rounded-lg transition-colors cursor-pointer ${
                currentChatId === chat.id
                  ? 'bg-[#525252] text-white'
                  : 'text-gray-300 hover:bg-[#525252] hover:text-white'
              }`}
            >
              <p className="text-sm truncate">{chat.title}</p>
            </button>
          ))}
        </div>
      </div>

      {/* User Profile Section */}
      <div className="p-4">
        <div className="flex items-center gap-3">
          {/* Profile Picture */}
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 flex-shrink-0">
            {displayUser?.avatar && (
              <img
                src={displayUser?.avatar}
                alt={displayUser?.name}
                className="w-full h-full rounded-full object-cover"
              />
            )}
          </div>

          {/* User Info */}
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-white truncate">{displayUser?.name}</p>
            <p className="text-xs text-gray-400 truncate">{displayUser?.email}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
