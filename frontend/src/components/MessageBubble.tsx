'use client';

interface MessageBubbleProps {
  role: 'user' | 'assistant';
  content: string;
  isLoading?: boolean;
}

export default function MessageBubble({ role, content, isLoading = false }: MessageBubbleProps) {
  if (isLoading) {
    return (
      <div className="flex justify-start mb-6">
        <div className="max-w-3xl">
          <div className="bg-[#171717] rounded-lg p-4">
            <div className="flex space-x-2">
              <div className="w-2 h-2 bg-[#525252] rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
              <div className="w-2 h-2 bg-[#525252] rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
              <div className="w-2 h-2 bg-[#525252] rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`flex mb-6 ${role === 'user' ? 'justify-end' : 'justify-start'}`}>
      <div className={`max-w-3xl ${role === 'user' ? 'order-2' : 'order-1'}`}>
        <div
          className={`rounded-lg p-4 ${
            role === 'user'
              ? 'bg-[#525252] text-white'
              : 'bg-[#171717] text-gray-100'
          } border border-[#525252]`}
        >
          <p className="whitespace-pre-wrap">{content}</p>
        </div>
      </div>
    </div>
  );
}
