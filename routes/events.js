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

// >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>> HERE >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>

router.get('/events/:id', (req, res, next) => {
  Event.findById(req.params.id)
    .then(event => {
      let showDelete = false;
      let showModify = false;
      let showCreateNewEvent = false;
      let showSaveChanges = false;

      if (req.user && req.user.role === 'moderator') {
        //only related user role (or name!!??)
        showDelete = true;
        showModify = true;
        showCreateNewEvent = true;
      } else if (
        req.user &&
        event.owner._id.toString() === req.user._id.toString()
      ) {
        showModify = true;
      } else
        res.render('events/eventDetails.hbs', {
          event,
          showDelete: showDelete,
          showSaveChanges: showSaveChanges,
          user: req.user
        });
    })
    .catch(err => {
      next(err);
    });
});

// router.get('/rooms/:id/delete', (req, res, next) => {
//   // if (req.user.role === "moderator") {
//   //   Room.deleteOne({ _id: req.params.id })
//   //     .then(() => {
//   //       res.redirect("/rooms");
//   //     })
//   //     .catch(err => {
//   //       next(err);
//   //     });
//   // } else {
//   //   Room.deleteOne({ _id: req.params.id, owner: req.user._id })
//   //     .then(() => {
//   //       res.redirect("/rooms");
//   //     })
//   //     .catch(err => {
//   //       next(err);
//   //     });
//   // }

//   const query = {
//     _id: req.params.id
//   };

//   if (req.user.role !== 'moderator') {
//     query.owner = req.user._id;
//   }
//   // moderator: query { _id: '5e3d46e43051578b9b860b89' };
//   // basic user:  { _id: '5e3d46e43051578b9b860b89', owner: 5e3d33168c73d081a5ea966b }

//   Room.deleteOne(query)
//     .then(() => {
//       res.redirect('/rooms');
//     })
//     .catch(err => {
//       next(err);
//     });
// });

module.exports = router;
