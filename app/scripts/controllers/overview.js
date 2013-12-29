'use strict';

angular.module('dashboardApp')
    .controller('OverviewCtrl', function($scope, AppSettings, Sweetp, $log) {

	// load projects to display
	Sweetp.loadProjects(function (err, projects) {
		if (err) {
			throw new Error("Could't set loaded projects.");
		}

		$scope.projects = projects;
	});

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

