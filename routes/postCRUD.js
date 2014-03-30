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
  var currentUser = req.session.user,
      postId = req.body.id;

  Post.getById(postId, function(err, post){
      if(err){
        req.flash('error',err);
        return res.redirect('/');
      }
      console.log(post);
      res.render('postDetailPage',{
        title:"Detail Page",
        user:req.session.user,
        post:post,
        success: req.flash('success').toString(),
        error: req.flash('error').toString()
      });
  });

}