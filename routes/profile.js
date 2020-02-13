const express = require('express');
const router = express.Router();
const Event = require('../models/Event');

/* GET profile page */
router.get('/profile/myProfile', (req, res, next) => {
  console.log('HALLO');
  Event.find({ name: req.user.username })
    .populate('owner')
    .then(myShifts => {
      console.log('helloooo', myShifts);
      res.render('private', { user: req.user, myShifts });
    });
});

module.exports = router;
