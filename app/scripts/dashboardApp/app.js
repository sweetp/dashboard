'use strict';

angular.module('dashboardApp', ['ngRoute', 'keyboardShortcuts'])
	.config(function ($routeProvider) {
		$routeProvider
			.when('/project/:name', {
				templateUrl: 'scripts/dashboardApp/views/project/project.view.html',
				controller: 'ProjectMainCtrl'
			})
			.when('/overview', {
				templateUrl: 'scripts/dashboardApp/views/overview/overview.view.html',
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
