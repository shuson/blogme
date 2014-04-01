var mongodb = require('./db'),
	ObjectID = require('mongodb').ObjectID;
function Post(name, title, post) {
  this.name = name;
  this.title = title;
  this.post = post;
}

module.exports = Post;

//save
Post.prototype.save = function(callback) {
  var date = new Date();
  
  var time = {
      date: date,
      year : date.getFullYear(),
      month : date.getFullYear() + "-" + (date.getMonth() + 1),
      day : date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate(),
      minute : date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate() + " " + 
      date.getHours() + ":" + (date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes()) 
  }
  
  var post = {
      name: this.name,
      time: time,
      title: this.title,
      post: this.post
  };
  
  mongodb.open(function (err, db) {
    if (err) {
      return callback(err);
    }
    
    db.collection('posts', function (err, collection) {
      if (err) {
        mongodb.close();
        return callback(err);
      }
      
      collection.insert(post, {
        safe: true
      }, function (err) {
        mongodb.close();
        if (err) {
          return callback(err);
        }
        callback(null);
      });
    });
  });
};

//get all posts by current login user'name
Post.getAll = function(name,callback){

  mongodb.open(function(err, db){
    
    if(err){
      return callback(err);
    }

    db.collection('posts',function(err,collection){
      if(err){
        mongodb.close();
        return callback(err);
      }

      var query = {};
      if(name){
        //console.log(name);
        query.name = name;
      }

      collection.find(query)
                .sort({
                  time:-1
                })
                .toArray(function(err, docs){
                  mongodb.close();
                  if(err){
                    return callback(err);
                  }
                  //console.log(docs);
                  callback(null, docs);
                });
    });
  });
}

//get post from db by id
Post.getById = function(id, callback) {
  
  mongodb.open(function (err, db) {
    if (err) {
      return callback(err);
    }
    
    db.collection('posts', function(err, collection) {
      if (err) {
        mongodb.close();
        return callback(err);
      }
      var query = {};
      if (id) {
        query._id = new ObjectID(id);
      }
      
      collection.findOne(query, function (err, doc) {
          mongodb.close();
          if (err) {
               return callback(err);
           }
          //console.log(doc);
          callback(null, doc);
        });
    });
  });
};

//remove one post by id
Post.removeById = function(id, callback){
	mongodb.open(function (err, db){
		if(err){
			return callback(err);
		}

		db.collection('posts',function(err,collection){
			if(err){
				mongodb.close();
				return callback(err);
			}

			var query = {};
			if(id){
				query._id = new ObjectID(id);
				console.log(query);
				collection.remove(query,{w:1}, function(err, deletedNum){
					mongodb.close();
					if(err){
						return callback(err);
					}
					callback(null,deletedNum);
				});
			}
		});
	});
}

//update post by id
Post.update = function(id,post,callback){
	var date = new Date();
  
	var time = {
	    date: date,
		year : date.getFullYear(),
		month : date.getFullYear() + "-" + (date.getMonth() + 1),
		day : date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate(),
		minute : date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate() + " " + 
		date.getHours() + ":" + (date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes()) 
	}
  
  
	mongodb.open(function (err, db) {
		if (err) {
		return callback(err);
		}
    
		db.collection('posts', function (err, collection) {
		if (err) {
			mongodb.close();
			return callback(err);
		}

		var query = {};
		if(id){
			query._id=new ObjectID(id);
		}
		var update={};
		if(post){
			update.time = time;
			update.post = post;
		}

		collection.update(query,{$set:update}, {
			safe: true,
			multi:false
		}, function (err,result) {
			mongodb.close();
			if (err) {
				return callback(err);
			}
			callback(null);
		});
    });
  });
}
