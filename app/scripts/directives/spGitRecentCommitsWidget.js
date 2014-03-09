'use strict';

angular.module('dashboardApp')
    .directive('spGitRecentCommitsWidget', function() {
    return {
        restrict: 'E',
		scope: {
			project: '=',
			maxCommitCount: '@'
		},
		controller: function ($scope, $log, Sweetp) {
			var params, limit;

			$scope.errors = null;
			params = {};

			if ($scope.maxCommitCount) {
				limit = _.parseInt($scope.maxCommitCount);
				params.limit = limit;
			}

			$scope.reload = function () {
				$scope.log = [];
				Sweetp.callService($scope.project.name, 'scm/log', params, function (err, data, status)  {
					if (err) {
						$scope.errors = [
							err,
							"Service message: " + data.service
						];
						$log.error(err, data, status);
					}

					$scope.log = _.map(data.service, function(entry) {
						entry.shortName = entry.name.substr(0, 5);
						entry.shortMessage = entry.shortMessage.trim();
						return entry;
					});
					$scope.$emit('widgetLoaded');
				});
			};

			$scope.$on('reloadWidget', $scope.reload);
			$scope.reload();
		},
        templateUrl: 'templates/spGitRecentCommitsWidget.html'
    };
});


