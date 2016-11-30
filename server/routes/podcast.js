var express = require('express');
var router = express.Router();

var Podcast = require('podcast');

router.post('/create-feed', function(req, res){
  var options = req.body;

  var feed = new Podcast(options);
  console.log('feed:', feed);
});

module.exports = router;
