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
						// TODO show error flash message, not in widget. Errors during loading should be very rare so we need no markup for this
						throw new Error(err);
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

