const express = require('express');
const router = express.Router();
const commentController = require('../controllers/comment.controller')

router.post('/', commentController.add)
router.get('/:postId', commentController.get)


module.exports = router