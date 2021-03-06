require('dotenv').config();


module.exports = {
  development: {
    username: "root",
    password: process.env.DATABASE_SECRET,
    database: "copymind",
    host: "127.0.0.1",
    dialect: "mysql"
  },
  test: {
    username: "root",
    password: process.env.DATABASE_SECRET,
    database: "copymind",
    host: "127.0.0.1",
    dialect: "mysql"
  },
  production: {
    username: "root",
    password: process.env.DATABASE_SECRET,
    database: "copymind",
    host: "127.0.0.1",
    dialect: "mysql"
  }
}
