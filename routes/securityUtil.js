var crypto = require('crypto'),
    User = require('../models/user.js');

//util method
exports.checkLogin = function checkLogin(req, res, next) {
    	if (!req.session.user) {
     		req.flash('error', 'Not Login!'); 
      		res.redirect('/login');
    	}
    	next();
  	},
exports.checkNotLogin = function checkNotLogin(req, res, next) {
    	if (req.session.user) {
      		req.flash('error', 'Already Login!'); 
      		res.redirect('back');
    	}
    	next();
  	},

//reg and regPost
exports.reg = function (req,res) {
		res.render('reg', {
    		title: 'Register',
    		user: req.session.user,
    		success: req.flash('success').toString(),
    		error: req.flash('error').toString()
  		});
	},
exports.regDo = function (req, res) {
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
  	},

//login and loginPost
exports.login = function (req, res) {
    	res.render('login', {
        title: 'Login',
        user: req.session.user,
        success: req.flash('success').toString(),
        error: req.flash('error').toString()});
  	},
exports.loginDo = function (req, res) {

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
 	},

//logout
exports.logout = function (req, res) {
  		req.session.user = null;
  		req.flash('success', 'Good Bye');
  		res.redirect('/');
  	}
