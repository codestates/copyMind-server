const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcrypt');
const User = require('../models/users');

module.exports = () => {
   passport.use(
      new LocalStrategy(
         {
            emailField: 'email',
            passworddField: 'password',
         },
         async (email, password, done) => {
            console.log(email);
            const exUser = await User.findOne({ email: email });
            if (exUser) {
               const hashPassword = await bcrypt.compare(
                  exUser.password,
                  password
               );
               if (hashPassword) {
                  done(null, exUser);
               } else {
                  done(null, false, {
                     message: '비밀번호가 일치하지 않습니다.',
                  });
               }
            } else {
               done(null, false, { message: '존재하지 않는 유저입니다.' });
            }
         }
      )
   );
};
