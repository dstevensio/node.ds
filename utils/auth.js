var output = require('../output'),
    loggedIn,
    showLogInScreen,
    checkCredentials,
    loginRequired,
    requiresLogin = {
      "admin": true
    };
    
module.exports = function(req, res, next) {
  var auth = loggedIn(req);
  if (req.originalUrl.indexOf('logout') != -1) {
    req.session.destroy();
    next();
    return;
  } else if (req.originalUrl == '/login') {
    checkCredentials(req,res,function(req,res,auth) {
      if (auth.isLoggedIn) {        
        req.session.auth = true;
        next();
        return;
      } else {
        showLogInScreen(req,res,auth.message);
      }
    });
  } else if (auth.isLoggedIn || !loginRequired(req.originalUrl)) {
    next();
    return;
  } else {
    if (req.session) req.session.targetUrl = req.originalUrl;
    var msg = (req.originalUrl.indexOf('login') == -1) ? 'You have to log in to do that!' : '';
    showLogInScreen(req, res, msg);   
  }
};

loginRequired = function loginRequired(url) {
  var parts = url.split('/');
  if (parts.length > 1) parts = parts[1];  
  return requiresLogin[parts];
};

loggedIn = function loggedIn(req) {
  var auth = {
    isLoggedIn: false,
    message: "The username or password entered did not match our records. Try again?"
  };
  // need to also check cookie here
  if (req.session && req.session.auth === true) {
    auth.isLoggedIn = true;
    auth.message = '';
  }
  return auth;
};

showLogInScreen = function(req, res, msg) {
  var content = {
    template: "login.html",
    data: {
      unameLabel: "Username",
      pwdLabel: "Password"
    }
  }; 
  
  if (msg && msg != '') content.data.errorMsg = msg;
  output(req,res,content);  
};

checkCredentials = function(req, res, callback) {
  // call db to check it
  var auth = {
    isLoggedIn: (req.body.uname == APP.config.user && req.body.pwd == APP.config.pass)
  };  
  callback(req,res,auth);
};