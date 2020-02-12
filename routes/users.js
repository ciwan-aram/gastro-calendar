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

router.get('/users/add', loginCheck, (req, res) => {
  res.render('users/addUser.hbs');
});

router.post('/users', loginCheck, (req, res, next) => {
  console.log('req user body', req.user.body);
  const { name, username, email, password, role, administration } = req.body;
  // User.findOne({ name }).then(found => {});
  if (req.user && req.user.role === 'moderator') {
    User.create({
      name,
      username,
      email,
      password,
      role,
      administration
    })
      .then(() => {
        res.redirect('/users');
      })
      .catch(err => {
        next(err);
      });
  }
});

router.get('/users', (req, res) => {
  User.find()
    .then(users => {
      res.render('users/usersList.hbs', { users, user: req.user });
    })
    .catch(err => {
      next(err);
    });
});

router.get('/users/:id', (req, res, next) => {
  User.findById(req.params.id)
    .then(user => {
      let showDelete = false;
      let showModify = false;
      let showAddUser = false;
      let showSaveChanges = false;

      console.log(req.user, 'Here req.user user user');
      console.log('req session of user', req.session.user);
      console.log(user.name, 'USERRRRR');
      if (req.user && req.user.role === 'moderator') {
        //only related user role (or name!!??)
        showDelete = true;
        showModify = true;
        showAddUser = true;
      } else {
        console.log('YASSSSS');
        res.redirect('/users');
      }
      res.render('users/userDetails.hbs', {
        user,
        showDelete: showDelete,
        showSaveChanges: showSaveChanges,
        showModify: showModify,
        user: req.user
      });
    })
    .catch(err => {
      next(err);
    });
});

router.get('/users/:id/delete', (req, res, next) => {
  if (req.user.role === 'moderator') {
    User.deleteOne({ _id: req.params.id })
      .then(() => {
        res.redirect('/users');
      })
      .catch(err => {
        next(err);
      });
  }
});

module.exports = router;
