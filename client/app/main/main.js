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

    $scope.searchOne = function () {
      $scope.searchResults = [];
      Search.addOne({location: $scope.mainLocation, term: $scope.mainName})
      .then(function (val) {
        //TODO: do something with val
        console.log(val, 'in MAIN CONTROLLER');
        setTimeout(function () {
          Search.getAll()
          .then(function (result) {
            result.forEach(function (val) {
              $scope.searchResults.push(val);
            });
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
