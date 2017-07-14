'use strict';

/**
 * @ngdoc function
 * @name websiteApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the websiteApp
 */
angular.module('websiteApp')
  .controller('ContactsCtrl', ['$scope', '$rootScope', '$location', 'awsFactory', '$filter', '$window', function ($scope, $rootScope, $location, awsFactory, $filter, $window) {
    $scope.data = {};
    $scope.data.aws = awsFactory.data;
  }]);
