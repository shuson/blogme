
/*
 * routers.
 */
var general = require('./general'),
	secUtil = require('./securityUtil'),
	postCRUD = require('./postCRUD');

module.exports = function (app){
	//home page router
	app.get('/',general.homepage);

	//registration
	app.get('/reg', secUtil.checkNotLogin);
	app.get('/reg', secUtil.reg);

	app.post('/reg', secUtil.checkNotLogin);
	app.post('/reg', secUtil.regDo);

  //login
  app.get('/login', secUtil.checkNotLogin);
  app.get('/login', secUtil.login);

  app.post('/login', secUtil.checkNotLogin);
  app.post('/login', secUtil.loginDo);

 	//Compose
 	app.get('/post', secUtil.checkLogin);
 	app.get('/post', postCRUD.compose);

  app.post('/post', secUtil.checkLogin);
  app.post('/post', postCRUD.composeDo);

  //get into detailPage by id
  app.get('/post/:id',postCRUD.getPostById);
  //logout
  app.get('/logout', secUtil.checkLogin);
  app.get('/logout', secUtil.logout);
}
