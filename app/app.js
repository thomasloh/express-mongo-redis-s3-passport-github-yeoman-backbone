
/**
 * Module dependencies.
 */

var express         = require('express'),
    config          = require('./config'),
    http            = require('http'),
    https           = require('https'),
    path            = require('path'),
    mongoose        = require('mongoose'),
    RedisStore      = require('connect-redis')(express),
    passport        = require('passport'),
    GitHubStrategy  = require('passport-github').Strategy,
    _               = require('underscore');

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
  position    : String,
  location    : String,
  specialty   : String,
  email       : String,
  twitter     : String,
  github_data : {},
  github_id   : Number,
  summary     : String,
  experiences : [{}],
  projects    : [{}],
  interest    : [{}],
  dev_habits  : {}
});

// experience = [{
//   position: 'Software Engineer',
//   company: 'Trapit'
// }]

// projects = [{
//   name: 'Project',
//   desc: 'Some description about the project',
//   techs: [String]
// }]

// interest = [String]

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

var ap, app = express();

app.configure(function(){
  app.set('title', 'DP Server');
  app.set('port', config.port);
  app.set('api_prefix', '/dp/api/v1');
  // app.set('main', __dirname + '/client/dist/index.html'); // prod
  app.set('main', __dirname + '/client/app/index.html'); // dev
  app.use(express.favicon());
  app.use(express.logger('dev'));
  app.use(express.compress());
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(express.cookieParser());
  app.use(express.session({ store: new RedisStore, secret: 'oppa gangnam style!' , cookie: { secure: false, maxAge: 86400000 } }));
  // Initialize Passport!  Also use passport.session() middleware, to support
  // persistent login sessions (recommended).
  app.use(passport.initialize());
  app.use(passport.session());
  // app.use(express.csrf());
  // app.use(express.static(path.join(__dirname, '/client/dist/')));
  app.use(express.static(path.join(__dirname + '/client/app')));
  app.use(app.router);
});
ap = app.get('api_prefix');

app.configure('development', function(){
  app.use(express.errorHandler({ dumpExceptions: true, showStack: true })); 
});

app.configure('production', function(){
  app.use(express.errorHandler()); 
});

/*
 * ---------------
 * API
 * ---------------
 */

 // API Internals
 var Entity = {
  create: function(json, callback) {
    console.log('Creating a new profile...');

    // Create new Profile
    var profile = new Profile(json);

    // make sure _id not there
    delete json._id;

    // Save to db
    profile.save(function(err, p) {
      if (err) {
        callback({
          msg: 'Problem creating profile.'
        }, null);
      } else {
        callback(null, p);
      }
    });
  },
  update: function(id, json, callback) {
    console.log('Updating a profile');
    // make sure _id is not there
    delete json._id;
    // Update profile
    Profile.findByIdAndUpdate(id, json, function(err, profile) {
      if (err) {
        callback({
          msg: 'Profile doesn\' exists'
        }, null);
      } else {
        callback(null, profile);
      }
    });
  },
  get: function(id, callback) {
    console.log('Getting a profile')

    // Grab profile
    Profile.findById(id, '-__v ', function(err, profile) {
      if (err || profile === null) {
        callback({
          msg: 'Profile doesn\' exists'
        }, null);
      } else {
        callback(null, profile);
      }
    });

  },

  find: function(json, callback) {
    Profile.findOne(json, '-__v ', function(err, profile) {
      if (err || profile === null) {
        callback({
          msg: 'Profile doesn\'t exist'
        });
      } else {
        // Send back response
        callback(null, profile);
      }
    });
  },

  delete: function(id, callback) {
    console.log('Deleting a profile')

    // Delete profile
    Profile.findByIdAndRemove(id, function(err) {
      if (err) {
        callback({
          msg: 'Profile doesn\' exists'
        })
      } else {
        callback(null);
      }
    });

  }
 }

 // Allow cors
 app.all('/*', function(req, res, next) {
   res.header("Access-Control-Allow-Origin", "http://localhost:9000");
   res.header("Access-Control-Allow-Credentials", true);
   res.header("Access-Control-Allow-Headers", "X-Requested-With, Content-Type, Origin, Accept");
   res.header("Access-Control-Allow-Methods", "POST, GET, PUT, DELETE");
   next();
 });

 // Handle preflight requests
 app.options('/*', function(req, res, next) {
   console.log("Approving preflight request");
   res.send(200);
 });

 // Helpers
 function authenticate(req, res, next) {
   if (req.isAuthenticated()) {
     return next();
   } else {
     res.send(401);
   }
 };

 function checksIfUserExists(github_id, callback) {
   // Grab profile if any.
   Profile.findOne({github_id: github_id}, '-__v ', function(err, profile) {
     if (err || profile === null) {
       callback(false);
     } else {
       // Send back response
       callback(profile);
     }
   });
 };

 function createUserProfileForTheFirstTime(user, callback) {
   var url;
   url = app.get('api_prefix') + '/p';
   Entity.create(user, function(err, profile) {
    if (err) {
      throw new Error(err.msg);
    } else {
      callback(profile);
    }
   });
 };

// Main API

// POST - create a new profile
app.post(ap + '/p', authenticate, function(req, res) {
  var json = {
    name: req.param('name')
  };
  // console.log(req.body)
  Entity.create(json, function(err) {
    if (err) {
      throw new Error(err.msg);
    } else {
      res.send(201);
    }
  })
});

// GET - gets a profile
app.get(ap + '/p/:id', authenticate, function(req, res) {
  var id = req.param('id');
  Entity.get(id, function(err, profile) {
    if (err) {
      res.json(err);
    } else {
      res.json(profile);
    }
  })
});

// PUT - updates a profile
app.put(ap + '/p/:id', authenticate, function(req, res) {
  var id, data;

  // Get params
  id   = req.param('id');
  data = req.body;

  Entity.update(id, data, function(err, profile) {
    if (err) {
      res.json(err);
    } else {
      res.send(200);
    }
  })
});

// DELETE - deletes a profile
app.delete(ap + '/p/:id', authenticate, function(req, res) {
  // Get params
  var id = req.param('id');

  Entity.delete(id, function(err) {
    if (err) {
      res.json(err);
    } else {
      res.send(200);
    }
  })
});

// AUTH API

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

    var github_user = req.session.passport.user,
        github_id   = github_user.id;

    // Registers users if user doesnt exist already
    checksIfUserExists(github_id, function(profile) {
      if (!profile) {
        var user = {
          'name'        : github_user._json.name,
          'email'       : github_user._json.email,
          'company'     : github_user._json.company,
          'location'    : github_user._json.location,
          'github_id'   : github_id,
          'github_data' : github_user
        };

        createUserProfileForTheFirstTime(user, function() {
          res.redirect('/');
        })
      } else {
        res.redirect('/');
      }
  });
});

app.get('/auth', function(req, res, next) {
  var github_id,
      auth_data = {
        loggedIn: req.isAuthenticated(),
        session: req.session
      };
  if (auth_data.loggedIn) {
    github_id = req.session.passport.user.id;
    Entity.find({github_id: github_id}, function(err, profile) {
      if (err) {
        throw new Error(err.msg);
      } else {
        auth_data['user'] = profile;
        res.json(auth_data);
      }
    })
  } else {
    res.json(auth_data);
  }
});

app.get('/logout', function(req, res){
  req.logout();
  res.redirect('/');
});

app.get('/*', authenticate, function(req, res) {
  res.sendfile(app.get('main'));
});


// Starts application server
app.listen(app.get('port'), function(){
  console.log("Express listening on port " + app.get('port'));
});


