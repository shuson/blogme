var Post = require('../models/post');

//get all posts by login user'name
exports.getAll = function (req, res) {
      var currUser = req.session.user,
          name = null;
      if(currUser)
      {
        name = currUser.name;
      }

      Post.getAll(name, function (err, posts) {
        if (err) {
            posts = [];
        } 
        res.render('index', {
            title: 'Home Page',
            user: req.session.user,
            posts: posts,
            success: req.flash('success').toString(),
            error: req.flash('error').toString()
        });
      });
  }

//create new post
exports.compose = function (req, res) {
    	 res.render('post', {
      		title: 'Compose',
      		user: req.session.user,
      		success: req.flash('success').toString(),
      		error: req.flash('error').toString()
    	});
  	},
exports.composeDo = function (req, res) {
  		var currentUser = req.session.user,
      		post = new Post(currentUser.name, req.body.title, req.body.post);
  		post.save(function (err) {
    		if (err) {
      			req.flash('error', err); 
      			return res.redirect('/');
    		}
   			req.flash('success', 'Success!');
    		res.redirect('/');
  		});
  	}

//view post detail
exports.getPostById = function(req,res){
  var postId = req.params.id;
  
  Post.getById(postId, function(err, post){
      if(err){
        req.flash('error',err);
        return res.redirect('/');
      }

      res.render('postDetailPage',{
        title:"Detail Page",
		user:req.session.user,
        post:post,
        success: req.flash('success').toString(),
        error: req.flash('error').toString()
      });
  });
}

//delete one post by Id
exports.removePostById = function(req, res){
	var postId = req.body.id;

	if(postId)
	{
		Post.removeById(postId,function(err, result){
			if(err){
				req.flash('error',err);
				return res.redirect('/');
			}
			
			if(result>0){
				req.flash('error',"Success!");
			}else{
				req.flash('success', 'Deleting Failed!');
			}
			res.redirect('/');
		});
	}
}

//update post by id
exports.updatePostById = function(req, res){
	var postId = req.body.idUpdate,
		postContent = req.body.contentUpdate;

	if(postId){
		Post.update(postId,postContent,function(err,result){
			if(err){
				req.flash("error",err);
				return res.redirect('/');
			}

			if(result>0){
				req.flash('error',"Success!");
			}else{
				req.flash('success', 'Updating Failed!');
			}
			res.redirect('/');
		});
	}
}
