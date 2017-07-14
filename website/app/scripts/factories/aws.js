'use strict';

/**
 * @ngdoc function
 * @name websiteApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the websiteApp
 */
angular.module('websiteApp')
  .factory('awsFactory', ['$window', '$location', '$rootScope', 'identityPoolId', function ($window, $location, $rootScope, identityPoolId) {
    const factory = {};
    factory.data = {
      patients: {},
      reminders: {},
      contacts: {}
    };
    factory.setCredentialsWithFacebook = function (accessToken) {
      console.log('setCredentialsWithFacebook');
      AWS.config.region = 'us-east-1'; // Region
      // Add the Facebook access token to the Cognito credentials login map.
      AWS.config.credentials = new AWS.CognitoIdentityCredentials({
        IdentityPoolId: identityPoolId,
        Logins: {
          'graph.facebook.com': accessToken
        }
      });
      // Obtain AWS credentials
      AWS.config.credentials.get(function () {
        factory.setCognitoCredentials(AWS.config.credentials.identityId);
      });
    };
    factory.setCognitoCredentials = function (id) {
      factory.data.cognitoId = id;
      factory.data.hasCredentials = true;
      factory.getPatients();
      factory.getReminders();
      factory.getContacts();
    };
    factory.getPatients = function () {
      console.log('getPatients');
      const dynamodb = new AWS.DynamoDB();
      const params = {
        ExpressionAttributeValues: {
          ':v1': {
            S: factory.data.cognitoId
          }
        },
        KeyConditionExpression: 'cognitoId = :v1',
        TableName: 'patients'
      };
      dynamodb.query(params, function (err, data) {
        if (err) {
          console.log(err, err.stack);
        } else {
          $rootScope.$apply(function () {
            factory.data.patients = data.Items;
          });
        }
      });
    };
    factory.putPatient = function (patientName, phoneNumber) {
      console.log('putPatient');
      const dynamodb = new AWS.DynamoDB();
      const params = {
        Item: {
          cognitoId: {
            S: factory.data.cognitoId
          },
          sortKey: {
            S: '+61' + phoneNumber
          },
          patientName: {
            S: patientName
          },
          phoneNumber: {
            S: '+61' + phoneNumber
          }
        },
        TableName: 'patients'
      };
      dynamodb.putItem(params, function (err, data) {
        if (err) {
          console.log(err, err.stack);
        } else {
          $rootScope.$apply(function () {
            factory.getPatients();
          });
        }
      });
    };
    factory.getReminders = function () {
      console.log('getReminders');
      const dynamodb = new AWS.DynamoDB();
      const params = {
        ExpressionAttributeValues: {
          ':v1': {
            S: factory.data.cognitoId
          }
        },
        KeyConditionExpression: 'cognitoId = :v1',
        TableName: 'reminders'
      };
      dynamodb.query(params, function (err, data) {
        if (err) {
          console.log(err, err.stack);
        } else {
          $rootScope.$apply(function () {
            factory.data.reminders = data.Items;
          });
        }
      });
    };
    factory.putReminder = function (time, frequency, telephone, message) {
      console.log('putReminder');
      const dynamodb = new AWS.DynamoDB();
      const params = {
        Item: {
          'cognitoId': {
            S: factory.data.cognitoId
          },
          'sortKey': {
            S: telephone + frequency + time
          },
          'remindTime': {
            S: time
          },
          'telephone': {
            S: telephone
          },
          'frequency': {
            S: frequency.toString()
          },
          'message': {
            S: message
          }
        },
        TableName: 'reminders'
      };
      dynamodb.putItem(params, function (err, data) {
        if (err) {
          console.log(err, err.stack);
        } else {
          $rootScope.$apply(function () {
            factory.getReminders();
          });
        }
      });
    };
    factory.getContacts = function () {
      console.log('getContacts');
      const dynamodb = new AWS.DynamoDB();
      const params = {
        ExpressionAttributeValues: {
          ':v1': {
            S: factory.data.cognitoId
          }
        },
        KeyConditionExpression: 'cognitoId = :v1',
        TableName: 'contacts'
      };
      dynamodb.query(params, function (err, data) {
        if (err) {
          console.log(err, err.stack);
        } else {
          $rootScope.$apply(function () {
            factory.data.contacts = data.Items;
          });
        }
      });
    };
    factory.putContact = function (patientId, contactName, contactTel) {
      console.log('putContact');
      const dynamodb = new AWS.DynamoDB();
      const params = {
        Item: {
          'cognitoId': {
            S: factory.data.cognitoId
          },
          'sortKey': {
            S: contactTel
          },
          'patientId': {
            S: patientId
          },
          'contactName': {
            S: contactName
          },
          'contactTel': {
            S: contactTel
          }
        },
        TableName: 'contacts'
      };
      dynamodb.putItem(params, function (err, data) {
        if (err) {
          console.log(err, err.stack);
        } else {
          $rootScope.$apply(function () {
            factory.getContacts();
          });
        }
      });
    };
    return factory;
  }]);
