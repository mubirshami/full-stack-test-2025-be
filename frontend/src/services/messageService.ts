// Message Service

import { apiService } from './api';

export interface Message {
  _id: string;
  chatId: string;
  role: 'user' | 'assistant';
  content: string;
  createdAt: string;
  updatedAt: string;
}

export interface SendMessageData {
  content: string;
}

class MessageService {
  async getMessages(chatId: string): Promise<Message[]> {
    const response = await apiService.get<Message[]>(`/chats/${chatId}/messages`);
    if (response.success && response.data) {
      return response.data;
    }
    return [];
  }

  async sendMessage(chatId: string, data: SendMessageData): Promise<Message> {
    const response = await apiService.post<{
      userMessage: Message;
      status: string;
      note: string;
    }>(`/chats/${chatId}/messages`, data);

    if (response.success && response.data) {
      return response.data.userMessage;
    }
    throw new Error(response.message || 'Failed to send message');
  }

  // Poll for LLM response
  async pollForResponse(chatId: string, maxAttempts: number = 30): Promise<Message | null> {
    for (let i = 0; i < maxAttempts; i++) {
      await new Promise((resolve) => setTimeout(resolve, 2000)); // Wait 2 seconds between polls

      try {
        const messages = await this.getMessages(chatId);
        const lastMessage = messages[messages.length - 1];

        if (lastMessage && lastMessage.role === 'assistant') {
          // Check if this is a new assistant message (not the one we just sent)
          const messageAge = Date.now() - new Date(lastMessage.createdAt).getTime();
          if (messageAge < 30000) {
            // Message is less than 30 seconds old, likely the new response
            return lastMessage;
          }
        }
      } catch (error) {
        console.error('Error polling for response:', error);
      }
    }

    return null; // Timeout
  }
}

export const messageService = new MessageService();
