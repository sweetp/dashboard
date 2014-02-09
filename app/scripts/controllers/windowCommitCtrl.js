'use strict';

angular.module('dashboardApp')
    .controller('WindowCommitCtrl', function($scope, $window) {
		$scope.test = $window.sweetpWindowCommunication.project.name;
});
