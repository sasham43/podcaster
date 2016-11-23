var express = require('express');
var app = express();

var bodyParser = require('body-parser');
var passport = require('passport');

var index = require('./routes/index');


app.use(express.static('server/public'));
app.use(bodyParser.json());


app.use('/', index);


app.listen(3000, function(){
  console.log('server listening on port', 3000 + '...');
});
