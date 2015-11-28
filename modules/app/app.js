'use strict';

/* App Module */

var sportApp = angular.module('sportApp', [
  'angular.filter',
  'ngRoute',
  'sportAnimations',
  'sportControllers',
  'sportFilters',
  'sportServices'
]);

sportApp.config(['$routeProvider',
  function($routeProvider) {
    $routeProvider.
      when('/sports', {
        templateUrl: 'modules/app/app.html',
        controller: 'SportCtrl'
      }).
      otherwise({
        redirectTo: '/sports'
      });
  }]);
