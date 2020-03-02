var express = require("express");
var url = require("url"),
	querystring = require("querystring");
var app = express();
var bodyParser = require('body-parser');
var errorHandler = require('errorhandler');
var methodOverride = require('method-override');
var hostname = process.env.HOSTNAME || 'localhost';
var port = 8080;
var MS = require("mongoskin");
var passport = require('passport');
var configDB = require('./passport/config/database.js');
var mongoose = require('mongoose');
mongoose.connect(configDB.url); // connect to our database
var db = MS.db("mongodb://127.0.0.1:27017/rssParser")
var fs = require('fs');
var path = require('path'),
  express = require('express'),
  db = require('mongoskin').db('mongodb://127.0.0.1:27017/test');
var secret = 'test' + new Date().getTime().toString()
var session = require('express-session');
app.use(require("cookie-parser")(secret));
var MongoStore = require('connect-mongo')(session);
app.use(session( {store: new MongoStore({
   url: 'mongodb://127.0.0.1:27017/test',
   secret: secret
})}));
app.use(passport.initialize());
app.use(passport.session());
var flash = require('express-flash');
app.use( flash() );

/*
db.collection("data").remove({}, function(err, result){
  if(!err){
    console.log("success");
  }
});


db.collection("data").insert({id:1213, url:"https://rss.itunes.apple.com/api/v1/us/apple-music/coming-soon/all/10/explicit.json"}, function(err, result){
  if(!err){
    console.log("success");
  }
});

db.collection("data").find().toArray(function(err, result){
  console.log(err, result)
});

*/
var Client = require('node-rest-client').Client;

app.get("/", function (req, res) {
      res.redirect("/index.html");
});

var allFeeds = [];

app.get("/addfeed", function (req, res) {
    var url = req.query.a;
    var x = {
      id:new Date().getTime(),
      url: url
    }

  db.collection("data").insert(x, function(err, result){
    if(!err){
      res.end("1");
    }
  });
});




app.get("/deletefeed", function (req, res) {
    var id = parseInt(req.query.a);
    var x = {
      id: id
    }

  db.collection("data").remove(x, function(err, result){
    if(!err){
      res.end("1");
    }
  });
});



app.get("/getallfeeds", function (req, res) {
  db.collection("data").find().toArray(function(err, result){
      res.send(JSON.stringify(result)); // send response body
  });
});

app.get("/getrss", function (req, res) {
    var url = req.query.a;
      console.log(url);
    var client = new Client();
    client.get(url, function (data, response) {
      // parsed response body as js object
      console.log(data);
      res.send(data); // send response body
    });
});

app.use(passport.initialize());
app.use(passport.session());
var flash = require('express-flash');
app.use( flash() );



app.use(methodOverride());
app.use(bodyParser());
app.use(express.static(__dirname + '/public'));
app.use(errorHandler());
app.use( bodyParser.json() );       // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
  extended:false
}));
require('./passport/config/passport')(passport); // pass passport for configuration
require('./passport/routes.js')(app, passport); // load our routes and pass in our app and fully configured passport



app.use(express.static(path.join(__dirname, 'public')));

app.get("/getsomeDBinfo", isLoggedIn, function(req, res){ //Make sure user is logged in before callback is executed
    var userID = req.user.local.email; // Know exactly which user you are dealing with
    res.send("sbvksjd")
    app.listen(8080);
    console.log("App running at http://localhost:8080/login.html")


});

console.log("Simple static server listening at http://" + hostname + ":" + port);
app.listen(port);
function isLoggedIn(req, res, next) {
    if (req.isAuthenticated())
        return next();

    res.send('noauth');
}
