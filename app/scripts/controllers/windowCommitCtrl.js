'use strict';

angular.module('dashboardApp')
    .controller('WindowCommitCtrl', function($scope, $window, $log) {
		$scope.project = $window.sweetpWindowCommunication.project;
		$scope.onSuccess = function (data) {
			$log.debug('success: ', data.service);

			// close window
			chrome.app.window.current().close();
		};
});
