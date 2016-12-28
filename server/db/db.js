var Massive = require('massive');
var q = require('q');

var connectionString = process.env.DATABASE_URL || 'podcaster';

var connections;
var dbconn;

module.exports = dbconn = function(name){
  connections = connections || {};
  var d = q.defer();
  if(connections[name]){
    d.resolve(connections[name]);
  } else {
    Massive.connect({
      connectionString: connectionString
    }, function(err, db){
      if(err){
          console.log('db connect error:', err);
        d.reject(err);
      } else {
        connections[name] = db;
        d.resolve(db);
      }
    })
  }
  return d.promise;
}

dbconn('podcaster').then(function(db){
    // need to make this synchronous
    db.create_customers(function(err, results){
      console.log('created customers table.', err, results);
    });
    db.create_feeds(function(err, results){
      console.log('created feeds table', err, results);
    });
    db.create_episodes(function(err, results){
      console.log('created episodes table', err, results);
    });
})
