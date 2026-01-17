const chatService = require('../services/chatService');

const getAllChats = async (req, res) => {
  try {
    const chats = await chatService.getAllChats(req.user._id);

    res.status(200).json({
      success: true,
      count: chats.length,
      data: chats,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const getChatById = async (req, res) => {
  try {
    const { chatId } = req.params;
    const result = await chatService.getChatById(chatId, req.user._id);

    res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    res.status(404).json({
      success: false,
      message: error.message,
    });
  }
};

const createChat = async (req, res) => {
  try {
    const { title } = req.body;
    const chat = await chatService.createChat(req.user._id, title);

    res.status(201).json({
      success: true,
      message: 'Chat created successfully',
      data: chat,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

const updateChat = async (req, res) => {
  try {
    const { chatId } = req.params;
    const { title } = req.body;

    if (!title) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a title',
      });
    }

    const chat = await chatService.updateChatTitle(chatId, req.user._id, title);

    res.status(200).json({
      success: true,
      message: 'Chat updated successfully',
      data: chat,
    });
  } catch (error) {
    res.status(404).json({
      success: false,
      message: error.message,
    });
  }
};

const deleteChat = async (req, res) => {
  try {
    const { chatId } = req.params;
    await chatService.deleteChat(chatId, req.user._id);

    res.status(200).json({
      success: true,
      message: 'Chat deleted successfully',
    });
  } catch (error) {
    res.status(404).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  getAllChats,
  getChatById,
  createChat,
  updateChat,
  deleteChat,
};
