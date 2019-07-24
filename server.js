var express = require("express");
var mongojs = require("mongojs");
// Require axios and cheerio. This makes the scraping possible
var axios = require("axios");
var cheerio = require("cheerio");

// Initialize Express
var app = express();

// Database configuration
var databaseUrl = "scraper";
var collections = ["scrapedData"];

// Hook mongojs configuration to the db variable
var db = mongojs(databaseUrl, collections);
db.on("error", function(error) {
  console.log("Database Error:", error);
});


// Log the results once you've looped through each of the elements found with cheerio

// Main route (simple Hello World Message)
app.get("/", function(req, res) {
  db.scrapedData.find({}, function(err,data){
      if(err) throw err;
      res.json(data);
  });
});

// TODO: make two more routes

// Route 1
// =======
// This route will retrieve all of the data
// from the scrapedData collection as a json (this will be populated
// by the data you scrape using the next route)
app.get("/all", function(req, res) {
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
$('.carousel').carousel({
    interval: 2000
});

app.get('/scrape', function(req, res){

  axios.get("https://www.liquor.com/").then(function(response) {
    var $ = cheerio.load(response.data);
    
    $(".post").each(function (i, element) {
      
      var title = $(element).find('h3').text();
      var link = $(element).find('a').attr("href");
      var img = $(element).find('.img-responsive');
      
      // Save these results in an object that we'll push into the results array we defined earlier
      db.scrapedData.insert({
        title, 
        link,
        img
      }, function(err, data){
        if (err) throw err;
        console.log(data);
      })
    });
    /* -/-/-/-/-/-/-/-/-/-/-/-/- */
    res.send('Scrape complete');
  });
});
  

// Listen on port 3000
app.listen(3000, function () {
});
console.log("App running on port 3000!");