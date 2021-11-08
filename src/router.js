const router = require('express').Router();
const homeController = require('./controllers/homeController');
const userController = require('./controllers/userController');
const postController = require('./controllers/postController');

router.use(homeController);
router.use('/user', userController);
router.use('/post', postController);
router.use('*', (req, res) => {
  res.render('404');
});

module.exports = router;
