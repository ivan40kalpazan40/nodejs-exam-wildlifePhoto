const bcrypt = require('bcrypt');
const { SALT_ROUNDS } = require('../config/constants.config');

exports.confirmPasswords = (pass, repass) => {
  return pass === repass;
};

exports.hashPassword = (password) => {
  return bcrypt.hash(password, SALT_ROUNDS);
};

exports.comparePassword = (password, hashedPassword) => {
  return bcrypt.compare(password, hashedPassword);
};
