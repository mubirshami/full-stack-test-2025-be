// Chat Service

import { apiService } from './api';
import { Message } from './messageService';

export interface Chat {
  _id: string;
  title: string;
  userId: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateChatData {
  title?: string;
}

export interface ChatWithMessages {
  chat: Chat;
  messages: Message[];
}

class ChatService {
  async getAllChats(): Promise<Chat[]> {
    const response = await apiService.get<Chat[]>('/chats');
    if (response.success && response.data) {
      return response.data;
    }
    return [];
  }

  async getChatById(chatId: string): Promise<ChatWithMessages> {
    const response = await apiService.get<ChatWithMessages>(`/chats/${chatId}`);
    if (response.success && response.data) {
      return response.data;
    }
    throw new Error(response.message || 'Failed to fetch chat');
  }

  async createChat(data: CreateChatData = {}): Promise<Chat> {
    const response = await apiService.post<Chat>('/chats', data);
    if (response.success && response.data) {
      return response.data;
    }
    throw new Error(response.message || 'Failed to create chat');
  }

  async updateChat(chatId: string, title: string): Promise<Chat> {
    const response = await apiService.put<Chat>(`/chats/${chatId}`, { title });
    if (response.success && response.data) {
      return response.data;
    }
    throw new Error(response.message || 'Failed to update chat');
  }

  async deleteChat(chatId: string): Promise<void> {
    const response = await apiService.delete(`/chats/${chatId}`);
    if (!response.success) {
      throw new Error(response.message || 'Failed to delete chat');
    }
  }
}

export const chatService = new ChatService();
