import mysql from "mysql2";
import "dotenv/config";

const dbconfig = mysql.createConnection({
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  host: process.env.DB_HOST,
  port: 3308
});

export default dbconfig;
