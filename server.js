// Include Server Dependencies
const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const logger = require("morgan");

//Require Schemas
var Article = require('./models/Article.js');

const app = express();
const PORT = process.env.PORT || 3000;

// Run Morgan for Logging
app.use(logger('dev'));

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

// Route to get all saved articles
app.get('/api/saved', function(req, res) {

});

// Start the API server
app.listen(PORT, function() {
  console.log(`🌎  ==> API Server now listening on PORT ${PORT}!`);
});