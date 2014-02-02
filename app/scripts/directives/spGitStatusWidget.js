'use strict';

angular.module('dashboardApp')
    .directive('spGitStatusWidget', function() {
    return {
        restrict: 'E',
		scope: {
			project: '='
		},
        template: '<sp-widget>Current Branch: {{branchName}}</sp-widget>',
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

