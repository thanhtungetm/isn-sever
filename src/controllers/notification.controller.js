const notificationService = require("../services/notification.service");

async function getAll(req, res, next) {
  try {
    const userId = req.userId
    
    res.json(await notificationService.getAll(userId));
  } catch (err) {
    console.error(`Error get all notify`, err.message);
    next(err);
  }
}
async function updateNotifyStatus(req, res, next) {
  try {
    const userId = req.userId
    const data = req.body
    res.json(await notificationService.updateNotifyStatus(userId,data));
  } catch (err) {
    console.error(`Error update notify status`, err.message);
    next(err);
  }
}


module.exports = {
  getAll,
  updateNotifyStatus
};
