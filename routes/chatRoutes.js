const express = require('express');
const router = express.Router();
const chatController = require('../controllers/chatController');
const authenticate = require('../middleware/auth');

router.get('/', authenticate, chatController.getAllChats);
router.get('/:chatId', authenticate, chatController.getChatById);
router.post('/', authenticate, chatController.createChat);
router.put('/:chatId', authenticate, chatController.updateChat);
router.delete('/:chatId', authenticate, chatController.deleteChat);

module.exports = router;
