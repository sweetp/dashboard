'use strict';

angular.module('dashboardApp')
    .controller('ProjectMainCtrl', function($scope) {
        $scope.branchName = 'develop';
		$scope.project = {
            "name": "test",
            "git": {
                "dir": ".git"
            },
            "dir": "\/home\/foo\/repos\/taginator"
        };
});
