'use strict';

angular.module('dashboardApp', ['ngRoute', 'mgo-mousetrap'])
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
	})
    .provider('$exceptionHandler', {
        $get:function ($log) {
            return function(exception, cause) {
                $log.error(exception, cause);
            };
        }
    })
;
