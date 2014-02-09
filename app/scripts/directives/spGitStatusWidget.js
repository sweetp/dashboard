'use strict';

angular.module('dashboardApp')
    .directive('spGitStatusWidget', function() {
    return {
        restrict: 'E',
		scope: {
			project: '='
		},
        templateUrl: 'templates/spGitStatusWidget.html',
		controller: function ($scope, $log, Sweetp) {
			$scope.errors = null;
			$scope.reload = function () {
				$scope.branchName = '';
				Sweetp.callService($scope.project.name, 'scm/branch/name', null, function (err, data, status)  {
					if (err) {
						$scope.errors = [
							err,
							"Service message: " + data.service
						];
						$log.error(err, data, status);
					}

					$scope.branchName = data.service;
					$scope.$emit('widgetLoaded');
				});
			};

			$scope.$on('reloadWidget', $scope.reload);
			$scope.reload();
		}
    };
});

