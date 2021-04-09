const express = require('express');
const cookieParser = require('cookie-parser');
const morgan = require('morgan');
const cors = require('cors');
const session = require('express-session');

const app = express();
const PORT = process.env.PORT || 8080;

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

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(
   cors({
      origin: true,
      methods: ['GET', 'POST', 'OPTIONS'],
      credentials: true,
   })
);

app.use(
   //세션 : 요청마다 개인의 저장공간
   session({
      secret: '@copymind', //비밀 키 저장
      resave: false, //재저장의 유무
      saveUninitialized: true,
   })
);

app.use(PORT, () => {
   console.log(`server on ${PORT}`);
});
