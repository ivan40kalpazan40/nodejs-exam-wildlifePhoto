const User = require('../models/User');
const {
  confirmPasswords,
  hashPassword,
  comparePassword,
} = require('./generalServices');

const register = async (
  firstName,
  lastName,
  email,
  password,
  repeatPassword
) => {
  if (!confirmPasswords(password, repeatPassword)) {
    throw new Error('You must confirm your password!');
  }
  try {
    const hashed = await hashPassword(password);
    const user = await User.create({
      firstName,
      lastName,
      email,
      password: hashed,
    });
    return user;
  } catch (error) {
    throw new Error('You need to enter valid credentials!');
  }
};

const login = async (email, password) => {
  try {
    const user = await User.findOne({ email });
    if (!user) {
      throw new Error('You must enter valid email and password');
    }
    const isMatch = await comparePassword(password, user.password);
    if (!isMatch) throw new Error('You must enter valid email and password');
    return user;
  } catch (error) {
    throw error;
  }
};

const getUser = (id) => User.findById(id);

const userServices = { register, login, getUser };
module.exports = userServices;
