const express = require('express');
const route = express.Router();
const auth = require('../middlewares/auth.middleware.js');
const { getAnalytics } = require('../controllers/dashboard.controller.js');

route.get('/', auth, getAnalytics);

module.exports = route;
