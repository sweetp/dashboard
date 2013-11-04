'use strict';

angular.module('dashboardApp')
    .controller('MainCtrl', function($scope) {
		$scope.projects = [
			{
				"name": "taginator",
				"git": {
					"dir": ".git"
				},
				"dir": "\/home\/foo\/repos\/taginator"
			},
			{
				"name": "password-manager-test",
				"dir": "\/home\/foo\/repos\/sweetp-code\/services\/password-manager\/sweetptest"
			}
		];
});
