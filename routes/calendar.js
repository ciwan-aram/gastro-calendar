const express = require('express');
const router  = express.Router();

/* GET profile page */
router.get('/calendar', (req, res, next) => {
  res.render('calendar');
});

module.exports = router;

