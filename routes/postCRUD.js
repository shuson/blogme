var Post = require('../models/post');

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
