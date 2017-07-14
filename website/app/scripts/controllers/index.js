'use strict';

/**
 * @ngdoc function
 * @name websiteApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the websiteApp
 */
angular.module('websiteApp')
  .controller('IndexCtrl', ['$scope', '$rootScope', 'facebookFactory', '$location', function ($scope, $rootScope, facebookFactory, $location) {
    $scope.data = {
      facebook: facebookFactory.data
    };
    $scope.login = function() {
      facebookFactory.login();
    };
    $scope.logout = function() {
      console.log('Logout');
      facebookFactory.logout();
      $location.url('/');
    }
  }]);
