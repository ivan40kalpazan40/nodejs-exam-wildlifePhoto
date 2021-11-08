const Post = require('../models/Post');

const getAll = () => Post.find({}).populate('author');
const createOne = (post) => Post.create(post);
const getOne = (id) => Post.findById(id).populate('author votes');
const editOne = (id, update) =>
  Post.findByIdAndUpdate(id, update, { runValidators: true });
const deleteOne = (id) => Post.findByIdAndRemove(id);

const postServices = { getAll, createOne, getOne, editOne, deleteOne };
module.exports = postServices;
