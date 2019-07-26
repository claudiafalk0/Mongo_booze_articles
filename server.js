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
var MONGODB_URI = process.env.MONGODB_URI || "mongodb://user:password1@ds255577.mlab.com:55577/heroku_xccmw7jn";

mongoose.connect(MONGODB_URI);

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
        // result.title = $(element).find('.tile-content').innerText;
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
  
  app.get("/articles", function(req, res) {
    db.Article.find().then(function(data){
      res.json(data);
    }).catch(function(err){
      res.json(err);
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
app.listen(process.env.PORT, '0.0.0.0.0', function (err) {
  if (err) throw err;
});
console.log("App running on port: " + PORT + "!");