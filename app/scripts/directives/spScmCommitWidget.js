'use strict';

angular.module('dashboardApp')
    .directive('spScmCommitWidget', function() {
    return {
        restrict: 'E',
		scope: {
			project: '=',
			onSuccess: '&'
		},
		controller: function ($scope, $log, Sweetp) {
			var ctrl;

			ctrl = this;
			$scope.errors = null;
			$scope.useAllFiles = 'true';
			$scope.commitMessage = '';

			this.handleServerError = function (err, data, status, scope) {
				scope.errors = [
					err,
					"Service message: " + data.service
				];
				$log.error(err, data, status);
			};

			this.commitAgain = function (project, params, scope, callback) {
				Sweetp.callService(project.name, 'scmenhancer/commit/again', params, function (err, data, status)  {
					if (err) {
						ctrl.handleServerError(err, data, status, scope);
						return;
					}

					callback(null, data);
				});
			};

			this.addAllFilesSwitch = function (params, useAllFiles) {
				if (useAllFiles === "true") {
					params.switches = ["-a"];
				}
			};

			this.fixupCommit = function () {
				var params, scope;
				scope = this;

				// reset errors before new action
				this.errors = null;

				params = {
					command:'fixup'
				};
				ctrl.addAllFilesSwitch(params, this.useAllFiles);

				ctrl.commitAgain(this.project, params, this, function (err, data) {
					if (err) {
						$log.error(err);
						return;
					}

					scope.commitMessage = '';
					scope.onSuccess({data:data});
				});
			};

			this.metaCommit = function (service, scope) {
				var params;

				// reset errors before new action
				scope.errors = null;

				params = {
					message:scope.commitMessage
				};
				ctrl.addAllFilesSwitch(params, scope.useAllFiles);

				Sweetp.callService(this.project.name, service, params, _.bind(function (err, data, status)  {
					if (err) {
						ctrl.handleServerError(err, data, status, scope);
						return;
					}

					scope.commitMessage = '';
					$log.info(data);
				}));
			};

			this.commit = function () {
				ctrl.metaCommit('scm/commit', this);
			};

			this.commitWithTicket = function () {
				ctrl.metaCommit('scmenhancer/commit/with-ticket', this);
			};

			$scope.commit = this.commit;
			$scope.fixupCommit = this.fixupCommit;
			$scope.commitWithTicket = this.commitWithTicket;
		},
        templateUrl: 'templates/spScmCommitWidget.html'
    };
});


