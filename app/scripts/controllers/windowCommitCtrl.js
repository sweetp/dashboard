'use strict';

angular.module('dashboardApp')
    .controller('WindowCommitCtrl', function($scope, $window) {
		$scope.project = $window.sweetpWindowCommunication.project;
});
