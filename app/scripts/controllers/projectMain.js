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

		$scope.refresh = function () {
			Sweetp.callService($scope.project.name, 'scm/branch/name', null, function (err, data)  {
				if (err) {
					// TODO handle error
					throw new Error(err);
				}

				$scope.branchName = data.service;
			});

			Sweetp.callService($scope.project.name, 'scm/log', null, function (err, data)  {
				if (err) {
					// TODO handle error
					throw new Error(err);
				}

				$scope.log = _.take(data.service, 5).map(function(entry) {
					entry.shortName = entry.name.substr(0, 5);
					entry.shortMessage = entry.shortMessage.trim();
					return entry;
				});
			});
		};
		$scope.refresh();
});
