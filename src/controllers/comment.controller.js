const commentService = require("../services/comment.service");

async function add(req, res, next) {
  try {
    const userId = req.userId
    const {postId, captionData, replyId} = req.body
    console.log("ADD COMMENT",req.body);
    res.json(await commentService.add(userId, postId, captionData,replyId));
  } catch (err) {
    console.error(`Error while add comment`, err.message);
    next(err);
  }
}
async function get(req, res, next) {
  try {
    const {postId} = req.params
    res.json(await commentService.getComments(postId));
  } catch (err) {
    console.error(`Error while add comment`, err.message);
    next(err);
  }
}


module.exports = {
  add,
  get
};
