// Dependencies
var express = require("express");
var bodyParser = require("body-parser");
var logger = require("morgan");
var mongoose = require("mongoose");
var Promise = require("bluebird");

//Require Schemas
var News = require("./models/news.js");

var PORT = process.env.PORT || 3000;
var app = express();
process.env.NODE_ENV = 'production';

// Configure body parser for AJAX requests
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.text());
app.use(bodyParser.json({ type: 'application/vnd.api+json' }));

// Serve up static assets
app.use(express.static("public"));

// MongoDB connection
mongoose.Promise = Promise;
if (process.env.NODE_ENV === 'production') {
    console.log('node env is', process.env.NODE_ENV);
    mongoose.connect('mongodb://heroku_vmk2r7pq:rgjvgjududnj659r8kt954ldg1@ds145790.mlab.com:45790/heroku_vmk2r7pq');
} else {
    console.log('node env is', process.env.NODE_ENV);
    mongoose.connect('mongodb://localhost/nyt-search');
}
var db = mongoose.connection;
db.on("error", function (error) { console.log("Mongoose Error: ", error); });
db.once("open", function () { console.log("Mongoose connection successful."); });

// Start the API server
app.listen(PORT, function () {
    console.log('🌎  ==> API Server now listening on PORT ' + PORT);
});

// Routes for get and post
app.get("/", function (req, res) {
    res.sendFile(__dirname + "/public/index.html");
});

app.get("/saved-articles", function (req, res) {
    News.find({}).sort({ "title": 1 }).exec(function (error, doc) {
        if (error) {
            res.send(error);
        } else {
            res.json(doc);
        }
    });
});

app.post("/save-article", function (req, res) {
    var newArticle = new News(req.body);
    newArticle.save(function (error, doc) {
        if (error) {
            res.send(error);
        } else {
            res.json(doc._id);
        }
    });
});

app.delete("/delete-article", function (req, res) {
    var deleteID = req.param("id");
    News.findByIdAndRemove(deleteID, function (err, data) {
        if (err) {
            res.send(err);
        } else {
            res.json(data);
        }
    });
});

