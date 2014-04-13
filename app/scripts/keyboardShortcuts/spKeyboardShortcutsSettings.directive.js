'use strict';

angular.module('keyboardShortcuts')
	.directive('spKeyboardShortcutsSettings', function(KeyboardShortcuts) {
    return {
        restrict: 'E',
		scope: {
			settings: '=',
		},
		link:function (scope) {
			var keyboardShortcuts = KeyboardShortcuts.create();

			scope.sections = keyboardShortcuts.sectionDescriptions;

			function applyDefaultSettings () {
				_.defaults(scope.settings, keyboardShortcuts.configuredCombos);
			}

			scope.$watch('settings', applyDefaultSettings);
			applyDefaultSettings();
		},
        templateUrl: 'scripts/keyboardShortcuts/spKeyboardShortcutsSettings.template.html'
    };
});

