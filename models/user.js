var mongodb = require('./db');

function User(user) {
  this.name = user.name;
  this.password = user.password;
  this.email = user.email;
};

module.exports = User;

//save user information
User.prototype.save = function(callback) {
  
  var user = {
      name: this.name,
      password: this.password,
      email: this.email
  };
  
  mongodb.open(function (err, db) {
    if (err) {
      return callback(err);
    }
    //get user collection
    db.collection('users', function (err, collection) {
      if (err) {
        mongodb.close();
        return callback(err);
      }
      //insert single user if err is null
      collection.insert(user, {
        safe: true
      }, function (err, user) {
        mongodb.close();
        if (err) {
          return callback(err);
        }
        callback(null, user);//success！return user
      });
    });
  });
};

//get user information
User.get = function(name, callback) {
  
  mongodb.open(function (err, db) {
    if (err) {
      return callback(err);
    }
    
    db.collection('users', function (err, collection) {
      if (err) {
        mongodb.close();
        return callback(err);
      }
      //get user by name
      collection.findOne({
        name: name
      }, function (err, user) {
        mongodb.close();
        if (err) {
          return callback(err);
        }
        callback(null, user);
      });
    });
  });
};