const db = require('./db.service');
const helper = require('../utils/helper.util');

async function getLikes(postId, userId){

  const rows = await db.query(
    `SELECT users.user_name
      FROM likes, users
      where users.user_id = likes.user_id and likes.post_id = ?`, 
    [postId]
  );
  const data = helper.emptyOrRows(rows);

  const hasLike = await db.query(
    `SELECT likes.user_id, likes.post_id
      FROM likes
      where likes.user_id = ? and likes.post_id = ?`, 
    [userId, postId]
  );

  return {
    total: data.length,
    hasLike: hasLike.length !==0
  }
}
async function like(userId,postId){

  await db.query(
    `INSERT INTO likes (post_id, user_id) VALUES (?, ?)`, 
    [postId,userId]
  );

  return {
    message: "Like successfully!"
  }
}
async function unlike(userId,postId){

  await db.query(
    `DELETE FROM likes WHERE likes.post_id = ? AND likes.user_id = ?`, 
    [postId,userId]
  );

  return {
    message: "Unlike successfully!"
  }
}

async function deleteAll(postId){

  await db.query(
    `DELETE FROM likes WHERE likes.post_id = ?`, 
    [postId]
  );

  return {
    message: "Delete all successfully!"
  }
}


module.exports = {
  like,
  unlike,
  getLikes,
  deleteAll
}