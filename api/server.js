var express         = require('express'),
    config          = require('./config'),
    server          = express(),
    mongoose        = require('mongoose');
    RedisStore      = require('connect-redis')(express),
    passport        = require('passport'),
    GitHubStrategy  = require('passport-github').Strategy;

/*
 * ------------------------------
 * DATABASE CONFIGURATIONS
 * ------------------------------
 */

// connect
mongoose.connect('mongodb://localhost/dp');
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function callback() {
  console.log('Mongo connected');
});

// define schema

// PROFILES
var profile_schema = mongoose.Schema({
  name        : String,
  company     : String,
  location    : String,
  email       : String
});

profile_schema.methods.imaged = function() {
  console.log('Yay I got a picture!');
};

var Profile = mongoose.model('Profile', profile_schema);

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
     callbackURL: "http://localhost:5000/auth/github/callback"
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
var ap;
server.set('title', 'DP API Server');
server.set('port', config.port);
server.set('api_prefix', '/dp/api/v1');
server.use(express.logger());
server.use(express.compress());
server.use(express.bodyParser());
server.use(express.methodOverride());
server.use(express.cookieParser());
server.use(express.session({ store: new RedisStore, secret: 'oppa gangnam style!' , cookie: { secure: false, maxAge: 86400000 } }));
// Initialize Passport!  Also use passport.session() middleware, to support
// persistent login sessions (recommended).
server.use(passport.initialize());
server.use(passport.session());
server.use(server.router);
server.configure('developement', function() {
})
server.configure('production', function() {
})

ap = server.get('api_prefix');

/*
 * ---------------
 * API
 * ---------------
 */

// Helpers
function authenticate(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  } else {
    res.send(401);
  }
};

// Allow cors
server.all('/*', function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "http://localhost:5001");
  res.header("Access-Control-Allow-Credentials", true);
  res.header("Access-Control-Allow-Headers", "X-Requested-With, Content-Type");
  res.header("Access-Control-Allow-Methods", "POST, GET, PUT, DELETE");
  next();
});

// Handle preflight requests
server.options('/*', function(req, res, next) {
  console.log("Approving preflight request");
  res.send(200);
});

// POST - create a new profile
server.post(ap + '/p', authenticate, function(req, res) {
  console.log('Creating a new profile...');

  var name,
      profile;

  // Get params
  name = req.param('name');

  // Create new Profile
  profile = new Profile({
    name: name
  });

  // Save to db
  profile.save(function(err, profile) {
    if (err) {
      throw new Error('Problem creating profile.');
    } else {
      // Send back response
      res.send(201);
    }
  });
});

// GET - gets a profile
server.get(ap + '/p/:id', function(req, res) {
  console.log('Getting a profile')

  var id;

  // Get params
  id = req.param('id');

  // Grab profile
  Profile.findById(id, '-__v -_id', function(err, profile) {
    if (err) {
      res.json({
        error: 'Profile doesn\' exists'
      })
    } else {
      // Send back response
      res.json(profile);
    }
  });
});


// PUT - updates a profile
server.put(ap + '/p/:id', authenticate, function(req, res) {
  console.log('Updating a profile');

  var id, data;

  // Get params
  id   = req.param('id');
  data = req.body;

  // Update profile
  Profile.findByIdAndUpdate(id, data, function(err, profile) {
    if (err) {
      res.json({
        error: 'Profile doesn\' exists'
      })
    } else {
      res.send(200);
    }
  });

});

// DELETE - deletes a profile
server.delete(ap + '/p/:id', authenticate, function(req, res) {
  console.log('Deleting a profile')

  var id;

  // Get params
  id = req.param('id');

  // Delete profile
  Profile.findByIdAndRemove(id, function(err) {
    if (err) {
      res.json({
        error: 'Profile doesn\' exists'
      })
    } else {
      res.send(200);
    }
  });

});

/*
 * -------------------
 * Starts the server
 * -------------------
 */
server.listen(server.get('port'));
console.log("API server started on port " + server.get('port'));
