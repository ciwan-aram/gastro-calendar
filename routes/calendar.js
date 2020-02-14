const express = require('express');
const router = express.Router();
const Event = require('../models/Event');
const User = require('../models/User');

const loginCheck = (req, res, next) => {
  if (req.user) {
    next();
  } else {
    res.redirect('/');
  }
};

/* GET profile page */
router.get('/calendar', loginCheck, (req, res, next) => {
  res.render('calendar');
});

module.exports = router;
