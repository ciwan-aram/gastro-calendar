const express = require('express');
const router = express.Router();
const passport = require('passport');
const bcrypt = require('bcrypt');
const bcryptSalt = 10;
const Event = require('../models/Event');
const User = require('../models/User');
const ensureLogin = require('connect-ensure-login');

router.get('/profile', ensureLogin.ensureLoggedIn(), (req, res) => {
  console.log('USER', req.user);
  // why do we render this page?
  Event.find({ name: req.user.username })
    .populate('owner')
    .then(myShifts => {
      console.log('helloooo', myShifts);
      res.render('private', { user: req.user, myShifts });
    });
  // res.render('private', { user: req.user });
});

router.get('/signup', (req, res, next) => {
  res.render('auth/signup');
});

router.post('/signup', (req, res, next) => {
  const username = req.body.username;
  const password = req.body.password;
  const name = req.body.name;

  if (username === '' || password === '') {
    res.render('auth/signup', { message: 'Indicate username and password' });
    return;
  }

  User.findOne({ username })
    .then(user => {
      if (user !== null) {
        res.render('auth/signup', { message: 'The username already exists' });
        return;
      }

      const salt = bcrypt.genSaltSync(bcryptSalt);
      const hashPass = bcrypt.hashSync(password, salt);

      const newUser = new User({
        name,
        username,
        password: hashPass
      });

      newUser.save(err => {
        if (err) {
          res.render('auth/signup', { message: 'Something went wrong' });
        } else {
          res.redirect('/profile');
        }
      });
    })
    .catch(error => {
      next(error);
    });
});

router.get('/login', (req, res, next) => {
  res.render('auth/login', { message: req.flash('error') });
});

router.post(
  '/login',
  passport.authenticate('local', {
    successRedirect: '/profile',
    failureRedirect: '/login',
    failureFlash: true,
    passReqToCallback: true
  })
);

router.get('/logout', (req, res) => {
  req.logout();
  res.redirect('/login');
});

module.exports = router;
