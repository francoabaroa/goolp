angular.module('goolp', [])
  .factory('Search', function ($http) {
    return {
      addOne: function (searchQ) {
        return $http({
          method: 'POST',
          url: '/search',
          data: {location: searchQ.location, term: searchQ.term}
        }).then(function (resp) {
          return resp.data;
        })
        .catch(function (err) {
          return err;
        });
      },
      getAll: function () {
        return $http({
          method: 'GET',
          url: '/results'
        })
        .then(function (resp) {
          return resp.data;
        });
      }
    };
  })
  .controller('mainController', function ($scope, Search) {
    $scope.searchResults = [];
    $scope.avg = 0;


    //VOICE SEARCH
    if (annyang) {
      var commands = {
        'hello': function() { alert('Hello world!'); }
      };

      annyang.addCallback('result', function(phrases) {
        $scope.phrase = phrases[0];
        $scope.phrase = $scope.phrase.split(' ');
        $scope.index = $scope.phrase.indexOf('in');
        $scope.phrase.splice($scope.index, 1);
        $scope.mainName = $scope.phrase.slice(0, $scope.index);
        $scope.mainLocation = $scope.phrase.slice($scope.index);
        $scope.mainName = $scope.mainName.join(' ');
        $scope.mainLocation = $scope.mainLocation.join(' ');
        $scope.searchOne();
      });

      annyang.addCommands(commands);
      annyang.start();
    }

    //TEXT SEARCH
    $scope.searchOne = function () {
      $scope.searchResults = [];
      $scope.avg = 0;

      Search.addOne({location: $scope.mainLocation, term: $scope.mainName})
      .then(function (val) {
        setTimeout(function () {
          Search.getAll()
          .then(function (result) {
            result.forEach(function (val) {
              $scope.avg+= val.rating;
              $scope.searchResults.push(val);
            });

            $scope.rating = 'Goolp Rating: '
            $scope.ratingAvg = ($scope.avg / 2);
          })
          .catch(function (err) {
            console.error(err);
          });
        }, 2000);
      })
      .catch(function (err) {
        console.error(err);
      });
    };
  });
