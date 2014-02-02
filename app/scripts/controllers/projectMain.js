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

/*
 *            $scope.log = [];
 *            Sweetp.callService($scope.project.name, 'scm/log', null, function (err, data)  {
 *                if (err) {
 *                    // TODO handle error
 *                    throw new Error(err);
 *                }
 *
 *                $scope.log = _.take(data.service, 5).map(function(entry) {
 *                    entry.shortName = entry.name.substr(0, 5);
 *                    entry.shortMessage = entry.shortMessage.trim();
 *                    return entry;
 *                });
 *                finishWidget();
 *            });
 */
		};
		$scope.refresh();
});
