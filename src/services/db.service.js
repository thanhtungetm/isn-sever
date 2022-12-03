const mysql = require('mysql2/promise');
const dbConfig = require('../configs/db.config');
let connection = null


async function query(sql, params) {
  connection = connection || await mysql.createConnection(dbConfig);
  const [results, ] = await connection.execute(sql, params);
  return results;
}

// async function connect(){
//     connection = await mysql.createConnection(dbConfig);
//     console.log("Connected to db");
// }

module.exports = {
  query,
  // connect
}