'use strict';

angular.module('dashboardApp')
    .controller('ProjectMainCtrl', function($scope, $route, $routeParams, Sweetp) {
		var projectName, widgetCount, counter;

		projectName = $routeParams.name;
		widgetCount = 2;
		counter = 0;

		// init scope properties
		$scope.widgets = {
			loaded:false
		};

		$scope.project = Sweetp.getProjectConfig(projectName);

		$scope.$on('widgetLoaded', function () {
			counter++;

			if (counter >= widgetCount) {
				$scope.widgets.loaded = true;
			}
		});

		$scope.reload = function () {
			$scope.widgets.loaded = false;
			counter = 0;

			$scope.$broadcast('reloadWidget');
		};

		$scope.openCommitWindow = function () {
			chrome.app.window.create('windowCommit.html', {
				id:'commit',
				bounds: {
					width: 400,
					height: 600
				}
			}, function (appWindow) {
				// reload widgets when window disappear
				appWindow.onClosed.addListener($scope.reload);

				// give window access to this project
				if (!appWindow.contentWindow.sweetpWindowCommunication) {
					appWindow.contentWindow.sweetpWindowCommunication = {};
				}
				appWindow.contentWindow.sweetpWindowCommunication.project = $scope.project;
			});
		};
});
