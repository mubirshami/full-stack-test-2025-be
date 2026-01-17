const Chat = require('../models/Chat');
const Message = require('../models/Message');

const getAllChats = async (userId) => {
  const chats = await Chat.find({ userId })
    .sort({ updatedAt: -1 })
    .select('-__v');

  return chats;
};

const getChatById = async (chatId, userId) => {
  const chat = await Chat.findOne({ _id: chatId, userId });

  if (!chat) {
    throw new Error('Chat not found or access denied');
  }

  const messages = await Message.find({ chatId })
    .sort({ createdAt: 1 })
    .select('-__v');

  return {
    chat,
    messages,
  };
};

const createChat = async (userId, title = 'New Chat') => {
  const chat = await Chat.create({
    title,
    userId,
  });

  return chat;
};

const updateChatTitle = async (chatId, userId, title) => {
  const chat = await Chat.findOneAndUpdate(
    { _id: chatId, userId },
    { title },
    { new: true, runValidators: true }
  );

  if (!chat) {
    throw new Error('Chat not found or access denied');
  }

  return chat;
};

const deleteChat = async (chatId, userId) => {
  const chat = await Chat.findOne({ _id: chatId, userId });

  if (!chat) {
    throw new Error('Chat not found or access denied');
  }

  await Message.deleteMany({ chatId });

  await Chat.deleteOne({ _id: chatId });

  return { success: true };
};

module.exports = {
  getAllChats,
  getChatById,
  createChat,
  updateChatTitle,
  deleteChat,
};
