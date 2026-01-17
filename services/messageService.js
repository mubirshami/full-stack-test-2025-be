const Message = require('../models/Message');
const Chat = require('../models/Chat');
const { simulateLLMCall } = require('./llmService');

const getMessagesByChatId = async (chatId, userId) => {
  const chat = await Chat.findOne({ _id: chatId, userId });

  if (!chat) {
    throw new Error('Chat not found or access denied');
  }

  const messages = await Message.find({ chatId })
    .sort({ createdAt: 1 })
    .select('-__v');

  return messages;
};

const sendMessage = async (chatId, userId, content) => {
  const chat = await Chat.findOne({ _id: chatId, userId });

  if (!chat) {
    throw new Error('Chat not found or access denied');
  }

  const userMessage = await Message.create({
    chatId,
    role: 'user',
    content,
  });

  await Chat.findByIdAndUpdate(chatId, { updatedAt: new Date() });

  const llmResponsePromise = simulateLLMCall(content);

  return {
    userMessage,
    llmResponsePromise,
  };
};

const getLLMResponse = async (chatId, userId, userMessageContent) => {
  const chat = await Chat.findOne({ _id: chatId, userId });

  if (!chat) {
    throw new Error('Chat not found or access denied');
  }

  const llmResult = await simulateLLMCall(userMessageContent);

  const assistantMessage = await Message.create({
    chatId,
    role: 'assistant',
    content: llmResult.message,
  });

  await Chat.findByIdAndUpdate(chatId, { updatedAt: new Date() });

  return assistantMessage;
};

module.exports = {
  getMessagesByChatId,
  sendMessage,
  getLLMResponse,
};
