const mongoose = require('mongoose');
const validator = require('validator');

const userSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: true,
    minlength: [3, 'Your first name should be at least 3 characters long!'],
    validate: {
      validator: function (v) {
        return validator.isAlpha(v);
      },
      message: 'Only English letters allowed!',
    },
  },
  lastName: {
    type: String,
    required: true,
    minlength: [5, 'Your last name should be at least 5 characters long'],
    validate: {
      validator: function (v) {
        return validator.isAlpha(v);
      },
      message: 'Only English letters allowed!',
    },
  },
  email: {
    type: String,
    required: true,
    validate: {
      validator: function (v) {
        return validator.isEmail(v);
      },
      message: 'You need to enter valid email',
    },
  },
  password: {
    type: String,
    required: true,
    minlength: [4, 'Your password must be at least 4 characters long!'],
  },
  myPosts: [{ type: mongoose.Types.ObjectId, ref: 'Post' }],
});

userSchema.method('addToMyPosts', function (post) {
  this.myPosts.push(post);
  this.save();
});

const User = mongoose.model('User', userSchema);
module.exports = User;
