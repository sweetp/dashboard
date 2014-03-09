'use strict';

angular.module('dashboardApp')
    .directive('spGitStagingAreaWidget', function() {
    return {
        restrict: 'E',
		scope: {
			project: '='
		},
        templateUrl: 'templates/spGitStagingAreaWidget.html',
		controller: function ($scope, $log, Sweetp) {
			$scope.errors = null;
			$scope.reload = function () {
				$scope.stagingText = '';
				Sweetp.callService($scope.project.name, 'scm/status', null, function (err, data, status)  {
					if (err) {
						$scope.errors = [
							err,
							"Service message: " + data.service
						];
						$log.error(err, data, status);
					}

					// remove first line, branch name info isn't necessary here
					$scope.stagingText = data.service.split("\n").slice(1).join("\n");
					$scope.$emit('widgetLoaded');
				});
			};

			$scope.$on('reloadWidget', $scope.reload);
			$scope.reload();
		}
    };
});


