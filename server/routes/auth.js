var express = require('express');
var passport = require('passport');
var router = express.Router();

router.get('/google', passport.authenticate('google', {scope: ['profile']}));

router.get('/google/callback', passport.authenticate('google', {failureRedirect: '/#/login' , failureFlash: true}),
  function(req, res) {
    // Successful authentication, redirect home.
    console.log('google logged in.')
    res.redirect('/#/user');
  });

router.get('/check', function(req, res, next){
  if(req.user){
    res.send({authenticated: true, user: req.user});
  } else {
    res.send({authenticated: false});
  }
});

exports.router = router;
exports.isAuthenticated = isAuthenticated;

function isAuthenticated(req, res, next){
  if (req.user.authenticated){
    return next();
  }

  res.redirect('/#/');
}
