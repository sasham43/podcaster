var express = require('express');
var passport = require('passport');
var router = express.Router();

router.get('/facebook', passport.authenticate('facebook'));

router.get('/facebook/callback', passport.authenticate('facebook', { failureRedirect: '/#/login' }),
  function(req, res) {
    // Successful authentication, redirect home.
    console.log('facebook logged in.')
    res.redirect('/#/');
  });

module.exports = router;
