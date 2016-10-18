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
    $scope.currentName;

    console.log('in CONTROLLER', window.command);

    $scope.searchOne = function () {
      $scope.searchResults = [];
      $scope.avg = 0;
      Search.addOne({location: $scope.mainLocation, term: $scope.mainName})
      .then(function (val) {
        //TODO: do something with val
        setTimeout(function () {
          Search.getAll()
          .then(function (result) {
            result.forEach(function (val) {
              $scope.avg+= val.rating;
              $scope.currentName = val.name;
              $scope.searchResults.push(val);
            });
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
