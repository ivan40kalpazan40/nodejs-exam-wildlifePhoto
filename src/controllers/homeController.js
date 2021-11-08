const router = require('express').Router();
const objectService = require('../services/postServices');

const renderHome = async (req, res) => {
  try {
    // const objects = await objectService.getAll();
    res.render('index');
  } catch (error) {
    res.send(error.message);
  }
};

router.get('/', renderHome);
module.exports = router;
