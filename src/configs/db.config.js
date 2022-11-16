const env = process.env;
const db = {
    host: env.DB_HOST || 'localhost',
    user: env.DB_USER || 'root',
    password: env.DB_PASSWORD || '',
    database: env.DB_NAME || 'isndb_test_1',
    port: env.DB_PORT || 3306,
};

module.exports = db;