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
					var lines, lineCount;

					if (err) {
						$scope.errors = [
							err,
							"Service message: " + data.service
						];
						$log.error(err, data, status);
					}

					lines = data.service.split("\n");
					lineCount = lines.length;

					// remove first line, branch name info isn't necessary here
					$scope.stagingText = _(lines).take(lineCount - 1).rest().values().join('\n');
					$scope.$emit('widgetLoaded');
				});
			};

			$scope.$on('reloadWidget', $scope.reload);
			$scope.reload();
		}
    };
});


