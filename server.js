var express = require("express");
var logger = require("morgan");
var mongoose = require("mongoose");

// Our scraping tools
// Axios is a promised-based http library, similar to jQuery's Ajax method
// It works on the client and on the server
var axios = require("axios");
var cheerio = require("cheerio");

// Require all models
var db = require("./models");

var PORT = 3000;

// Initialize Express
var app = express();

// Configure middleware

// Use morgan logger for logging requests
app.use(logger("dev"));
// Parse request body as JSON
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
// Make public a static folder
app.use(express.static("public"));

// Connect to the Mongo DB
mongoose.connect("mongodb://localhost/unit18Populater", { useNewUrlParser: true });

// TODO: make two more routes

// Route 1
// =======
// This route will retrieve all of the data
// from the scrapedData collection as a json (this will be populated
// by the data you scrape using the next route)
app.get("/", function(req, res) {
  // Query: In our database, go to the animals collection, then "find" everything
  db.scrapedData.find({}, function(err, data) {
    // Log any errors if the server encounters one
    if (err) {
      console.log(err);
    }
    else {
      // Otherwise, send the result of this query to the browser
      res.json(data);
    }
  });
});

// Route 2
// =======
// When you visit this route, the server will
// scrape data from the site of your choice, and save it to
// MongoDB.
// TIP: Think back to how you pushed website data
// into an empty array in the last class. How do you
// push it into a MongoDB collection instead?

app.get('/scrape', function(req, res){

  axios.get("https://www.liquor.com/").then(function(response) {
    var $ = cheerio.load(response.data);
    
    $(".post").each(function (i, element) {
      var result = {}
    //   var title = $(element).find('.overlay').toString().split('/')[2].replace(/-/g, ' ').replace(/\b[a-z]/g, function(chr){
    //       return chr.toUpperCase();
    //   });
    //   var link = $(element).find('a').attr("href");
    //   toString().split('(')[1].split(')')[0].replace(/&apos;/g,"");
    result.title = $(element).find('h3').text().replace(/\s/g,'').replace('Drinks&Spirits', "").replace(/([a-z])([A-Z])/g, '$1 $2');
    // .replace(/\/n/g, "").replace(/\/t/g, "");
    result.link = $(element).find('a').attr("href");
    result.image = $(element).find('.post-thumb > img').attr('src');
      
      // Save these results in an object that we'll push into the results array we defined earlier
      db.Article.create(result).then(function(dbArticle){
        console.log(dbArticle)
      }).catch(function(err){
        console.log(err)
      })
    /* -/-/-/-/-/-/-/-/-/-/-/-/- */
    res.send('Scrape complete');
  });
});
});
  
app.get("/articles/:id", function(req, res) {
  db.Article.find({_id: req.params.id})
  .populate('note')
  .then(function(article){
    res.json(article)
  }).catch(function(err){
    res.json(err)
  })
});

app.post("/articles/:id", function(req, res) {
  db.Note.create(req.body).then(function(note){
    return db.Article.findOneAndUpdate({_id: (req.params.id)}, {$set: {note: note._id}}, {new: true});
  }).then(function(dbArticle){
    res.json(dbArticle);
  }).catch(function(err){
    res.json(err);
  });
});


// Listen on port 3000
app.listen(3000, function () {
});
console.log("App running on port 3000!");