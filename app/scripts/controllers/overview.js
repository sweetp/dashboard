'use strict';

angular.module('dashboardApp').controller('OverviewCtrl', function($scope, AppSettings, Sweetp, $log) {
	// load projects to display
	$scope.projectsLoaded = false;

	$scope.reloadProjects = function () {
		// reset
		$scope.projectsLoaded = false;
		$scope.projects = null;

		// load
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

	// reload projects when settings change
	AppSettings.on('save', function () {
		$scope.reloadProjects();
	});
});

