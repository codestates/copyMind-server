const express = require('express');
const copy = require('../models/copy');
const users = require('../models/users');
const router = express.Router();
const { isLoggedIn } = require('../middleware/login');

router.get('/userinfo', isLoggedIn, async (req, res) => {
   const user = await users.findOne({
      _id: req.session.userId,
   });

   res.status(200).send({
      _id: user._id,
      email: user.email,
      userName: user.userName,
      bookmarkCount: user.bookmark.length,
      postingCount: user.posting.length,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
   });
});

router.get('/myposting', isLoggedIn, async (req, res) => {
   const user = await users.findOne({
      _id: req.session.userId,
   });

   const myPosting = await copy.find(
      {
         _id: { $in: user.posting },
      },
      {
         createdAt: 0,
         updatedAt: 0,
      }
   );
   res.status(200).send({ result: myPosting });
});

router.get('/bookmark', isLoggedIn, async (req, res) => {
   const user = await users.findOne({
      _id: req.session.userId,
   });

   const myBookmark = await copy.find(
      {
         _id: { $in: user.bookmark },
      },
      {
         createdAt: 0,
         updatedAt: 0,
      }
   );

   res.status(200).send({ result: myBookmark });
});

module.exports = router;
