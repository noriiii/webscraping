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

// $
request("http://www.huffingtonpost.com/", function(error, response, html) {
  var $ = cheerio.load(html);

// Main route (simple Hello World Message)
app.get("/", function(req, res) {
  res.send("Hello world");
});

/* TODO: make two more routes
 * -/-/-/-/-/-/-/-/-/-/-/-/- */

// Route 1
// =======
// This route will retrieve all of the data
// from the scrapedData collection as a json (this will be populated
// by the data you scrape using the next route)

app.get("/all", function(req, res) {
  // Query: In our database, go to the animals collection, then "find" everything
  db.collections.find({}, function(error, found) {
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

// Route 2
// =======
// When you visit this route, the server will
// scrape data from the site of your choice, and save it to
// MongoDB.
// TIP: Think back to how you pushed website data
// into an empty array in the last class. How do you
// push it into a MongoDB collection instead?

/* -/-/-/-/-/-/-/-/-/-/-/-/- */

function displayResults(data) {

// Make a request call to grab the HTML body from the site of your choice
request("http://www.huffingtonpost.com/", function(error, response, html) {
console.log(html);
  // Load the HTML into cheerio and save it to a variable
  // '$' becomes a shorthand for cheerio's selector commands, much like jQuery's '$'


  // An empty array to save the data that we'll scrape
  var results = [];

  // Select each element in the HTML body from which you want information.
  // NOTE: Cheerio selectors function similarly to jQuery's selectors,
  // but be sure to visit the package's npm page to see how it works

  // Headline

  $(".card__splash-title").each(function(i, element) {

    var link = $(element).children().attr("href");
    var title = $(element).children().text();

    // Save these results in an object that we'll push into the results array we defined earlier
    results.push({
      title: title,
      link: link
    });
  });

  // Summary

   $("card__link").each(function(i, element) {

    var link = $(element).children().attr("href");
    var summary = $(element).children().text();

    // Save these results in an object that we'll push into the results array we defined earlier
    results.push({
      summary: summary,
      link: link
    });
  }); 





  // Log the results once you've looped through each of the elements found with cheerio
  console.log(results);
});

}

$.getJSON("/all", function(data) {
  // Call our function to generate a table body
  displayResults(data);


});



// Listen on port 3000
app.listen(3000, function() {
  console.log("App running on port 3000!");
});

});