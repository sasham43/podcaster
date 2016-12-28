var express = require('express');
var passport = require('passport');
var router = express.Router();

router.get('/google', passport.authenticate('google', {scope: ['profile']}));

router.get('/google/callback', passport.authenticate('google', {failureRedirect: '/#/login' , failureFlash: true}),
  function(req, res) {
    // Successful authentication, redirect home.
    console.log('google logged in.')
    if(res.data != null){
        res.data.authenticated = true;
    } else {
        res.data = {authenticated: true};
    }
    res.redirect('/#/feed');
  });

router.get('/check', function(req, res, next){
    console.log('auth check:', req.user);
  if(req.user != null){
    res.send({authenticated: true, user: req.user});
  } else {
    res.send({authenticated: false});
  }
});

router.get('/logout', function(req, res, next){
  req.logout();
  res.redirect('/#/');
});

exports.router = router;
exports.isAuthenticated = isAuthenticated;

function isAuthenticated(req, res, next){
  if (req.user.authenticated){
    return next();
  }

  res.redirect('/#/');
}
