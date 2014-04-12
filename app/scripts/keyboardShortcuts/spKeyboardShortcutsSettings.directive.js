'use strict';

angular.module('keyboardShortcuts')
	.directive('spKeyboardShortcutsSettings', function(KeyboardShortcuts) {
    return {
        restrict: 'E',
		scope: {
			settings: '=',
		},
		link:function (scope) {
			function applyDefaultSettings () {
				_.defaults(scope.settings, KeyboardShortcuts.configuredCombos);
			}

			scope.$watch('settings', applyDefaultSettings);
			applyDefaultSettings();
		},
        templateUrl: 'scripts/keyboardShortcuts/spKeyboardShortcutsSettings.template.html'
    };
});

