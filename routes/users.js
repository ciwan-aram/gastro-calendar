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
  const { name, username, email, password, telephone, role } = req.body;
  // User.findOne({ name }).then(found => {});
  if (req.user && req.user.role === 'moderator') {
    User.create({
      name,
      username,
      email,
      telephone,
      password,
      role
    })
      .then(() => {
        res.redirect('/users');
      })
      .catch(err => {
        next(err);
      });
  }
});

router.get('/users', loginCheck, (req, res) => {
  User.find()
    .then(users => {
      res.render('users/usersList.hbs', { users, user: req.user });
    })
    .catch(err => {
      next(err);
    });
});

router.get('/users/:id', loginCheck, (req, res, next) => {
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

      User.findById(req.params.id).then(user => {
        console.log(user);
        res.render('users/userDetails.hbs', {
          name: user.name,
          username: user.username,
          email: user.email,
          role: user.role,
          showDelete: showDelete,
          showSaveChanges: showSaveChanges,
          showModify: showModify,
          userId: user._id
        });
      });
    })

    .catch(err => {
      next(err);
    });
});

router.get('/users/:id/delete', loginCheck, (req, res, next) => {
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

router.get('/users/:id/modify', loginCheck, (req, res, next) => {
  console.log('USER ID');
  User.findById(req.params.id).then(user => {
    console.log('user', user);
    res.render('./users/editUser.hbs', {
      name: user.name,
      username: user.username,
      email: user.email,
      role: user.role,
      id: user._id
    });
  });
});

router.post('/users/:id/modify', loginCheck, (req, res, next) => {
  console.log('HHIIIIIII');
  if (req.user.role === 'moderator') {
    User.findOneAndUpdate({ _id: req.params.id })
      .then(() => {
        res.redirect('/users/usersList.hbs');
      })
      .catch(err => {
        next(err);
      });
  }
});

router.post('/users/modify/:id', loginCheck, (req, res) => {
  const { name, username, email, role } = req.body;
  console.log('EMAI>>>L', username, email);
  User.findOneAndUpdate(
    {
      _id: req.params.id
    },
    { name, username, email, role },
    { new: true }
  )
    .then(data => console.log('DATA', data))
    .catch(err => console.log(err));
  res.redirect('/users');
});

module.exports = router;
