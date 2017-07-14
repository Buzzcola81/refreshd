'use strict';

/**
 * @ngdoc overview
 * @name websiteApp
 * @description
 * # websiteApp
 *
 * Main module of the application.
 */
angular
  .module('websiteApp', [
    'ngAnimate',
    'ngCookies',
    'ngResource',
    'ngRoute',
    'ngSanitize',
    'ngTouch'
  ])
  //PROD
  //.constant('appId', '306254296486337')
  //.constant('identityPoolId', 'us-east-1:xxxxxxx')
  //DEV
  .constant('appId', '1957280111169474')
  .constant('identityPoolId', 'us-east-1:xxxxxxx')
  .run(['facebookFactory', '$window', 'appId',
  function(facebookFactory, $window, appId) {

    $window.fbAsyncInit = function() {
      // Executed when the SDK is loaded

      FB.init({

        /*
         The app id of the web app;
         To register a new app visit Facebook App Dashboard
         ( https://developers.facebook.com/apps/ )
         */

        //DEV
        //appId: appId,

        //PROD
        appId: appId,

        /*
         Adding a Channel File improves the performance
         of the javascript SDK, by addressing issues
         with cross-domain communication in certain browsers.
         */

        channelUrl: 'app/channel.html',

        /*
         Set if you want to check the authentication status
         at the start up of the app
         */

        status: true,

        /*
         Enable cookies to allow the server to access
         the session
         */

        cookie: true,

        /* Parse XFBML */

        xfbml: true
      });

      facebookFactory.isLoggedIn();

    };

    (function(d){
      // load the Facebook javascript SDK

      var js,
        id = 'facebook-jssdk',
        ref = d.getElementsByTagName('script')[0];

      if (d.getElementById(id)) {
        return;
      }

      js = d.createElement('script');
      js.id = id;
      js.async = true;
      js.src = "//connect.facebook.net/en_US/all.js";

      ref.parentNode.insertBefore(js, ref);

    }(document));

  }])
  .config(['$routeProvider', '$locationProvider', function ($routeProvider, $locationProvider) {
    /*$locationProvider.html5Mode({
      enabled: true,
      requireBase: false
    });*/
    $routeProvider
      .when('/', {
        templateUrl: 'views/main.html',
        controller: 'MainCtrl',
        controllerAs: 'main'
      })
      .when('/home', {
        templateUrl: 'views/home.html',
        controller: 'HomeCtrl',
        controllerAs: 'home'
      })
      .when('/patient', {
        templateUrl: 'views/patient.html',
        controller: 'PatientCtrl',
        controllerAs: 'patient'
      })
      .when('/patients', {
        templateUrl: 'views/patients.html',
        controller: 'PatientsCtrl',
        controllerAs: 'patients'
      })
      .when('/reminder', {
        templateUrl: 'views/reminder.html',
        controller: 'ReminderCtrl',
        controllerAs: 'reminder'
      })
      .when('/reminders', {
        templateUrl: 'views/reminders.html',
        controller: 'RemindersCtrl',
        controllerAs: 'reminders'
      })
      .when('/contact', {
        templateUrl: 'views/contact.html',
        controller: 'ContactCtrl',
        controllerAs: 'contact'
      })
      .when('/contacts', {
        templateUrl: 'views/contacts.html',
        controller: 'ContactsCtrl',
        controllerAs: 'contacts'
      })
      .otherwise({
        redirectTo: '/'
      });
  }]);
