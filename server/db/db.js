var Massive = require('massive');

var dbUrl = process.env.DB_URL || 'podcaster';

// module.exports.db
var db = Massive.connectSync({db: dbUrl}, function(err, db){
  console.log('db connected.');
  return db;
});


db.create_customers();

module.exports = db;
