const express = require('express');
const router = express.Router();
const reactionController = require('../controllers/reaction.controller')

router.post('/:postId', reactionController.like)
router.delete('/:postId', reactionController.unlike)


module.exports = router