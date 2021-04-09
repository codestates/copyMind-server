const express = require('express');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const cors = require('cors');
const session = require('express-session');
const mongoose = require('mongoose');

const sign = require('./routes/sign');
const copy = require('./routes/copy');
const user = require('./routes/user');
const oauth = require('./routes/oauth');

const app = express();

const dbPort = process.env.DB_PORT;
const dbHost = process.env.DB_HOST;

mongoose.connect(
   `mongodb://${dbHost}:${dbPort}/copymindDB`,
   { useNewUrlParser: true, useCreateIndex: true },
   (err, db) => {
      if (err) {
         console.log('DB연결 실패');
      }
      console.log('DB연결 성공', db.models);
   }
);

app.use(
   cors({
      origin: true,
      methods: ['GET', 'POST', 'OPTIONS'],
      credentials: true,
   })
);

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.use(
   //세션 : 요청마다 개인의 저장공간
   session({
      secret: '@copymind', //비밀 키 저장
      resave: false, //재저장의 유무
      saveUninitialized: true,
   })
);

app.use('/sign', sign);
app.use('/copy', copy);
app.use('/user', user);

app.use('/oauth', oauth);

app.listen(3000, () => {
   console.log('server no 3000');
});

module.exports = app;
