const express = require('express');
const router = express.Router();
const notificationController = require('../controllers/notification.controller')

router.get('/', notificationController.getAll)
router.put('/', notificationController.updateNotifyStatus)


module.exports = router