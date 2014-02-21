'use strict';

angular.module('dashboardApp')
    .directive('spScmCommitWidget', function() {
    return {
        restrict: 'E',
		scope: {
			project: '='
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
				var params;

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

					this.commitMessage = '';
					$log.info(data);
					// TODO make notification?!
					// TODO close window
				});
			};

			this.commit = function () {
				var params;

				// reset errors before new action
				this.errors = null;

				params = {
					message:this.commitMessage
				};
				ctrl.addAllFilesSwitch(params, this.useAllFiles);

				Sweetp.callService(this.project.name, 'scm/commit', params, _.bind(function (err, data, status)  {
					if (err) {
						ctrl.handleServerError(err, data, status, this);
						return;
					}

					this.commitMessage = '';
					$log.info(data);
				}, this));
			};

			this.commitWithTicket = function () {
				var params;

				// reset errors before new action
				this.errors = null;

				params = {
					message:this.commitMessage
				};
				ctrl.addAllFilesSwitch(params, this.useAllFiles);

				Sweetp.callService(this.project.name, 'scmenhancer/commit/with-ticket', params, _.bind(function (err, data, status)  {
					if (err) {
						ctrl.handleServerError(err, data, status, this);
						return;
					}

					this.commitMessage = '';
					$log.info(data);
				}, this));
			};

			$scope.commit = this.commit;
			$scope.fixupCommit = this.fixupCommit;
			$scope.commitWithTicket = this.commitWithTicket;
		},
        templateUrl: 'templates/spScmCommitWidget.html'
    };
});


