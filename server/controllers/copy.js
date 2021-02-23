const { users, copies, Sequelize, userBookmarks } = require('../models');
const { Op } = require("sequelize");

module.exports = {
    getCopyController : async (req, res)=>{
        if(req.session.userId){ //회원
            if(req.body.pathName === 'view'){ //today`s copies 버튼
                try {
                    const randomContent = await copies.findOne({
                        attributes : ['title', 'writer', 'content', 'category', 'likeCount', 'id'],
                        order : [
                            [Sequelize.literal('RAND()')]
                        ],
                        limit : 1,
                    })
                    res.send({ result : [randomContent] })
                }
                catch(err){
                    res.status(500).send({message : 'server err'});
                }
            }else{ // 메뉴 버튼
                try {
                    const content = await copies.findAll({
                        attributes : ['title', 'writer', 'content', 'category', 'likeCount', 'id'],
                        where : {
                            category : {
                                [Op.eq] : req.body.pathName
                            }
                        },
                        order : [
                            [Sequelize.literal('RAND()')]
                        ],
                        limit : 20,
                    });
                    res.json({result : content});
                }
                catch(err){
                    res.status(500).send({message : 'server err'});
                }
            }   
        }else if(!req.session.userId){ // 비회원
            if(req.body.pathName === 'view'){
                try{
                    const limitContent = await copies.findOne({
                        attributes : ['title', 'writer', 'content', 'category', 'likeCount', 'id'],
                        where : { id :
                            {
                                [Op.lt] : 20,
                                [Op.gt] : 0,
                            } 
                        },
                        order : [
                            [Sequelize.literal('RAND()')]
                        ],
                        limit : 1,
                    })
                    res.json({result : [limitContent.dataValues]})
                }
                catch(err){
                    res.status(500).send({message : 'server err'});
                }
            }else{
                try {
                    const limitContent = await copies.findAll({
                        attributes : ['title', 'writer', 'content', 'category', 'likeCount', 'id'],
                        where : { 
                            [Op.and] : [
                                {category : req.body.pathName},
                                { id : 
                                    {
                                        [Op.gt]: 0, 
                                        [Op.lt] :10 
                                    } 
                                }
                            ]
                        },
                    })
                    const result = limitContent.map(data=>{
                        return data.dataValues;
                    })
                    res.json({result : result})
                }
                catch(err){
                    res.status(500).send({message : 'server err'});
                }
            }
        }
    },

    postCopyController : async (req, res)=>{
        try{
            const resultPost = await copies.create({
                myPostingId : req.session.userId,
                title : req.body.title,
                writer : req.body.writer,
                content : req.body.content,
                category : req.body.category
            }).then(result =>{
                return result.get({plain:true})
            })
            delete resultPost.createdAt
            delete resultPost.updatedAt
            res.send({result : [resultPost]})
        }
        catch(err){
            res.status(500).send({message : 'server err'});
        }
    },

    addLikeController: async (req, res) => {
        try {
          await userBookmarks.create({
            userId: req.session.userId,
            bookmarkId: req.body.id,
          });
            await copies.update(
              { likeCount: Sequelize.literal("likeCount + 1") },
              { where: { id: req.body.id } }
            );
          const addlikeCount = await copies.findOne({
            attributes: ["likeCount"],
            where: {
              id: req.body.id,
            },
          });

          const bookmarkId = await userBookmarks.findAll({
              where : {userId : req.session.userId}
          })

          const bookmarkList = bookmarkId.map(data=>{
              return data.bookmarkId
          })

          res.status(200).send({
            message: "like success!",
            likeCount: `${addlikeCount.likeCount}`,
            bookmarkList : bookmarkList
          });
        } 
        catch (err) {
          res.status(500).send({ messsage: "server err"});
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
              { likeCount: Sequelize.literal("likeCount - 1") },
              { where: { id : req.body.id } }
            );
          const subtractlikeCount = await copies.findOne({
            attributes: ["likeCount"],
            where: {
              id: req.body.id,
            },
          });

        const bookmarkId = await userBookmarks.findAll({
            where : {userId : req.session.userId}
        })

        const bookmarkList = bookmarkId.map(data=>{
            return data.bookmarkId
        })

          res.status(200).send({
              message: "remove success",
              likeCount: `${subtractlikeCount.likeCount}`,
              bookmarkList : bookmarkList
            });
        } catch (err) {
          res.status(500).send({ message: "server err" });
        }
      },
}