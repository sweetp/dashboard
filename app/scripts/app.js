'use strict';

angular.module('dashboardApp', [])
  .config(function ($routeProvider) {
    $routeProvider
      .when('/overview', {
        templateUrl: 'views/main.html',
        controller: 'MainCtrl'
      })
      .otherwise({
        redirectTo: '/overview'
      });
  });
