'use strict';

angular.module('dashboardApp')
	.config(function (KeyboardShortcutsProvider) {
		KeyboardShortcutsProvider.addCombos('viewProject', 'Project View', {
			/*
			 *commit:{
			 *    "description":"Open Commit Window",
			 *    "keys"          : "ctrl c",
			 *    "is_exclusive"  : true
			 *},
			 */
			reload: {
				"description": "Reload",
				"keys": "ctrl r",
				"is_exclusive": true
			}
		});
	})
	.controller('ProjectMainCtrl', function ($scope, $route, $routeParams, Sweetp, KeyboardShortcutsFromSettings, $window) {
		var projectName, widgetCount, counter, reloadWithAppliedScope;

		projectName = $routeParams.name;
		widgetCount = 3;
		counter = 0;

		// init scope properties
		$scope.widgets = {
			loaded: false
		};

		$scope.project = Sweetp.getProjectConfig(projectName);

		// reload widgets
		$scope.$on('widgetLoaded', function () {
			counter++;

			if (counter >= widgetCount) {
				$scope.widgets.loaded = true;
			}
		});

		$scope.reload = function () {
			$scope.widgets.loaded = false;
			counter = 0;

			$scope.$broadcast('reloadWidget');
		};
		reloadWithAppliedScope = function () {
			$scope.$apply($scope.reload);
		};

		// reload widgets on successfull commit
		$scope.onCommitSuccess = $scope.reload;

		// reload widgets on focus
		$window.addEventListener('focus', reloadWithAppliedScope);
		$scope.$on('$destroy', function () {
			$window.removeEventListener('focus', reloadWithAppliedScope);
		});

		$scope.openCommitWindow = function () {
			chrome.app.window.create('windowCommit.html', {
				id: 'commit',
				bounds: {
					width: 400,
					height: 600
				}
			}, function (appWindow) {
					// reload widgets when window disappear
					appWindow.onClosed.addListener($scope.reload);

					// give window access to this project
					if (!appWindow.contentWindow.sweetpWindowCommunication) {
						appWindow.contentWindow.sweetpWindowCommunication = {};
					}
					appWindow.contentWindow.sweetpWindowCommunication.project = $scope.project;
				});
		};

		KeyboardShortcutsFromSettings.getConfiguredCombosFromSettings('viewProject', {
			/*
			 *commit:{
			 *    "on_keydown"    : $scope.openCommitWindow
			 *},
			 */
			reload: {
				"on_keydown": $scope.reload
			}
		}, function (combos) {
				var listener;

				listener = KeyboardShortcutsFromSettings.createListener();

				KeyboardShortcutsFromSettings.applyScopeTo($scope, combos);
				listener.register_many(combos);
			});
	});
