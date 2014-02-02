'use strict';

angular.module('dashboardApp')
    .controller('ProjectMainCtrl', function($scope, $route, $routeParams, Sweetp) {
		var projectName, finishWidget;

		projectName = $routeParams.name;
		$scope.widgetsLoaded = false;
		$scope.counter = 0;
		$scope.widgetCount = 2;

		if (Sweetp.isProjectLoaded(projectName)) {
			$scope.project = Sweetp.getProjectConfig(projectName);
		} else {
			Sweetp.loadProjects(function () {
				$scope.project = Sweetp.getProjectConfig(projectName);
			});
		}

		finishWidget = function () {
			$scope.counter++;

			if ($scope.counter >= $scope.widgetCount) {
				$scope.widgetsLoaded = true;
			}
		};

		$scope.refresh = function () {
			$scope.widgetsLoaded = false;
			$scope.counter = 2;

			$scope.widgetsLoaded = true;
			$scope.$broadcast('reloadWidget');
		};
});
