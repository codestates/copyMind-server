const express = require('express');
const router = express.Router();
const crypto = require('crypto');
const users = require('../models/users');

router.post('/signin', async (req, res) => {
   const { email } = req.body;
   const exUser = await users.findOne({ email: email });

   if (!exUser) {
      res.status(401).send({ message: 'user not found' });
   }

   req.session.save(() => {
      req.session.userId = exUser._id;
      res.status(200).send({ message: 'ok', bookmarkList: exUser.bookmark });
   });
});

router.post('/signup', async (req, res) => {
   const { email, password, userName } = req.body;

   const hashPassword = crypto
      .createHash('sha512')
      .update(password)
      .digest('hex');

   const exUserEamil = await users.findOne({ email: email });
   const exUserName = await users.findOne({ userName: userName });

   if (exUserEamil) {
      return res.status(409).send({ message: 'same email' });
   }

   if (exUserName) {
      return res.status(409).send({ message: 'same userName' });
   }

   await users.create({
      email: email,
      password: hashPassword,
      userName: userName,
   });

   return res.status(200).send({ message: 'signup success!' });
});

router.post('/signout', async (req, res) => {
   if (!req.session.userId) {
      res.status(400).send({ message: `you're not currently login` });
   }

   req.session.destroy();
   res.send({ message: 'successfully log-out!' });
});

module.exports = router;
