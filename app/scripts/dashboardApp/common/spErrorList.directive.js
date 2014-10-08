'use strict';

angular.module('dashboardApp')
	.directive('spErrorList', function () {
		return {
			restrict: 'E',
			scope: true,
			transclude: true,
			templateUrl: 'scripts/dashboardApp/common/spErrorList.template.html',
			link: function (scope, element, attrs) {
				scope.errorMessage = attrs.errorMessage;
			}
		};
	});
