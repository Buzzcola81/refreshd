'use strict';

/**
 * @ngdoc function
 * @name websiteApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the websiteApp
 */
angular.module('websiteApp')
  .controller('SignCtrl', function ($scope, facebookFactory) {
    $scope.getMyLastName = function() {
      facebookFactory.getMyLastName()
        .then(function(response) {
            $scope.last_name = response.last_name;
          }
        );
    };
  });
