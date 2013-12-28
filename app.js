
/**
 * Module dependencies.
 */

var express = require('express');
var routes = require('./routes');
var user = require('./routes/user');
var http = require('http');
var path = require('path');

//mongodb
var mongo = require('mongodb');
var monk = require('monk');
var db = monk('localhost:27017/costcalculator');

var app = express();

function checkAuth(req, res, next) {
  if (!req.session.user_id) {
    res.send('You are not authorized to view this page');
  } else {
    next();
  }
};

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.json());
app.use(express.urlencoded());
app.use(express.methodOverride());
app.use(express.cookieParser('your secret here'));
app.use(express.session());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

app.get('/', routes.index);
app.get('/auth', routes.auth);
app.get('/login', routes.auth);
app.get('/message', routes.message);
app.post('/login', routes.login(db));
app.post('/signup', routes.signup(db));
app.get('/userlist', routes.userlist(db));
app.get('/logout', function (req, res) {
  delete req.session.user_id;
  res.redirect('/login');
});

http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});

if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}
