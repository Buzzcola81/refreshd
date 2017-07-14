'use strict';

/**
 * @ngdoc function
 * @name websiteApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the websiteApp
 */
angular.module('websiteApp')
  .controller('ContactCtrl', ['$scope', '$rootScope', '$location', 'awsFactory', function ($scope, $rootScope, $location, awsFactory) {
    $scope.data = {};
    //Models
    $scope.data.aws = awsFactory.data;
    //Defaults
    $scope.data.patient = $scope.data.aws.patients[0];
    $scope.putContact = function () {
      console.log('putContact');
      awsFactory.putContact($scope.data.patient.phoneNumber.S, $scope.data.firstName, $scope.data.tel);
      $location.url('/contacts');
    };
  }]);
