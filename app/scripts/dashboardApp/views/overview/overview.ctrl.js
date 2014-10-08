'use strict';

angular.module('dashboardApp').controller('OverviewCtrl', function ($scope, AppSettings, Sweetp, $log) {
	var onSettingsSaved;

	// init scope properties
	$scope.projects = {
		list: null,
		loaded: false
	};
	$scope.settings = null;

	$scope.reloadProjects = function () {
		// reset
		$scope.projects.loaded = false;
		$scope.projects.list = null;

		// load
		Sweetp.loadProjects(function (err, projects) {
			if (err) {
				$scope.projects.loaded = true;
				throw new Error(err);
			}

			$scope.projects.list = projects;
			$scope.projects.loaded = true;
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
	onSettingsSaved = function () {
		$scope.reloadProjects();
	};

	AppSettings.on('save', onSettingsSaved);
	$scope.$on('$destroy', function () {
		AppSettings.un('save', onSettingsSaved);
	});
});
