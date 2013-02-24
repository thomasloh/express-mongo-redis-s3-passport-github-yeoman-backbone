var express         = require('express'),
    config          = require('./config'),
    server          = express(),
    mongoose        = require('mongoose');

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
server.use(express.methodOverride());
server.use(express.bodyParser());
// server.use(express.session({secret: 'jumping jacks'}));
// server.use(passport.initialize());
// server.use(passport.session());
server.use(server.router);
server.configure('developement', function() {
})
server.configure('production', function() {
})

ap = server.get('api_prefix');

/*
 * --------------------------------
 * AUTHENTICATIONS
 * --------------------------------
 */
 // var GITHUB_CLIENT_ID = "81d79776accbbad7f1c6"
 // var GITHUB_CLIENT_SECRET = "9977e92222f72ae13dd96f759bb7932a60535ea4";

 // passport.serializeUser(function(user, done) {
 //   done(null, user);
 // });

 // passport.deserializeUser(function(obj, done) {
 //   done(null, obj);
 // });

 // passport.use(new GitHubStrategy({
 //     clientID: GITHUB_CLIENT_ID,
 //     clientSecret: GITHUB_CLIENT_SECRET,
 //     callbackURL: "http://localhost:5000/auth/github/callback/"
 //   },
 //   function(accessToken, refreshToken, profile, done) {
 //     // asynchronous verification, for effect...
 //     process.nextTick(function () {
       
 //       // To keep the example simple, the user's GitHub profile is returned to
 //       // represent the logged-in user.  In a typical application, you would want
 //       // to associate the GitHub account with a user record in your database,
 //       // and return that user instead.
 //       return done(null, profile);
 //     });
 //   }
 // ));

 // server.get('/auth/github/',
 //   passport.authenticate('github'));

 // server.get('/auth/github/callback/',
 //   passport.authenticate('github', { failureRedirect: '/login' }),
 //   function(req, res) {
 //     // Successful authentication
 //   });


/*
 * ---------------
 * API
 *
 *
 * req.body
 * req.params
 * req.param
 * req.get
 * res.json
 * 
 * ---------------
 */

// Helpers
function authenticated(req, res, next) {
  // check redis store
  // if (loggedIn) {
  //   return next();
  // } else {
  //   res.send(404, 'Unauthenticated');
  // }
};

// check auth
// server.all('*', auth);

// POST - create a new profile
server.post(ap + '/p/', authenticated, function(req, res) {
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
    };
    // Send back response
    res.json(profile);
  });
});

// GET - gets a profile
server.get(ap + '/p/:id/', authenticated, function(req, res) {
  console.log('Getting a profile')

  var id;

  // Get params
  id = req.param('id');

  // Grab profile
  Profile.findById(id, authenticated, function(err, profile) {
    if (err) {
      res.json({
        error: 'Profile doesn\' exists'
      })
    };
    // Send back response
    res.json(profile);
  });
});


// PUT - updates a profile
server.put(ap + '/p/:id/', authenticated, function(req, res) {
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
    };
    res.send(200);
  });

});

// DELETE - deletes a profile
server.delete(ap + '/p/:id/', function(req, res) {
  console.log('Deleting a profile')

  // checks if 

  var id;

  // Get params
  id = req.param('id');

  // Delete profile
  Profile.findByIdAndRemove(id, function(err) {
    if (err) {
      res.json({
        error: 'Profile doesn\' exists'
      })
    };
    res.send(200);
  });

});

/*
 * -------------------
 * Starts the server
 * -------------------
 */
server.listen(server.get('port'));
console.log("API server started on port " + server.get('port'));
