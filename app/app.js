
/**
 * Module dependencies.
 */

var express         = require('express'),
    path            = require('path'),
    RedisStore      = require('connect-redis')(express),
    passport        = require('passport'),
    GitHubStrategy  = require('passport-github').Strategy;

/*
 * --------------------------------
 * AUTHENTICATIONS
 * --------------------------------
 */
 var GITHUB_CLIENT_ID = "81d79776accbbad7f1c6"
 var GITHUB_CLIENT_SECRET = "9977e92222f72ae13dd96f759bb7932a60535ea4";

 passport.serializeUser(function(user, done) {
   done(null, user);
 });

 passport.deserializeUser(function(obj, done) {
   done(null, obj);
 });

 passport.use(new GitHubStrategy({
     clientID: GITHUB_CLIENT_ID,
     clientSecret: GITHUB_CLIENT_SECRET,
     callbackURL: "http://localhost:5001/auth/github/callback"
   },
   function(accessToken, refreshToken, profile, done) {
     // asynchronous verification, for effect...
     process.nextTick(function () {
       
       // To keep the example simple, the user's GitHub profile is returned to
       // represent the logged-in user.  In a typical application, you would want
       // to associate the GitHub account with a user record in your database,
       // and return that user instead.
       return done(null, profile);
     });
   }
 ));

 /*
  * ------------------------------
  * EXPRESS CONFIGURATIONS
  * ------------------------------
  */

var app = express();

app.configure(function(){
  app.set('port', process.env.PORT || 5001);
  // app.set('authenticated_main', __dirname + '/client/dist/index.html'); // prod
  app.set('authenticated_main', __dirname + '/client/app/index.html'); // dev
  app.set('unauthenticated_main', __dirname + '/index.html');
  app.use(express.favicon());
  app.use(express.logger('dev'));
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(express.cookieParser());
  app.use(express.session({ store: new RedisStore, secret: 'oppa gangnam style!' , cookie: { secure: false, maxAge: 86400000 } }));
  // Initialize Passport!  Also use passport.session() middleware, to support
  // persistent login sessions (recommended).
  app.use(passport.initialize());
  app.use(passport.session());
  app.use(express.csrf());
  // app.use('/s', express.static(path.join(__dirname + '/client/app')));
  // app.use(express.static(path.join(__dirname + '/client/app/components/', __dirname + '/client/app/images/', __dirname + '/client/app/scripts/', './client/app/styles/')));
  // app.use(express.static(path.join(__dirname, '/client/dist/')));
  app.use(express.static(__dirname + '/client/app'));
  app.use(app.router);
});

app.configure('development', function(){
  app.use(express.errorHandler({ dumpExceptions: true, showStack: true })); 
});

app.configure('production', function(){
  app.use(express.errorHandler()); 
});

// Helpers
function authenticate(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.sendfile(app.get('unauthenticated_main'));
};

// GET /auth/github
//   Use passport.authenticate() as route middleware to authenticate the
//   request.  The first step in GitHub authentication will involve redirecting
//   the user to github.com.  After authorization, GitHubwill redirect the user
//   back to this application at /auth/github/callback
app.get('/auth/github',
  passport.authenticate('github'),
  function(req, res){
    // The request will be redirected to GitHub for authentication, so this
    // function will not be called.
  });

// GET /auth/github/callback
//   Use passport.authenticate() as route middleware to authenticate the
//   request.  If authentication fails, the user will be redirected back to the
//   login page.  Otherwise, the primary route function function will be called,
//   which, in this example, will redirect the user to the home page.
app.get('/auth/github/callback', 
  passport.authenticate('github', { failureRedirect: '/' }),
  function(req, res) {
    res.redirect('/');
  });

app.get('/logout', function(req, res){
  req.logout();
  res.redirect('/');
});

app.get('/*', authenticate, function(req, res) {
  res.sendfile(app.get('authenticated_main'));
});

app.listen(app.get('port'), function(){
  console.log("Express listening on port " + app.get('port'));
});
