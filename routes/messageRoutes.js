const express = require('express');
const router = express.Router();
const messageController = require('../controllers/messageController');
const authenticate = require('../middleware/auth');

router.get('/:chatId/messages', authenticate, messageController.getMessages);
router.post('/:chatId/messages', authenticate, messageController.sendMessage);

module.exports = router;
