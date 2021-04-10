const express = require('express');
const cookieParser = require('cookie-parser');
const morgan = require('morgan');
const cors = require('cors');
const session = require('express-session');
const mongoose = require('mongoose');
require('dotenv').config();

const app = express();

const dbPort = process.env.DB_PORT;
const dbHost = process.env.DB_HOST;
const sessionSecret = process.env.SESSION_SECRET;

const sign = require('./route/sign');
const copy = require('./route/copy');
const user = require('./route/user');
const oauth = require('./route/oauth');

app.set('port', process.env.PORT || 8080);

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

if (process.env.PORT) {
   app.use(morgan('combined'));
   app.use(
      cors({
         origin: 'http://copymind.com',
         methods: ['GET', 'POST', 'OPTIONS'],
         credentials: true,
      })
   );
} else {
   app.use(morgan('dev'));
   app.use(
      cors({
         origin: true,
         methods: ['GET', 'POST', 'OPTIONS'],
         credentials: true,
      })
   );
}

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use(
   //세션 : 요청마다 개인의 저장공간
   session({
      secret: sessionSecret, //비밀 키 저장
      resave: false, //재저장의 유무
      saveUninitialized: true,
   })
);

app.use('/sign', sign);
app.use('/copy', copy);
app.use('/user', user);
app.use('/oauth', oauth);

app.listen(app.get('port'), () => {
   console.log(`server on ${app.get('port')}`);
});
