'use strict';

/**
 * @ngdoc function
 * @name websiteApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the websiteApp
 */
angular.module('websiteApp')
  .factory('facebookFactory', ['$window', '$location', '$rootScope', 'awsFactory', function ($window, $location, $rootScope, awsFactory) {
    var factory = {};
    factory.data = {};
    factory.login = function () {
      FB.login(function (response) {
        console.log('login');
        if (response.authResponse) {
          console.log('Welcome!  Fetching your information.... ');
          factory.setLoggedIn(response.authResponse.accessToken);
          $location.url('/home');
        } else {
          console.log('User cancelled login or did not fully authorize.');
          factory.setLoggedOut();
        }
      });
    };
    factory.logout = function () {
      console.log('logout');
      FB.logout(function (response) {
        $rootScope.$apply(function () {
          factory.data.isLoggedIn = false;
        });
      });
    };
    factory.getFirstName = function () {
      FB.api('/me', {fields: 'first_name'}, function (response) {
        $rootScope.$apply(function () {
          factory.data.firstName = response['first_name'];
          factory.data.id = response['id'];
        });
      });
    };
    factory.setLoggedIn = function (authToken) {
      console.log('setLoggedIn');
      factory.data.isLoggedIn = true;
      factory.getFirstName();
      awsFactory.setCredentialsWithFacebook(authToken);
    };
    factory.setLoggedOut = function () {
      console.log('setLoggedOut');
      factory.data.isLoggedIn = false;
    };
    factory.isLoggedIn = function () {
      console.log('isLoggedIn');
      FB.getLoginStatus(function (response) {
        if (response.status === 'connected') {
          $rootScope.$apply(function () {
            factory.setLoggedIn(response.authResponse.accessToken);
          });
        } else {
          $rootScope.$apply(function () {
            factory.setLoggedOut();
          });
        }
      });
    };
    return factory;
  }]);
