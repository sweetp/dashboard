'use strict';

angular.module('dashboardApp')
	.config(function (KeyboardShortcutsProvider) {
		KeyboardShortcutsProvider.addCombos('commitWidget', 'Commit Widget', {
			commit:{
				"description":"Commit",
				"keys"          : "ctrl c",
				"is_exclusive"  : true
			},
			commitWithTicket:{
				"description":"Commit with ticket",
				"keys"          : "ctrl t",
				"is_exclusive"  : true
			},
			fixupCommit:{
				"description":"Commit fixup",
				"keys"          : "ctrl f",
				"is_exclusive"  : true
			},
			selectAllFiles:{
				"description":"Select 'all files' for commit",
				"keys"          : "ctrl u a",
				"is_sequence"   : true,
				"is_exclusive"  : true
			},
			selectStagedFiles:{
				"description":"Select 'only staged files' for commit",
				"keys"          : "ctrl u s",
				"is_sequence"   : true,
				"is_exclusive"  : true
			}
		});
	})
	.directive('spScmCommitWidget', function() {
    return {
        restrict: 'E',
		scope: {
			project: '=',
			onSuccess: '&'
		},
		controller: function ($scope, $log, Sweetp, Notifications, KeyboardShortcutsFromSettings) {
			var ctrl;

			ctrl = this;

			$scope.state = {
				errors:null
			};

			$scope.commitParams = {
				useAllFiles:'true',
				message:''
			};

			this.createSuccessNotification = function (data, callback) {
				Notifications.createBasicNotification({
					title:'Commit',
					message:data.service
				}, callback);
			};

			this.handleServerError = function (err, data, status) {
				$scope.state.errors = [
					err,
					"Service message: " + data.service
				];
				$log.error(err, data, status);
			};

			this.commitAgain = function (project, params, callback) {
				Sweetp.callService(project.name, 'scmenhancer/commit/again', params, function (err, data, status)  {
					if (err) {
						ctrl.handleServerError(err, data, status);
						return;
					}

					ctrl.createSuccessNotification(data, function () {
						callback(null, data);
					});
				});
			};

			this.addAllFilesSwitch = function (params) {
				if ($scope.commitParams.useAllFiles === "true") {
					params.switches = ["-a"];
				}
			};

			this.fixupCommit = function () {
				var params;

				// reset errors before new action
				$scope.state.errors = null;

				params = {
					command:'fixup'
				};
				ctrl.addAllFilesSwitch(params);

				ctrl.commitAgain($scope.project, params, function (err, data) {
					if (err) {
						$log.error(err);
						return;
					}

					$scope.commitParams.message = '';
					$scope.onSuccess({data:data});
				});
			};

			this.metaCommit = function (service) {
				var params;

				// reset errors before new action
				$scope.state.errors = null;

				params = {
					message:$scope.commitParams.message
				};
				ctrl.addAllFilesSwitch(params);

				Sweetp.callService($scope.project.name, service, params, function (err, data, status)  {
					if (err) {
						ctrl.handleServerError(err, data, status);
						return;
					}

					$scope.commitParams.message = '';
					ctrl.createSuccessNotification(data, function () {
						$scope.onSuccess({data:data});
					});
				});
			};

			this.commit = function () {
				ctrl.metaCommit('scm/commit');
			};

			this.commitWithTicket = function () {
				ctrl.metaCommit('scmenhancer/commit/with-ticket');
			};

			$scope.commit = this.commit;
			$scope.fixupCommit = this.fixupCommit;
			$scope.commitWithTicket = this.commitWithTicket;

			KeyboardShortcutsFromSettings.getConfiguredCombosFromSettings('commitWidget', {
				commit:{
					"on_keydown"    : ctrl.commit
				},
				commitWithTicket:{
					"on_keydown"    : ctrl.commitWithTicket
				},
				fixupCommit:{
					"on_keydown"    : ctrl.fixupCommit
				},
				selectAllFiles:{
					"on_keydown"    : function () {
						$scope.commitParams.useAllFiles = 'true';
					}
				},
				selectStagedFiles:{
					"on_keydown"    : function () {
						$scope.commitParams.useAllFiles = 'false';
					}
				}
			}, function (combos) {
				var listener;

				listener = KeyboardShortcutsFromSettings.createListener();

				KeyboardShortcutsFromSettings.applyScopeTo($scope, combos);
				listener.register_many(combos);

				$scope.$on('$destroy', function () {
					listener.reset();
				});
			});
		},
        templateUrl: 'scripts/dashboardApp/widgets/spScmCommitWidget.template.html'
    };
});

