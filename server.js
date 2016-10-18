var express = require('express');
var mongoose = require('mongoose');
var morgan = require('morgan');
var bodyParser = require('body-parser');
var Yelp = require('yelp');
var request = require('request');
var keys = require('./server/envir/serverConfig.js');
var path = require('path');
var app = express();
app.set('port', 4568);
// var picController = require('./server/pictures/picController.js');


//MONGO CONNECTION
mongoose.connect('mongodb://localhost/goolp');


//MIDDLEWARE
app.use(morgan('dev'));
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use('/', express.static(path.join(__dirname, 'client')));


var resultsArr = [];

//YELP
// var yelp = new Yelp({
//   consumer_key: keys.consumer_key,
//   consumer_secret: keys.consumer_secret,
//   token: keys.token,
//   token_secret: keys.token_secret
// });

//

app.post('/search', function (req, res) {
  resultsArr = [];
  var results = yelpSearch(req.body.location, req.body.term);
  res.status(200).send('got HEEM');
});

function yelpSearch (loc, name) {
  var searchQuery = "" + name + ' ' +  loc;
  var modifiedQuery = searchQuery.split(' ').join('+');

  yelp.search({ term: name, location: loc, limit: 1})
  .then(function (data) {
    data.businesses.forEach(function (value) {
      resultsArr.push({name: value.name, rating: value.rating, totalReviews: value.review_count});
    });
  })
  .catch(function (err) {
    console.error(err);
  });

  request('https://maps.googleapis.com/maps/api/place/textsearch/json?query=' + modifiedQuery + '&key=' + keys.googleKey, function (error, response, body) {
    if (!error && response.statusCode === 200) {
      var data = JSON.parse(body);
      resultsArr.push({name: data.results[0].name, rating: data.results[0].rating});
    } else {
      console.error(error);
    }
  });
}

app.get('/results', function (req, res) {
  console.log('in GET RESULTS', resultsArr);
  res.status(200).send(resultsArr);
});


// start listening to requests on port 8000
console.log('goolp is listening on 4568');
app.listen(4568);

// export our app for testing and flexibility, required by index.js
module.exports = app;

