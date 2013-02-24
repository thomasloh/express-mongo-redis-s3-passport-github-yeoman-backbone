
/**
 * Module dependencies.
 */

var express         = require('express'),
    path            = require('path'),
    passport        = require('passport'),
    GitHubStrategy  = require('passport-github').Strategy;

var app = express();

app.configure(function(){
  app.set('port', process.env.PORT || 5001);
  app.set('main', __dirname + '/client/dist/index.html');
  app.use(express.favicon());
  app.use(express.logger('dev'));
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(express.static(path.join(__dirname, '/client/dist/')));
  app.use(app.router);
});

app.configure('development', function(){
  app.use(express.errorHandler());
});

app.get('/*', function(req, res){
  res.sendfile(app.get('main'));
});

app.listen(app.get('port'), function(){
  console.log("Express server listening on port " + app.get('port'));
});
