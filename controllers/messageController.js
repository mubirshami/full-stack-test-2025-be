const messageService = require('../services/messageService');

const getMessages = async (req, res) => {
  try {
    const { chatId } = req.params;
    const messages = await messageService.getMessagesByChatId(chatId, req.user._id);

    res.status(200).json({
      success: true,
      count: messages.length,
      data: messages,
    });
  } catch (error) {
    res.status(404).json({
      success: false,
      message: error.message,
    });
  }
};

const sendMessage = async (req, res) => {
  try {
    const { chatId } = req.params;
    const { content } = req.body;

    if (!content || content.trim() === '') {
      return res.status(400).json({
        success: false,
        message: 'Please provide message content',
      });
    }

    const { userMessage } = await messageService.sendMessage(
      chatId,
      req.user._id,
      content.trim()
    );

    messageService.getLLMResponse(chatId, req.user._id, content.trim())
      .then((assistantMessage) => {
        console.log(`LLM response generated for chat ${chatId}`);
      })
      .catch((error) => {
        console.error(`Error generating LLM response for chat ${chatId}:`, error);
      });

    res.status(201).json({
      success: true,
      message: 'Message sent successfully',
      data: {
        userMessage,
        status: 'processing',
        note: 'LLM response is being generated. Poll GET /api/chats/:chatId/messages to get the response.',
      },
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  getMessages,
  sendMessage,
};
