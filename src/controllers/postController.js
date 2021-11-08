const router = require('express').Router();
const postServices = require('../services/postServices');
const userServices = require('../services/userServices');
const {
  isLogged,
  isCreator,
  notCreator,
} = require('../middlewares/authMiddleware');
// ALL POST :: GET ::
const renderAllPosts = async (req, res) => {
  try {
    const postList = await postServices.getAll();
    const posts = postList.map((x) => x.toObject());
    res.render('post/all', { posts });
  } catch (error) {
    console.log(error);
    res.render('404', { errors: error });
  }
};

// CREATE :: GET ::
const renderCreate = (req, res) => {
  res.render('post/create');
};

// CREATE :: POST ::
const createPost = async (req, res) => {
  const { title, keyword, location, date, image, description } = req.body;
  try {
    const user = await userServices.getUser(req.user?._id);
    const post = await postServices.createOne({
      title,
      keyword,
      location,
      date,
      image,
      description,
      author: req.user,
    });
    await user.addToMyPosts(post);
    res.redirect('/post');
  } catch (error) {
    console.log(error);
    res.render('post/create', { errors: error });
  }
};

// EDIT :: GET ::
const renderEdit = async (req, res) => {
  const postId = req.params.id;
  try {
    const post = await postServices.getOne(postId);
    res.render('post/edit', { post: post.toObject() });
  } catch (error) {
    console.log(error);
    res.render('404', { errors: error });
  }
};

// EDIT :: POST ::
const editPost = async (req, res) => {
  const postId = req.params.id;
  const { title, keyword, location, date, image, description } = req.body;

  try {
    await postServices.editOne(postId, {
      title,
      keyword,
      location,
      date,
      image,
      description,
    });
    res.redirect(`/post/${postId}/details`);
  } catch (error) {
    res.render('post/edit', { errors: error });
  }
};

// DETAILS :: GET ::
const renderDetails = async (req, res) => {
  const postId = req.params.id;
  try {
    const post = await postServices.getOne(postId);
    const isAuthor = await post.isAuthor(req.user?._id);
    const youVoted = await post.youVoted(req.user?._id);
    const voters = await post.displayVoters();
    res.render('post/details', {
      voters,
      youVoted,
      isAuthor,
      post: post.toObject(),
    });
  } catch (error) {
    console.log(error.message);
    res.redirect('/');
  }
};

// DELETE :: GET ::
const deletePost = async (req, res) => {
  const postId = req.params.id;
  try {
    await postServices.deleteOne(postId);
    res.redirect('/post');
  } catch (error) {
    console.log(error);
    res.render('404', { errors: error });
  }
};

// VoteUP :: GET ::
const voteUp = async (req, res) => {
  const postId = req.params.id;
  try {
    const post = await postServices.getOne(postId);
    post.like(req.user);
    res.redirect(`/post/${postId}/details`);
  } catch (error) {
    console.log(error);
    res.render('404', { errors: error });
  }
};

// VoteDown :: GET ::
const voteDown = async (req, res) => {
  const postId = req.params.id;

  try {
    const post = await postServices.getOne(postId);
    post.dislike(req.user);
    res.redirect(`/post/${postId}/details`);
  } catch (error) {
    console.log(error);
    res.render('404', { errors: error });
  }
};

router.get('/', renderAllPosts);
router.get('/create', isLogged, renderCreate);
router.post('/create', isLogged, createPost);
router.get('/:id/edit', isLogged, isCreator, renderEdit);
router.post('/:id/edit', isLogged, isCreator, editPost);
router.get('/:id/details', renderDetails);
router.get('/:id/delete', isLogged, isCreator, deletePost);

router.get('/:id/upvote', isLogged, notCreator, voteUp);
router.get('/:id/downvote', isLogged, notCreator, voteDown);

module.exports = router;
