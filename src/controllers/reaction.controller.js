const reactionServices = require("../services/reaction.service");
const helpers = require('../utils/helper.util')

async function like(req, res, next) {
  try {
    const userId = req.userId
    const postId = req.params.postId
    res.json(await reactionServices.like(userId, postId));
  } catch (err) {
    console.error(`Error while get posts`, err.message);
    next(err);
  }
}
async function unlike(req, res, next) {
  try {
    const userId = req.userId
    const postId = req.params.postId
    res.json(await reactionServices.unlike(userId, postId));
  } catch (err) {
    console.error(`Error while get posts`, err.message);
    next(err);
  }
}

module.exports = {
    like,
    unlike
}
