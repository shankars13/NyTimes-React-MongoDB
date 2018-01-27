// Include Server Dependencies
const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

//Require Schemas
var Article = require('./models/Article.js');

const app = express();
const PORT = process.env.PORT || 3000;


// Configure body parser for AJAX requests
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.text());
app.use(bodyParser.json({type:'application/vnd.api+json'}));

// Serve up static assets
app.use(express.static("./public"));

// Connect to the Mongo DB
mongoose.connect('mongodb://localhost/nytreact');

var db = mongoose.connection;

db.on('error', function(err) {
	console.log('Mongoose Error :',err);
});


db.once('open', function() {
	console.log('Mongoose connection successful ');
});

// Main Route
app.get('/', function(req, res) {
	res.sendFile('./public/index.html');
});


app.get('/api/saved', function(req, res) {

  Article.find({})
    .exec(function(err, doc){

      if(err){
        console.log(err);
      }
      else {
        res.send(doc);
      }
    })
});

app.post('/api/saved', function(req, res){
  var newArticle = new Article(req.body);

  var title = req.body.title;
  var date = req.body.date;
  var url = req.body.url;

  newArticle.save(function(err, doc){
    if(err){
      console.log(err);
    } else {
      res.send(doc._id);
    }
  });
});

app.delete('/api/saved/', function(req, res){

  var url = req.param('url');

  Article.find({"url": url}).remove().exec(function(err, data){
    if(err){
      console.log(err);
    }
    else {
      res.send("Deleted");
    }
  });
});

// Start the API server
app.listen(PORT, function() {
  console.log(`🌎  ==> API Server now listening on PORT ${PORT}!`);
});