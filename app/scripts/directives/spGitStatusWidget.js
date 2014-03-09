'use strict';

angular.module('dashboardApp')
    .directive('spGitStatusWidget', function() {
    return {
        restrict: 'E',
		scope: {
			project: '='
		},
        templateUrl: 'templates/spGitStatusWidget.html',
		controller: function ($scope, $log, Sweetp) {
			var setBranchName, checkForRemoteBranch,
				checkForCommitsAheadOfRemote, finish;

			$scope.errors = null;

			setBranchName = function (err, data, status)  {
				if (err) {
					$scope.errors = [
						err,
						"Service message: " + data.service
					];
					$log.error(err, data, status);
					finish();
					return;
				}

				checkForRemoteBranch(data.service);
			};

			checkForRemoteBranch = function (branchName) {
				var params, remoteBranchName;

				remoteBranchName = 'origin/' + branchName;
				params = {
					name:remoteBranchName
				};

				// check if remote branch exists
				Sweetp.callService($scope.project.name, 'scm/commit/by/ref', params, function (err, data, status) {
					if (err) {
						// check if branch doesn't exist
						if (status === 500 && data.service.match(/no ref found/)) {
							// no remote branch, set local branch name
							$scope.branchName = branchName;
						} else {
							// normal error
							$scope.errors = [
								err,
								"Service message: " + data.service
							];
							$log.error(err, data, status);
						}

						finish();
						return;
					}

					checkForCommitsAheadOfRemote(branchName, remoteBranchName);
					finish();
				});
			};

			checkForCommitsAheadOfRemote = function (branchName, remoteBranchName) {
				var params;

				params = {
					since:remoteBranchName
				};

				// get commits between remote and HEAD
				Sweetp.callService($scope.project.name, 'scm/log', params, function (err, data, status) {
					if (err) {
						$scope.errors = [
							err,
							"Service message: " + data.service
						];
						$log.error(err, data, status);
						finish();
						return;
					}

					$scope.branchName = branchName;
					$scope.remoteBranchName = remoteBranchName;
					$scope.commitsAhead = data.service.length;
					finish();
				});
			};

			$scope.reload = function () {
				$scope.branchName = null;
				$scope.remoteBranchName = null;
				$scope.commitsAhead = 0;

				Sweetp.callService($scope.project.name, 'scm/branch/name', null, setBranchName);
			};

			finish = function () {
				$scope.$emit('widgetLoaded');
			};

			$scope.$on('reloadWidget', $scope.reload);
			$scope.reload();
		}
    };
});

