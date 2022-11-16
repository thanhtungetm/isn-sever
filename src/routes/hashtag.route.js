const express = require('express');
const router = express.Router();
const hashtagController = require('../controllers/hashtag.controller')

router.get('/:search', hashtagController.search)


module.exports = router