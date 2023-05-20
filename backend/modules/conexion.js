const { Pool } = require("pg");
const { db_user, db_password, db_name } = require("../config");

const pool = new Pool({
  user: db_user,
  password: db_password,
  host: "localhost",
  database: db_name,
  port: 5432,
  allowExitOnIdle: true,
});

module.exports = pool;
