const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');

const initExpress = (app) => {
  app.use(express.static(path.resolve(__dirname, '../public')));
  app.use(cookieParser());
  app.use(express.urlencoded({ extended: true }));
};

module.exports = initExpress;
