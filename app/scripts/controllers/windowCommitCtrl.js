'use strict';

angular.module('dashboardApp')
    .controller('WindowCommitCtrl', function($scope, $window) {
		$scope.project = $window.sweetpWindowCommunication.project;
		$scope.onSuccess = function (data) {
			console.log('success: ', data);
			// TODO close window
		};
});
