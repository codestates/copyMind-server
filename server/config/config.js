require('dotenv').config();

module.exports = {
   development: {
      username: 'admin',
      password: process.env.DATABASE_SECRET,
      database: 'copymind',
      host: 'firstproject.crxukmdbikqi.ap-northeast-2.rds.amazonaws.com',
      dialect: 'mariadb',
   },
   test: {
      username: 'root',
      password: process.env.DATABASE_SECRET,
      database: 'copymind',
      host: '127.0.0.1',
      dialect: 'mysql',
   },
   production: {
      username: 'root',
      password: process.env.DATABASE_SECRET,
      database: 'copymind',
      host: '127.0.0.1',
      dialect: 'mysql',
   },
};
