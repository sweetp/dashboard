'use strict';

angular.module('dashboardApp')
    .directive('spdWidget', function() {
    return {
        restrict: 'E',
		transclude: true,
        template: '<div class="widget" ng-transclude></div>'
    };
});
