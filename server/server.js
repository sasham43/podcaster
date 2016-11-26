require('dotenv').config();
var express = require('express');
var app = express();

var bodyParser = require('body-parser');
var session = require('express-session');
var passport = require('passport');
var Massive = require('massive');
var FacebookStrategy = require('passport-facebook').Strategy;

var index = require('./routes/index');
var auth = require('./routes/auth');

var dbUrl = process.env.DB_URL || 'podcaster';
var MassiveInstance = Massive.connectSync({db: dbUrl});

app.set('db', MassiveInstance);
app.use(express.static('server/public'));
app.use(bodyParser.json());
app.use(session({
  secret: 'teal walls',
  resave: true,
  saveUninitialized: false,
  cookie: {maxAge: 3600000, secure: false}
}));
app.use(passport.initialize());
app.use(passport.session());

var db = app.get('db');

passport.use(new FacebookStrategy({
  clientID: process.env.FACEBOOK_ID,
  clientSecret: process.env.FACEBOOK_SECRET,
  callbackURL: process.env.FACEBOOK_CALLBACK
}, function(accessToken, refreshToken, profile, cb){
  console.log('db:', db);
  var first_name = profile.displayName.split(' ')[0];
  var last_name = profile.displayName.split(' ')[1];
  db.customers.save({facebook_id: profile.id, facebook_token: accessToken, facebook_refresh: refreshToken, first_name: first_name, last_name:last_name},function(err, results){
    console.log('saved user:', err, results, profile);
    return cb(null, results);
  })
}));

passport.serializeUser(function(user, cb) {
  cb(null, user.id);
});

passport.deserializeUser(function(id, cb) {
  db.customers.find({id:id}, function(err, results){
    if(err){
      console.log('err');
      cb(err);
    } else {
      console.log('user deserialized:', results);
    }
  })
  cb(null, id);
});


// console.log('db connected:', db);

db.create_customers(function(err, results){
  console.log('created customers table.', err, results);
});

app.use('/', index);
app.use('/auth', auth);


app.listen(3000, function(){
  console.log('server listening on port', 3000 + '...');
});
