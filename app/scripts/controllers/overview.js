'use strict';

angular.module('dashboardApp').controller('OverviewCtrl', function($scope, AppSettings, Sweetp, $log) {
	// load projects to display
	$scope.projectsLoaded = false;

	$scope.reloadProjects = function () {
		$scope.projectsLoaded = false;
		Sweetp.loadProjects(function (err, projects) {
			if (err) {
				$scope.projectsLoaded = true;
				throw new Error(err);
			}

			$scope.projects = projects;
			$scope.projectsLoaded = true;
		});
	};
	$scope.reloadProjects();

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

