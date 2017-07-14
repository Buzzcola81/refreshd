'use strict';

/**
 * @ngdoc function
 * @name websiteApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the websiteApp
 */
angular.module('websiteApp')
  .controller('ReminderCtrl', ['$scope', '$rootScope', '$location', 'awsFactory', '$filter', '$window', function ($scope, $rootScope, $location, awsFactory, $filter, $window) {
    $scope.data = {};
    //Models
    $scope.data.aws = awsFactory.data;
    $scope.data.frequencies = [
      {
        label: 'Daily'
      },
      {
        label: 'Weekly'
      },
      {
        label: 'Monthly'
      },
      {
        label: 'Yearly'
      },
      {
        label: 'Once'
      }
    ];
    $scope.data.days = [
      {
        numeric: 0x1,
        label: '1st'
      },
      {
        numeric: 0x2,
        label: '2nd'
      },
      {
        numeric: 0x3,
        label: '3rd'
      },
      {
        numeric: 0x4,
        label: '4th'
      },
      {
        numeric: 0x5,
        label: '5th'
      },
      {
        numeric: 0x6,
        label: '6th'
      },
      {
        numeric: 0x7,
        label: '7th'
      },
      {
        numeric: 0x8,
        label: '8th'
      },
      {
        numeric: 0x9,
        label: '9th'
      },
      {
        numeric: 10,
        label: '10th'
      },
      {
        numeric: 11,
        label: '11th'
      },
      {
        numeric: 12,
        label: '12th'
      },
      {
        numeric: 13,
        label: '13th'
      },
      {
        numeric: 14,
        label: '14th'
      },
      {
        numeric: 15,
        label: '15th'
      },
      {
        numeric: 16,
        label: '16th'
      },
      {
        numeric: 17,
        label: '17th'
      },
      {
        numeric: 18,
        label: '18th'
      },
      {
        numeric: 19,
        label: '19th'
      },
      {
        numeric: 20,
        label: '20th'
      },
      {
        numeric: 21,
        label: '21st'
      },
      {
        numeric: 22,
        label: '22nd'
      },
      {
        numeric: 23,
        label: '23rd'
      },
      {
        numeric: 24,
        label: '24th'
      },
      {
        numeric: 25,
        label: '25th'
      },
      {
        numeric: 26,
        label: '26th'
      },
      {
        numeric: 27,
        label: '27th'
      },
      {
        numeric: 28,
        label: '28th'
      },
      {
        numeric: 29,
        label: '29th'
      },
      {
        numeric: 30,
        label: '30th'
      },
      {
        numeric: 31,
        label: '31st'
      }
    ];
    $scope.data.months = [
      {
        numeric: 0x1,
        label: 'January'
      },
      {
        numeric: 0x2,
        label: 'February'
      },
      {
        numeric: 0x3,
        label: 'March'
      },
      {
        numeric: 0x4,
        label: 'April'
      },
      {
        numeric: 0x5,
        label: 'May'
      },
      {
        numeric: 0x6,
        label: 'June'
      },
      {
        numeric: 0x7,
        label: 'July'
      },
      {
        numeric: 0x8,
        label: 'August'
      },
      {
        numeric: 0x9,
        label: 'September'
      },
      {
        numeric: 10,
        label: 'October'
      },
      {
        numeric: 11,
        label: 'November'
      },
      {
        numeric: 12,
        label: 'December'
      }
    ];
    $scope.data.years = [
      {
        numeric: 2017,
        label: '2017'
      },
      {
        numeric: 2018,
        label: '2018'
      },
      {
        numeric: 2019,
        label: '2019'
      },
      {
        numeric: 2020,
        label: '2020'
      }
    ];
    //Set defaults
    $scope.data.day = $scope.data.days[0];
    $scope.data.month = $scope.data.months[0];
    $scope.data.year = $scope.data.years[0];
    $scope.data.frequency = $scope.data.frequencies[0];
    $scope.data.patient = $scope.data.aws.patients[0];
    $scope.data.hours = '13';
    $scope.data.minutes = '30';
    $scope.putReminder = function () {
      console.log('putReminder');
      console.log($scope.data);
      const x = $window.moment();
      x.hours($scope.data.hours);
      x.minutes($scope.data.minutes);
      const time = x.tz($window.moment.tz.guess()).utc().format('HHmm');
      console.log($scope.data.patient);
      switch ($scope.data.frequency.label) {
        case 'Daily': awsFactory.putReminder(time, 'daily', $scope.data.patient.phoneNumber.S, $scope.data.message); break;
        case 'Weekly':
          var weekdays = ($scope.data.mon ? 'mon,': '') + ($scope.data.tue ? 'tue,': '') + ($scope.data.wed ? 'wed,': '') + ($scope.data.thu ? 'thu,': '') + ($scope.data.fri ? 'fri,': '') + ($scope.data.sat ? 'sat,': '') + ($scope.data.sun ? 'sun,': '')
          weekdays = weekdays.replace(/,$/,'')
          awsFactory.putReminder(time, weekdays, $scope.data.patient.phoneNumber.S, $scope.data.message); break;
        case 'Monthly': awsFactory.putReminder(time, $scope.data.day.numeric, $scope.data.patient.phoneNumber.S, $scope.data.message); break;
        case 'Yearly': awsFactory.putReminder(time, $scope.data.day.numeric.toString() + '/' + $scope.data.month.numeric.toString(), $scope.data.patient.phoneNumber.S, $scope.data.message); break;
        case 'Once': awsFactory.putReminder(time, $scope.data.day.numeric.toString() + '/' + $scope.data.month.numeric.toString() + '/' + $scope.data.year.numeric.toString(), $scope.data.patient.phoneNumber.S, $scope.data.message); break;
        default: console.log('Unsupported frequency');
      }
      $location.url('/reminders');
    };
  }]);
