'use strict';

angular.module('dashboardApp')
    .directive('spdGitStatusWidget', function() {
    return {
        restrict: 'E',
		scope: {
			project: '='
		},
        template: '<spd-widget>Current Branch: {{branchName}}</spd-widget>',
		controller: function ($scope, Sweetp) {
			$scope.reload = function () {
				$scope.branchName = '';
				Sweetp.callService($scope.project.name, 'scm/branch/name', null, function (err, data)  {
					if (err) {
						// TODO handle error
						throw new Error(err);
					}

					$scope.branchName = data.service;
				});
			};

			$scope.$on('reloadWidget', $scope.reload);
			$scope.reload();
		}
    };
});

