var express = require('express');
var router = express.Router();

var Podcast = require('podcast');
var dbconn = require('../db/db');

// similar function to attach user to req? from auth.user?

router.use(function(req, res, next){
  dbconn('podcaster').then(function(db){
    req.db = db;
    return next();
  }).catch(function(err){
    return next(err);
  });
});


router.post('/create-feed', function(req, res){
  var feed = req.body;
  req.db.feeds.save(feed, function(err, results){
    if(err){
      console.log('create-feed err:',err);
      res.status(500).send(err);
    } else {
      console.log('results:', results);
      res.status(200).send(results);
    }
  })
});

function createPodcast(options){
  // var options = req.body;
  options.pubDate = options.pub_date;
  options.managingEditor = options.managing_editor;
  options.webMaster = options.web_master;


  var feed = new Podcast(options);
  var xml = feed.xml();
  console.log('feed:', feed);
  // res.status(200).send('Yaaaa');
}

module.exports = router;
