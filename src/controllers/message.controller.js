const messageService = require("../services/message.service");

async function get(req, res, next) {
  try {
    res.json(await messageService.getAll(req.params.id));
  } catch (err) {
    console.error(`Error while getting programming languages`, err.message);
    next(err);
  }
}

async function create(req, res, next) {
  try {
    console.log(req.body);
    const userId = req.params.userId;
    const { message, receivedUserId } = req.body;
    res.json(await messageService.create(userId, message, receivedUserId));
  } catch (err) {
    console.error(`Error while getting programming languages`, err.message);
    next(err);
  }
}

module.exports = {
  get,
  create,
};
