'use strict';

/**
 * @ngdoc function
 * @name websiteApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the websiteApp
 */
angular.module('websiteApp')
  .controller('PatientCtrl', ['$scope', '$location', 'facebookFactory', '$rootScope', 'awsFactory', function ($scope, $location, facebookFactory, $rootScope, awsFactory) {
    $scope.data = {};
    $scope.putPatient = function() {
      console.log('putPatient', awsFactory.data.cognitoId);
      awsFactory.putPatient($scope.data.firstName, $scope.data.tel);
      $location.url('/patients');
    }
  }]);
