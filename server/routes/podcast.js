var express = require('express');
var router = express.Router();

var Podcast = require('podcast');

router.post('/create-feed', function(req, res){
  var options = req.body;
  options.pubDate = options.pub_date;
  options.managingEditor = options.managing_editor;
  options.webMaster = options.web_master;


  var feed = new Podcast(options);
  var xml = feed.xml();
  console.log('feed:', feed);
  res.status(200).send('Yaaaa');
});

module.exports = router;
