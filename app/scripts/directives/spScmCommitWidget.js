'use strict';

angular.module('dashboardApp')
    .directive('spScmCommitWidget', function() {
    return {
        restrict: 'E',
		scope: {
			project: '=',
			onSuccess: '&'
		},
		controller: function ($scope, $log, Sweetp, Notifications) {
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
				var message, icon, problems;

				icon = Notifications.icons.success;
				problems = [];

				if (data.service.match(/nothing to commit/) ||
					data.service.match(/nothing added to commit but/)) {
					problems.push("Nothing to commit.");
					icon = Notifications.icons.info;
				}

				if (data.service.match(/untracked files/)) {
					problems.push("Untracked files.");
					icon = Notifications.icons.warning;
				}

				if (problems.length) {
					message = problems.join(' ');
				} else {
					message = "Sucessfull commitet your changes.";
				}

				Notifications.createBasicNotification({
					title:'Commit',
					message:message,
					iconUrl:icon
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
		},
        templateUrl: 'templates/spScmCommitWidget.html'
    };
});


