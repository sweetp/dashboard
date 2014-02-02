'use strict';

angular.module('dashboardApp')
    .controller('ProjectMainCtrl', function($scope, $route, $routeParams, Sweetp) {
		var projectName;

		projectName = $routeParams.name;
		$scope.widgetsLoaded = false;
		$scope.counter = 0;
		$scope.widgetCount = 2;

		$scope.project = Sweetp.getProjectConfig(projectName);
		// TODO reenable when we have this case
		/*
		 *if (Sweetp.isProjectLoaded(projectName)) {
		 *    $scope.project = Sweetp.getProjectConfig(projectName);
		 *} else {
		 *    Sweetp.loadProjects(function () {
		 *        $scope.project = Sweetp.getProjectConfig(projectName);
		 *    });
		 *}
		 */

		$scope.$on('widgetLoaded', function () {
			$scope.counter++;

			if ($scope.counter >= $scope.widgetCount) {
				$scope.widgetsLoaded = true;
			}
		});

		$scope.reload = function () {
			$scope.widgetsLoaded = false;
			$scope.counter = 0;

			$scope.$broadcast('reloadWidget');
		};
});
