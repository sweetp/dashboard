'use strict';

angular.module('dashboardApp', ['ngRoute'])
  .config(function ($routeProvider) {
    $routeProvider
      .when('/project/:name', {
        templateUrl: 'views/project.html',
        controller: 'ProjectMainCtrl'
      })
      .when('/overview', {
        templateUrl: 'views/overview.html',
        controller: 'OverviewCtrl'
      })
      .otherwise({
        redirectTo: '/overview'
      });
  });
