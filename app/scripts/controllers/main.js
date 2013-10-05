'use strict';

angular.module('dashboardApp')
    .controller('MainCtrl', function($scope) {
    $scope.things = [
		'HTML5 Boilerplate',
		'AngularJS',
		'Karma'
    ];
});
