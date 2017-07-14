'use strict';

/**
 * @ngdoc function
 * @name websiteApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the websiteApp
 */
angular.module('websiteApp')
  .controller('PatientsCtrl', ['$scope', '$rootScope', '$location', 'awsFactory', function ($scope, $rootScope, $location, awsFactory) {
    $scope.data = {};
    $scope.data.aws = awsFactory.data;
  }]);
