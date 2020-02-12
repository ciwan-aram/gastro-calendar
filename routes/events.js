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

router.get('/events/new', loginCheck, (req, res) => {
  res.render('events/newEvent.hbs');
});

router.post('/events', loginCheck, (req, res, next) => {
  console.log('req body', req.body);
  const { name, date, startTime, endTime, description } = req.body;
  // User.findOne({ name }).then(found => {});
  if (req.user && req.user.role === 'moderator') {
    Event.create({
      name,
      date,
      startTime,
      endTime,
      description,
      owner: req.user._id // can we add another key here to reference the name with the username of the person we are referring to in the event?
    })
      .then(() => {
        res.redirect('/events');
      })
      .catch(err => {
        next(err);
      });
  }
});

router.get('/events', (req, res) => {
  Event.find()
    .then(events => {
      res.render('events/eventsList.hbs', { events, user: req.user });
    })
    .catch(err => {
      next(err);
    });
});

//>>>>>>>>>>>>>>>>>>>>>>>    Event ID   <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
router.get('/events/:id', (req, res, next) => {
  Event.findById(req.params.id)
    .then(event => {
      let showDelete = false;
      let showModify = false;
      let showCreateNewEvent = false;
      let showSaveChanges = false;

      console.log(req.user, 'Here req.user');
      console.log('req session', req.session.user);
      console.log(event.name, 'Hiiiiiiiii22222222');
      if (req.user && req.user.role === 'moderator') {
        //only related user role (or name!!??)
        showDelete = true;
        showModify = true;
        showCreateNewEvent = true;
      } else if (
        req.user &&
        event.name.toString() === req.user.username.toString()
      ) {
        showModify = true;
      } else {
        console.log('Hiiiiiii');
        res.redirect('/events');
      }
      res.render('events/eventDetails.hbs', {
        event,
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

router.get('/events/:id/delete', (req, res, next) => {
  if (req.user.role === 'moderator') {
    Event.deleteOne({ _id: req.params.id })
      .then(() => {
        res.redirect('/events');
      })
      .catch(err => {
        next(err);
      });
  }
});

module.exports = router;
