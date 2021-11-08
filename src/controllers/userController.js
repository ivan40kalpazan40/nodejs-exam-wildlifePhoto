const router = require('express').Router();
const userServices = require('../services/userServices');
const postServices = require('../services/postServices');
const { jwtSign } = require('../config/utils.config');
const { SECRET, COOKIE_TOKEN_NAME } = require('../config/constants.config');
const { isLogged, isGuest } = require('../middlewares/authMiddleware');

// LOGIN :: GET ::
const renderLogin = (req, res) => {
  res.render('user/login');
};

//LOGIN :: POST ::
const loginUser = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await userServices.login(email, password);
    const payload = {
      _id: user._id,
      email: user.email,
    };
    const token = await jwtSign(payload, SECRET);
    res.cookie(COOKIE_TOKEN_NAME, token, { httpOnly: true }).redirect('/');
  } catch (error) {
    res.render('user/login', { errors: error });
  }
};

// REGISTER :: GET ::
const renderRegister = (req, res) => {
  res.render('user/register');
};

// REGISTER :: POST ::
const registerUser = async (req, res) => {
  const { firstName, lastName, email, password, repeatPassword } = req.body;
  try {
    const user = await userServices.register(
      firstName,
      lastName,
      email,
      password,
      repeatPassword
    );
    await loginUser(req, res);
    //res.redirect('/user/login');
  } catch (error) {
    res.render('user/register', { errors: error });
  }
};

// LOGOUT :: GET ::
const logoutUser = (req, res) => {
  res.clearCookie(COOKIE_TOKEN_NAME).redirect('/');
};

// OWN POSTS :: GET ::
const renderOwnPosts = async (req, res) => {
  const userId = req.params.id;
  try {
    const user = await userServices.getUser(userId);
    console.log(user);
    const postList = await postServices.getAll();
    const posts = postList.map((x) => x.toObject());
    const myPosts = posts.filter((x) => x.author._id == userId);
    res.render('user/myPosts', { myPosts, currentUser: user.toObject() });
  } catch (error) {
    res.render('index', { errors: error });
  }
};

router.get('/login', isGuest, renderLogin);
router.post('/login', isGuest, loginUser);
router.get('/register', isGuest, renderRegister);
router.post('/register', isGuest, registerUser);
router.get('/logout', isLogged, logoutUser);
router.get('/:id/posts', renderOwnPosts);
module.exports = router;
