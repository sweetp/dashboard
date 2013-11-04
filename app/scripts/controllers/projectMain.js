'use strict';

angular.module('dashboardApp')
    .controller('ProjectMainCtrl', function($scope, $route, $routeParams) {
        $scope.branchName = 'develop';

		// TODO fetch by name
		$scope.project = {
            "name": $routeParams.name,
            "git": {
                "dir": ".git"
            },
            "dir": "\/home\/foo\/repos\/taginator"
        };
});
