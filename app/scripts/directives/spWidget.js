'use strict';

angular.module('dashboardApp')
    .directive('spWidget', function() {
    return {
		scope:{},
        restrict: 'E',
		transclude: true,
        template:
			'<div class="widget">' +
				'<ul>' +
					'<li ng-repeat="error in errors">{{error}}</li>' +
				'</ul>' +
				'<div class="inner" ng-transclude></div>' +
			'</div>'
    };
});
