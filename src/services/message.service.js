const db = require('./db.service');
const helper = require('../utils/helper.util');

async function getAll(userId){
  // const rows = await db.query(
  //   `INSERT INTO `message` (`MESSAGE_ID`, `USER_ID`, `RECEIVED_USER_ID`, `MESSAGE_BODY`, `CREATED_AT`) VALUES (NULL, '1', '2', 'hello', current_timestamp())`, 
  //   [offset, config.listPerPage]
  // );
  // const data = helper.emptyOrRows(rows);

  // return {
  //   data,
  //   meta
  // }
  return {
    data: "Get all messages "+ userId
  }
}
async function create(userId, message, userReceive){
  console.log(userId, message, userReceive);
  const rows = await db.query(
    `INSERT INTO message (USER_ID, RECEIVED_USER_ID, MESSAGE_BODY) VALUES (?, ?, ?)`,
    [userId, userReceive, message]
  );
  const data = helper.emptyOrRows(rows);

  return {
    data,
  }

  // return {
  //   data: "Create messages "+ userId +" with message = " + message
  // }
}
async function remove(messageId){
  return {
    data: "Delete messages "+ messageId
  }
}


module.exports = {
  getAll,
  create,
  remove
}