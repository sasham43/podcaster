if(process.env.ENV == 'local'){
    require('dotenv').config();
}
var express = require('express');
var app = express();

var bodyParser = require('body-parser');
var session = require('express-session');
var passport = require('passport');
var GoogleStrategy = require('passport-google-oauth20').Strategy;
// console.log('GoogleStrategy:', GoogleStrategy);

var index = require('./routes/index');
var podcast = require('./routes/podcast');
var auth = require('./routes/auth');
var dbconn = require('./db/db');

var db;

// var db_url = process.env.DATABASE_URL || 'podcaster';
var db_url = 'podcaster';

dbconn(db_url).then(function(db_conn){
  console.log('db connected.');
  db = db_conn;

  passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_ID,
    clientSecret: process.env.GOOGLE_SECRET,
    callbackURL: process.env.GOOGLE_CALLBACK
  }, function(accessToken, refreshToken, profile, cb){
    //   console.log('profile:', profile);
    db.customers.findOne({google_id: profile.id}, function(err, results){
        // console.log('results:', results, err);

        if(results == undefined){
            db.customers.insert({google_id: profile.id, google_photo: profile.photos[0].value, first_name: profile.name.givenName, last_name: profile.name.familyName, google_token: accessToken, google_refresh: refreshToken}, function(err, user){
              if(err){
                 console.log(err);
                 cb(err)
               } else {
                //  console.log('saved user:', user);
                 cb(null, user);
               }
           });
        } else {
            db.customers.save({id:results.id, google_id: profile.id, google_photo: profile.photos[0].value, first_name: profile.name.givenName, last_name: profile.name.familyName, google_token: accessToken, google_refresh: refreshToken}, function(err, user){
              if(err){
                 console.log(err);
                 cb(err)
               } else {
                //  console.log('saved user:', user);
                 cb(null, user);
               }
           });
        }
    });
  }));

})

app.use(express.static('server/public'));
app.use(bodyParser.json({limit: '100mb'}));
app.use(session({
  secret: 'teal walls',
  resave: true,
  saveUninitialized: false,
  cookie: {maxAge: 3600000, secure: false}
}));
app.use(passport.initialize());
app.use(passport.session());

passport.serializeUser(function(user, cb) {
  cb(null, user.id);
});

passport.deserializeUser(function(id, cb) {
  db.customers.findOne({id:id}, function(err, results){
    if(err){
      console.log('err', err);
      cb(err);
    } else {
      // console.log('user deserialized.', results);
      cb(null, {id:id, authenticated: true, first_name: results.first_name, last_name: results.last_name, google_photo: results.google_photo});
    }
  });
});
//
// app.all('/*', function(req, res, next) {
//     console.log('all route:', req.originalUrl);
//     next();
//     // Just send the index.html for other files to support HTML5Mode
//     // res.sendFile('/public/views/index.html', { root: __dirname });
// });
//
// app.get('*', function(req, res, next){
//     console.log('all route:', req.originalUrl);
//     next();
// });
//
//
// app.get(/^\/(?:user|feed|episode)/, function(req, res, next){
//     console.log('server auth check.')
//     if(req.user){
//         console.log('authorized login attempt.');
//         return next();
//     } else {
//         console.log('unauthorized login attempt.');
//         res.redirect('/login')
//     }
// });

app.use('/', index);
app.use('/podcast', podcast);
app.use('/auth', auth.router);

app.listen(process.env.PORT || 3000, function(){
  console.log('server listening on port', 3000 + '...');
});
