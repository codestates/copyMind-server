const passport = require('passport');
const local = require('./localStrategy');
const User = require('../models/users');

module.exports = () => {
   passport.serializeUser((user, done) => {
      console.log('hihi');
      done(null, user.id);
   });

   passport.deserializeUser((id, done) => {
      User.findOne({
         _id: id,
      }).then((user) => done(null, user));
   });

   local();
};
