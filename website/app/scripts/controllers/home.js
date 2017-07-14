'use strict';

/**
 * @ngdoc function
 * @name websiteApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the websiteApp
 */
angular.module('websiteApp')
  .controller('HomeCtrl', ['$scope', 'awsFactory', '$location', function ($scope, awsFactory, $location) {
    $scope.data = {};
    $scope.data.aws = awsFactory.data;
    $scope.openPatients = function () {
      if ($scope.data.aws.patients.length === 0) {
        $location.url('/patient');
      } else {
        $location.url('/patients');
      }
    };
    $scope.openReminders = function () {
      if ($scope.data.aws.reminders.length === 0) {
        $location.url('/reminder');
      } else {
        $location.url('/reminders');
      }
    };
    $scope.openContacts = function () {
      if ($scope.data.aws.contacts.length === 0) {
        $location.url('/contact');
      } else {
        $location.url('/contacts');
      }
    }
  }]);
