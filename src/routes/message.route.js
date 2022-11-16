const express = require('express');
const router = express.Router();
const messageController = require('../controllers/message.controller')

router.get('/:id', messageController.get)
router.post('/:userId', messageController.create)


module.exports = router