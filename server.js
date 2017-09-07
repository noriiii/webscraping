/* Students: Using the tools and techniques you learned so far,
 * you will scrape a website of your choice, then place the data
 * in a MongoDB database. Be sure to make the database and collection
 * before running this exercise.

 * Consult the assignment files from earlier in class
 * if you need a refresher on Cheerio. */

// Dependencies
var express = require("express");
var exHandlebars = require("express-handlebars");
var mongoose = require("mongoose");
var mongojs = require("mongojs");
var bodyParser = require("body-parser");
var cheerio = require("cheerio");
var request = require("request");

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

// Main route (simple Hello World Message)
app.get("/", function(req, res) {
  res.send("This site works");
});


/* -/-/-/-/-/-/-/-/-/-/-/-/- */
app.get("/scrape", function(req, res) {
// Make a request call to grab the HTML body from the site of your choice
request("http://www.huffingtonpost.com/", function(error, response, html) {
console.log(html);

// $
  var $ = cheerio.load(html);

  // Headline

  $("h2.card__splash-title.bn-clickable").each(function(i, element) {
    
    var title = $(element).text();
    var summary = $(element).text()
    var link = $(element).parent().attr("href");


    db.scrapedData.insert({ title: title, summary: summary, link: link });

    res.send("Scraping is done");

   });

  });

});

app.get("/all", function(req, res) {
  // Query: In our database, go to the animals collection, then "find" everything
  db.scrapedData.find({}, function(error, found) {
    // Log any errors if the server encounters one
    if (error) {
      console.log(error);
    }
    // Otherwise, send the result of this query to the browser
    else {
      res.json(found);
    }
  });
});

// Listen on port 3000
app.listen(3000, function() {
  console.log("App running on port 3000!");
});

