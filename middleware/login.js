exports.isLoggedIn = (req, res, next) => {
   if (!req.session.userId) {
      res.status(401).send({ message: 'user not exist' });
   } else {
      next();
   }
};
