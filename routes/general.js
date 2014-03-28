var Post = require('../models/post.js');

exports.homepage = function (req, res) {
  		Post.get(null, function (err, posts) {
    		if (err) {
      			posts = [];
    		} 
    		res.render('index', {
      			title: 'Home Page',
      			user: req.session.user,
      			posts: posts,
      			success: req.flash('success').toString(),
      			error: req.flash('error').toString(),
    		});
  		});
	}
