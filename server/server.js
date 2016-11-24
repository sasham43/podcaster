var express = require('express');
var app = express();

var bodyParser = require('body-parser');
var passport = require('passport');

var index = require('./routes/index');
var Massive = require('massive');

var dbUrl = process.env.DB_URL || 'podcaster';

// module.exports.db
var MassiveInstance = Massive.connectSync({db: dbUrl});

app.set('db', MassiveInstance);
app.use(express.static('server/public'));
app.use(bodyParser.json());

var db = app.get('db');

console.log('db connected:', db);

db.create_customers(function(err, results){
  console.log('created customers table.', err, results);
});

app.use('/', index);


app.listen(3000, function(){
  console.log('server listening on port', 3000 + '...');
});
