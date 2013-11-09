'use strict';

angular.module('dashboardApp')
    .controller('OverviewCtrl', function($scope) {
	$scope.projects = [
		{
			"name": "taginator",
			"git": {
				"dir": ".git"
			},
			"dir": "\/home\/foo\/repos\/taginator"
		},
		{
			"name": "password-manager-test",
			"dir": "\/home\/foo\/repos\/sweetp-code\/services\/password-manager\/sweetptest"
		}
	];
	// Settings

	// TODO fetch from local storage
	$scope.settings = {
		serverUrl:"http://localhost:7777/"
	};

	// TODO save to local storage
	$scope.saveSettings = function () {
		if (!$scope.settingsForm.$valid) {
			return;
		}

		console.log('save settings!!');
	};
});

