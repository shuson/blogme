
/*
 * routers.
 */
var crypto = require('crypto'),
    User = require('../models/user.js'),
    Post = require('../models/post.js');

module.exports = function (app){
	//home page router
	app.get('/',function (req, res) {
  		Post.get(null, function (err, posts) {
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
	});

	//registration
	app.get('/reg', checkNotLogin);
	app.get('/reg',function (req,res) {
		res.render('reg', {
    		title: 'Register',
    		user: req.session.user,
    		success: req.flash('success').toString(),
    		error: req.flash('error').toString()
  		});
	});

	app.post('/reg', checkNotLogin);
	app.post('/reg', function (req, res) {
  		var name = req.body.name,
      		password = req.body.password,
      		password_re = req.body['password-repeat'];
  	
  		if (password_re != password) {
    		req.flash('error', 'Please make sure the password is correctly typed in!'); 
    		return res.redirect('/reg');
  		}
  
  		var md5 = crypto.createHash('md5'),
      		password = md5.update(req.body.password).digest('hex');
  		var newUser = new User({
      		name: req.body.name,
      		password: password,
      		email: req.body.email
  		});
  		
  		User.get(newUser.name, function (err, user) {
    		if (user) {
      			req.flash('error', 'User Exists!');
      			return res.redirect('/reg');
    		}
    
    		newUser.save(function (err, user) {
      			if (err) {
        			req.flash('error', err);
        			return res.redirect('/reg');
      			}
      			req.session.user = user;
      			req.flash('success', 'registration Success!');
      			res.redirect('/');
  			});
  		});
  	});

  	//login
  	app.get('/login', checkNotLogin);
  	app.get('/login', function (req, res) {
    	res.render('login', {
        title: 'Login',
        user: req.session.user,
        success: req.flash('success').toString(),
        error: req.flash('error').toString()});
  	});

  	app.post('/login', checkNotLogin);
  	app.post('/login', function (req, res) {

  		var md5 = crypto.createHash('md5'),
      	password = md5.update(req.body.password).digest('hex');

  		User.get(req.body.name, function (err, user) {
    		if (!user) {
      			req.flash('error', 'User does not exist'); 
      			return res.redirect('/login');
    		}
   
    		if (user.password != password) {
     			req.flash('error', 'Invalid Password!'); 
      			return res.redirect('/login');
    		}
    
    		req.session.user = user;
    		req.flash('success', 'Login Success!');
    		res.redirect('/');
  		});
 	});

 	//Compose
 	app.get('/post', checkLogin);
 	app.get('/post', function (req, res) {
    	 res.render('post', {
      		title: 'Compose',
      		user: req.session.user,
      		success: req.flash('success').toString(),
      		error: req.flash('error').toString()
    	});
  	});

  	app.post('/post', checkLogin);
  	app.post('/post', function (req, res) {
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
  	});

  	//logout
  	app.get('/logout', checkLogin);
  	app.get('/logout', function (req, res) {
  		req.session.user = null;
  		req.flash('success', 'Good Bye');
  		res.redirect('/');
  	});

  	function checkLogin(req, res, next) {
    	if (!req.session.user) {
     		req.flash('error', 'Not Login!'); 
      		res.redirect('/login');
    	}
    	next();
  	}

  	function checkNotLogin(req, res, next) {
    	if (req.session.user) {
      		req.flash('error', 'Already Login!'); 
      		res.redirect('back');
    	}
    	next();
  	}
}