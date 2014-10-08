'use strict';

angular.module('dashboardApp')
	.directive('spWidget', function () {
		return {
			scope: {},
			restrict: 'E',
			transclude: true,
			template: '<div class="sp-widget" ng-transclude></div>'
		};
	});
