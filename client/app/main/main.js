angular.module('goolp', [])
  .factory('Search', function ($http) {
    return {
      addOne: function (searchQ) {
        return $http({
          method: 'POST',
          url: '/search',
          data: {location: searchQ.location, term: searchQ.term}
        }).then(function (resp) {
          console.log(resp.data, 'RESP DATA');
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

    $scope.searchOne = function () {
      $scope.searchResults = [];
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
            $scope.divider = '---';
            console.log(result);
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
