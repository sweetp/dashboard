'use strict';

angular.module('dashboardApp')
    .controller('ProjectMainCtrl', function($scope, $route, $routeParams, Sweetp) {
		var projectName;

		projectName = $routeParams.name;

		if (Sweetp.isProjectLoaded(projectName)) {
			$scope.project = Sweetp.getProjectConfig(projectName);
		} else {
			Sweetp.loadProjects(function () {
				$scope.project = Sweetp.getProjectConfig(projectName);
			});
		}
});
