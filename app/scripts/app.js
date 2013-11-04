'use strict';

angular.module('dashboardApp', [])
  .config(function ($routeProvider) {
    $routeProvider
      .when('/project/:name', {
        templateUrl: 'views/project.html',
        controller: 'ProjectMainCtrl'
      })
      .when('/overview', {
        templateUrl: 'views/main.html',
        controller: 'MainCtrl'
      })
      .otherwise({
        redirectTo: '/overview'
      });
  });
