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

// router.get('/check', function(req, res, next){
//   console.log('requesting login status.');
//   if(req.user){
//     res.status(200).send(req.user);
//     next()
//   } else {
//     res.status(401).redirect('/#/user');
//   }
// });

module.exports = router;
