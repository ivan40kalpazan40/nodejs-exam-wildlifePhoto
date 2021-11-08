const mongoose = require('mongoose');
const validator = require('validator');

const postSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    minlength: [6, 'Please make this field at least 6 characters long'],
  },
  keyword: {
    type: String,
    required: true,
    minlength: [6, 'Please make this field at least 6 characters long'],
  },
  location: { type: String, required: true },
  date: {
    type: String,
    required: true,
    minlength: [10, 'Please make this field at least 10 characters long'],
  },
  image: {
    type: String,
    required: true,
    validate: {
      validator: function (v) {
        return validator.isURL(v);
      },
      message: 'You must enter valid url!',
    },
  },
  description: {
    type: String,
    required: true,
    minlength: [8, 'Your description must be at least 8 characters long!'],
  },
  author: { type: mongoose.Types.ObjectId, ref: 'User' },
  votes: [{ type: mongoose.Types.ObjectId, ref: 'User' }],
  rating: { type: Number, default: 0 },
});

postSchema.method('isAuthor', function (userId) {
  return this.author._id == userId;
});

postSchema.method('youVoted', function (userId) {
  return this.votes.some((x) => x._id == userId);
});

postSchema.method('like', function (user) {
  this.votes.push(user);
  this.rating += 1;
  this.save();
});

postSchema.method('dislike', function (user) {
  this.votes.push(user);
  this.rating -= 1;
  this.save();
});
postSchema.method('displayVoters', function () {
  return this.votes.map((x) => x.email).join(', ');
});

const Post = mongoose.model('Post', postSchema);
module.exports = Post;
