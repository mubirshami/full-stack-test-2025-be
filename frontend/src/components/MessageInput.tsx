'use client';

import { useState } from 'react';
import { PlusIcon, SendIcon } from './icons/ChatIcons';

interface MessageInputProps {
  onSend: (message: string) => void;
  disabled?: boolean;
  placeholder?: string;
}

export default function MessageInput({
  onSend,
  disabled = false,
  placeholder = 'Ask something...',
}: MessageInputProps) {
  const [message, setMessage] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim() && !disabled) {
      onSend(message.trim());
      setMessage('');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-3xl mx-auto px-4">
      <div className="relative flex items-center">
        <button
          type="button"
          className="absolute left-4 p-2 text-gray-400 hover:text-white transition-colors cursor-pointer disabled:cursor-not-allowed"
          disabled={disabled}
        >
          <PlusIcon />
        </button>
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder={placeholder}
          disabled={disabled}
          className="w-full pl-12 pr-12 py-4 bg-[#171717] border border-[#525252] rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#525252] focus:border-transparent disabled:opacity-50"
        />
        <button
          type="submit"
          disabled={!message.trim() || disabled}
          className="absolute right-4 p-2 text-gray-400 hover:text-white transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <SendIcon />
        </button>
      </div>
    </form>
  );
}
