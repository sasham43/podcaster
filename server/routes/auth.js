var express = require('express');
var passport = require('passport');
var router = express.Router();

router.get('/facebook', passport.authenticate('facebook'));

router.get('/facebook/callback', passport.authenticate('facebook', {failureRedirect: '/#/login' , failureFlash: true}),
  function(req, res) {
    // Successful authentication, redirect home.
    console.log('facebook logged in.')
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
