'use strict';

angular.module('dashboardApp')
    .controller('OverviewCtrl', function($scope, AppSettings, $log) {
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

    // load saved settings or default values
    AppSettings.load(function (settings) {
        $scope.settings = settings;
        $scope.$apply();
    });

	// save to local storage
	$scope.saveSettings = function () {
		if (!$scope.settingsForm.$valid) {
			return;
		}

        $log.info('try to save app settings ...');
        AppSettings.save($scope.settings, function () {
            $log.info('... succeeded!');
        });
	};
});

