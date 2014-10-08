'use strict';

angular.module('dashboardApp')
	.directive('spGitStagingAreaWidget', function () {
		return {
			restrict: 'E',
			scope: {
				project: '='
			},
			templateUrl: 'scripts/dashboardApp/widgets/spGitStagingAreaWidget.template.html',
			controller: function ($scope, $log, Sweetp) {
				$scope.state = {
					errors: null,
					stagingText: null
				};

				$scope.reload = function () {
					$scope.state.stagingText = '';
					Sweetp.callService($scope.project.name, 'scm/status', null, function (err, data, status) {
						var lines, lineCount, aheadOfLineIndex;

						if (err) {
							$scope.state.errors = [
								err,
								"Service message: " + data.service
							];
							$log.error(err, data, status);
						}

						lines = data.service.split("\n");

						// don't show this line, we have a beatuifull widget for this
						aheadOfLineIndex = _.findIndex(lines, function (line) {
							return line.match(/Your branch is ahead of/);
						});

						if (aheadOfLineIndex >= 0) {
							lines.splice(aheadOfLineIndex, 2);
						}

						// save line count
						lineCount = lines.length;

						// remove first line, branch name info isn't necessary here
						$scope.state.stagingText = _(lines).take(lineCount - 1).rest().values().join('\n');
						$scope.$emit('widgetLoaded');
					});
				};

				$scope.$on('reloadWidget', $scope.reload);
				$scope.reload();
			}
		};
	});
