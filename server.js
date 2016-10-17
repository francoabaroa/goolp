var express = require('express');
var mongoose = require('mongoose');
var morgan = require('morgan');
var bodyParser = require('body-parser');
var Yelp = require('yelp');
var keys = require('./server/envir/serverConfig.js');
// var picController = require('./server/pictures/picController.js');
var path = require('path');
var app = express();
app.set('port', 4568);

//MONGO CONNECTION
mongoose.connect('mongodb://localhost/goolp');

//MIDDLEWARE
app.use(morgan('dev'));
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use('/', express.static(path.join(__dirname, 'client')));

//YELP

// var yelp = new Yelp({
//   consumer_key: keys.consumer_key,
//   consumer_secret: keys.consumer_secret,
//   token: keys.token,
//   token_secret: keys.token_secret
// });

var nameArrr = [];


app.post('/search', function (req, res) {
  console.log(req.body);
  console.log(req.body.location, req.body.term, 'in SEARCH POST');
});

function yelpSearch (loc, nam) {
  yelp.search({ term: 'Asian', location: 'San Francisco', limit: 10, sort: 2})
  .then(function (data) {
    // console.log('IN DATA', data.businesses);
    data.businesses.forEach(function (value) {
      nameArrr.push({name: value.name, rating: value.rating, totalReviews: value.review_count});
    });
    console.log(nameArrr);
  })
  .catch(function (err) {
    console.error(err);
  });
}

// app.post('/pics', picController.newPic);
// app.get('/pics', picController.getAllPics);

// start listening to requests on port 8000
console.log('goolp is listening on 4568');
app.listen(4568);

// export our app for testing and flexibility, required by index.js
module.exports = app;

