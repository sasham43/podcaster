var express = require('express');
var router = express.Router();
var fs = require('fs');
var Podcast = require('podcast');
var AWS = require('aws-sdk');
var multer = require('multer');
var multerS3 = require('multer-s3');
var dbconn = require('../db/db');

// similar function to attach user to req? from auth.user?

var s3 = new AWS.S3();
var upload = multer({
  storage: multerS3({
    s3: s3,
    bucket: 'podcaster-episodes',
    metadata: function (req, file, cb) {
      cb(null, Object.assign({}, req.body));
    },
    key: function (req, res, cb){
      cb(null, req.body.new_episode.id + '_' + req.body.new_episode.title);
    }
  })
})

router.use(function(req, res, next){
  dbconn('podcaster').then(function(db){
    req.db = db;
    return next();
  }).catch(function(err){
    return next(err);
  });
});

// router.use('/:id', function(req, res, next){
//   console.log('attaching user to req')
//   req.db.customers.findOne({id:req.params.id}, function(err, results){
//     if(err){
//       return next(err);
//     } else {
//       console.log('results:', results);
//       req.customer = results;
//       return next();
//     }
//   })
// })

router.post('/:id/upload', upload.single('episode'), function(req, res, next){
  console.log('file upload:', req.body, req.file);
  uploadToS3(req.body.data);
});

router.get('/:id/episodes', function(req, res){
  req.db.episodes.find({customer_id: req.params.id}, function(err, results){
    if(err){
      res.status(500).send(err);
    } else {
      res.status(200).send(results);
    }
  });
});

router.post('/:id/episodes', function(req, res){
  req.body.customer_id = req.params.id;
  req.db.episodes.insert(req.body, function(err, results){
    if(err){
      res.status(500).send(err);
    } else {
      // res.pub_date = new Date(res.pub_date);
      res.status(200).send(results);
    }
  });
});

router.put('/:id/episodes', function(req, res){
  req.db.episodes.save(req.body, function(err, results){
    if(err){
      res.status(500).send(err);
    } else {
      // res.pub_date = new Date(res.pub_date);
      res.status(200).send(results);
    }
  });
});

router.get('/:id/feed', function(req, res){
  req.db.feeds.findOne({customer_id:req.params.id}, function(err, results){
    if(err){
      res.status(500).send(err);
    } else {
      // res.pub_date = new Date(res.pub_date);
      res.status(200).send(results);
    }
  });
});


router.post('/:id/feed', function(req, res){
  var feed = req.body;
  feed.customer_id = req.params.id;
  console.log('feed:', feed);
  req.db.feeds.save(feed, function(err, results){
    if(err){
      console.log('create-feed err:',err);
      res.status(500).send(err);
    } else {
      console.log('results:', results);
      results.pub_date = new Date(results.pub_date);
      res.status(200).send(results);
    }
  });
});

router.get('/:id/publish', function(req, res){
  req.db.feeds.findOne({customer_id: req.params.id}, function(err, results){
    if(err){
      res.status(500).send(err);
    } else {
      // console.log('create podcast:', results);
      createPodcast(results, req, function(pub){
        console.log('pub:', pub);
        if(pub){
          res.status(200).send(pub);
        } else {
          res.status(500).send(pub);
        }
      });
    }
  });
});

function createPodcast(options, req, cb){
  options.pubDate = options.pub_date;
  options.managingEditor = options.managing_editor;
  options.webMaster = options.web_master;

  var feed = new Podcast(options);

  // get and add episodes
  req.db.episodes.find({customer_id: options.customer_id}, function(err, results){
    if(err){
      cb(false);
    } else {
      // console.log('episode results:', results);
      results.map(function(episode){
        // console.log('episode:', episode);
        feed.item(episode);
      });

      var xml = feed.xml('\t');
      console.log('feed:', feed);
      var title = feed.title.replace(' ', '_');
      var filename = 'server/public/feeds/' + title + '.xml';
      fs.writeFile(filename, xml, function(err, resp){
        if(err){
          console.log('error publishing:', err);
          cb(false);
        } else {
          console.log('published.');
          cb(true);
        }
      });
    }
  });
}

function uploadToS3(episode){

}

module.exports = router;
