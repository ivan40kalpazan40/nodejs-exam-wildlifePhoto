const { COOKIE_TOKEN_NAME, SECRET } = require('../config/constants.config');
const { jwtVerify } = require('../config/utils.config');
const Post = require('../models/Post');

exports.auth = (req, res, next) => {
  const token = req.cookies[COOKIE_TOKEN_NAME];
  if (token) {
    jwtVerify(token, SECRET)
      .then((resolvedToken) => {
        req.user = resolvedToken;
        res.locals.user = resolvedToken;
        next();
      })
      .catch((error) => {
        console.log(error);
      });
  } else {
    next();
  }
};

exports.isLogged = (req, res, next) => {
  if (!req.user) {
    return res.redirect('/user/login');
  }
  next();
};

exports.isGuest = (req, res, next) => {
  if (req.user) {
    return res.redirect('/');
  }
  next();
};

exports.isCreator = async (req, res, next) => {
  const postId = req.params.id;
  const post = await Post.findById(postId);
  if (post.isAuthor(req.user._id)) {
    req.post = post;
    return next();
  }
  res.redirect('/');
};

exports.notCreator = async (req, res, next) => {
  const postId = req.params.id;
  const post = await Post.findById(postId);

  if (!post.isAuthor(req.user._id)) {
    return next();
  }
  res.redirect('/');
};
