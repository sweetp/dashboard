'use strict';

angular.module('dashboardApp')
    .directive('spWidget', function() {
    return {
		scope:{},
        restrict: 'E',
		transclude: true,
        template: '<div class="widget" ng-transclude></div>'
    };
});
