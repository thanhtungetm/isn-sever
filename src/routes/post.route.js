const express = require('express');
const upload = require('../configs/upload.config');
const router = express.Router();
const postController = require('../controllers/post.controller')

router.get('/', postController.get)
router.get('/friend', postController.getFriend)
router.post('/',  postController.create)
router.get('/liked', postController.getLikedPosts)
router.get('/mentioned', postController.getMentionedPosts)
router.get('/:postId', postController.getById)
router.delete('/:postId', postController.remove)


module.exports = router