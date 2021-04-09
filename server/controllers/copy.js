const { copies, Sequelize, userBookmarks } = require('../models');
const { Op } = require('sequelize');

module.exports = {
   getCopyController: async (req, res) => {
      if (req.session.userId) {
         //회원
         if (req.body.pathName === 'view') {
            //today`s copies 버튼
            try {
               const randomContent = await copies.findOne({
                  attributes: [
                     'title',
                     'writer',
                     'content',
                     'category',
                     'likeCount',
                     'id',
                  ],
                  order: [[Sequelize.literal('RAND()')]],
                  limit: 1,
               });
               res.send({ result: [randomContent] });
            } catch (err) {
               res.status(500).send({ message: 'server err' });
            }
         } else {
            // 메뉴 버튼
            try {
               const content = await copies.findAll({
                  attributes: [
                     'title',
                     'writer',
                     'content',
                     'category',
                     'likeCount',
                     'id',
                  ],
                  where: {
                     category: {
                        [Op.eq]: req.body.pathName,
                     },
                  },
                  order: [[Sequelize.literal('RAND()')]],
                  limit: 20,
               });
               res.json({ result: content });
            } catch (err) {
               res.status(500).send({ message: 'server err' });
            }
         }
      } else if (!req.session.userId) {
         // 비회원
         if (req.body.pathName === 'view') {
            try {
               const limitContent = await copies.findOne({
                  attributes: [
                     'title',
                     'writer',
                     'content',
                     'category',
                     'likeCount',
                     'id',
                  ],
                  where: {
                     id: {
                        [Op.lt]: 20,
                        [Op.gt]: 0,
                     },
                  },
                  order: [[Sequelize.literal('RAND()')]],
                  limit: 1,
               });
               res.json({ result: [limitContent.dataValues] });
            } catch (err) {
               res.status(500).send({ message: 'server err' });
            }
         } else {
            try {
               const limitContent = await copies.findAll({
                  attributes: [
                     'title',
                     'writer',
                     'content',
                     'category',
                     'likeCount',
                     'id',
                  ],
                  where: {
                     [Op.and]: [
                        { category: req.body.pathName },
                        {
                           id: {
                              [Op.gt]: 0,
                              [Op.lt]: 10,
                           },
                        },
                     ],
                  },
               });
               const result = limitContent.map((data) => {
                  return data.dataValues;
               });
               res.json({ result: result });
            } catch (err) {
               res.status(500).send({ message: 'server err' });
            }
         }
      }
   },

   postCopyController: async (req, res) => {
      try {
         const resultPost = await copies.create({
            myPostingId: req.session.userId,
            title: req.body.title,
            writer: req.body.writer,
            content: req.body.content,
            category: req.body.category,
         });
         console.log(resultPost);
         delete resultPost.createdAt;
         delete resultPost.updatedAt;
         res.send({ result: [resultPost] });
      } catch (err) {
         res.status(500).send({ message: 'server err' });
      }
   },

   addLikeController: async (req, res) => {
      try {
         await userBookmarks.create({
            userId: req.session.userId,
            bookmarkId: req.body.id,
         });
         await copies.update(
            { likeCount: Sequelize.literal('likeCount + 1') },
            { where: { id: req.body.id } }
         );
         const addlikeCount = await copies.findOne({
            attributes: ['likeCount'],
            where: {
               id: req.body.id,
            },
         });

         const bookmarkId = await userBookmarks.findAll({
            where: { userId: req.session.userId },
         });

         const bookmarkList = bookmarkId.map((data) => {
            return data.bookmarkId;
         });

         res.status(200).send({
            message: 'like success!',
            likeCount: `${addlikeCount.likeCount}`,
            bookmarkList: bookmarkList,
         });
      } catch (err) {
         res.status(500).send({ messsage: 'server err' });
      }
   },

   removeLikeController: async (req, res) => {
      try {
         await userBookmarks.destroy({
            where: {
               userId: req.session.userId,
               bookmarkId: req.body.id,
            },
         });
         await copies.update(
            { likeCount: Sequelize.literal('likeCount - 1') },
            { where: { id: req.body.id } }
         );
         const subtractlikeCount = await copies.findOne({
            attributes: ['likeCount'],
            where: {
               id: req.body.id,
            },
         });

         const bookmarkId = await userBookmarks.findAll({
            where: { userId: req.session.userId },
         });

         const bookmarkList = bookmarkId.map((data) => {
            return data.bookmarkId;
         });

         res.status(200).send({
            message: 'remove success',
            likeCount: `${subtractlikeCount.likeCount}`,
            bookmarkList: bookmarkList,
         });
      } catch (err) {
         res.status(500).send({ message: 'server err' });
      }
   },
};

const test = {
   result: [
      {
         title: '도움 보존의 법칙',
         writer: '이창현',
         content:
            "어린시절 \n부모님으로부터 도움을 받아 자라면 \n부모가 되어서 내 아이에게 도움을 준다. \n\n대학교 때 \n선배로부터 밥을 얻어먹어 본 사람이 \n선배가 되었을 때 밥을 사준다. \n\n도움은 사라지지 않습니다. \n사라진 것처럼 보이지만 다시 다른 누군가에게 전달됩니다. \n\n누군가를 도울 때 못 받을까 걱정마세요. \n나는 다른 누군가의 도움을 미리 받았습니다. \n도움은 부메랑처럼 다른이를 돌고 돌아 다시 돌아옵니다. \n\n이를 '도움보전법칙'이라 정해 보았습니다. \n다른 누군가를 돕는다는 것은 결국 자신을 돕는 일입니다. ",
         category: 'quotes',
         likeCount: 0,
         id: 10,
      },
   ],
};
