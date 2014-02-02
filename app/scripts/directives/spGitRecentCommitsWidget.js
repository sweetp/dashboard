'use strict';

angular.module('dashboardApp')
    .directive('spGitRecentCommitsWidget', function() {
    return {
        restrict: 'E',
		scope: {
			project: '='
		},
		controller: function ($scope, Sweetp) {
			$scope.reload = function () {
				$scope.log = [];
				Sweetp.callService($scope.project.name, 'scm/log', null, function (err, data)  {
					if (err) {
						// TODO handle error
						throw new Error(err);
					}

					$scope.log = _.take(data.service, 5).map(function(entry) {
						entry.shortName = entry.name.substr(0, 5);
						entry.shortMessage = entry.shortMessage.trim();
						return entry;
					});
				});
			};

			$scope.$on('reloadWidget', $scope.reload);
			$scope.reload();
		},
        template:
			'<sp-widget>' +
			'	Last 5 commits in branch:' +
			'	<ul>' +
			'		<li ng-repeat="entry in log">' +
			'			<code>{{entry.shortName}}</code> {{entry.shortMessage}}' +
			'		</li>' +
			'	</ul>' +
			'</sp-widget>'
    };
});


