'use strict';

angular.module('dashboardApp')
	.controller('MainCtrl', function ($scope, $location) {
		/**
		 * Go to a location.
		 *
		 * @param {String} to go to
		 */
		$scope.go = function (to) {
			$location.path(to);
		};
	});
