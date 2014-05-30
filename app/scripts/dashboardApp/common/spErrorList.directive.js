'use strict';

angular.module('dashboardApp')
	.directive('spErrorList', function () {
		return {
			scope:{
				errors:'='
			},
			template:
				'<ul ng-if="errors" class="sp-error-list">' +
					'<li ng-repeat="error in errors" class="error-list-item">{{error}}</li>' +
				'</ul>',
			restrict: 'E'
		};
	});
