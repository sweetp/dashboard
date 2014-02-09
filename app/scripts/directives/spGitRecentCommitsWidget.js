'use strict';

angular.module('dashboardApp')
    .directive('spGitRecentCommitsWidget', function() {
    return {
        restrict: 'E',
		scope: {
			project: '='
		},
		controller: function ($scope, $log, Sweetp) {
			$scope.errors = null;
			$scope.reload = function () {
				$scope.log = [];
				Sweetp.callService($scope.project.name, 'scm/log', null, function (err, data, status)  {
					if (err) {
						$scope.errors = [
							err,
							"Service message: " + data.service
						];
						$log.error(err, data, status);
					}

					$scope.log = _.take(data.service, 5).map(function(entry) {
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


